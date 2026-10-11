const crypto=require('node:crypto');
const rules=require('./game-rules');
function createThefts({members,event,roster}){
 const active=new Map();
 const reserved=c=>new Set([...active.values()].filter(t=>t.owner===c).map(t=>t.slot));
 const free=c=>{const used=reserved(c),s=c.presence.s||[],n=c.presence.f2?16:8;for(let i=0;i<n;i++)if(!used.has(i)&&!(Number.isInteger(s[i])&&s[i]>=0))return i;return -1};
 function inventory(c,slot,value){c.presence.s=Array.from({length:16},(_,i)=>c.presence.s?.[i]??-1);c.presence.s[slot]=value;(c.inventoryPatches||=new Map()).set(slot,value)}
 function applyPresence(c,safe){
  if(safe.s){for(const [slot,value] of c.inventoryPatches||[]){if(safe.s[slot]===value)c.inventoryPatches.delete(slot);else safe.s[slot]=value}for(const slot of reserved(c))safe.s[slot]=-1}
  safe.cb=c.carryTheft?active.get(c.carryTheft)?.bi??-1:safe.cb;
  if(safe.cb===undefined)delete safe.cb;
 }
 function finish(t,kind,reason){
  if(!active.has(t.id))return;
  let destination=-1;
  if(kind==='banked'){destination=free(t.thief);if(destination<0)return false}
  active.delete(t.id);t.thief.carryTheft=null;t.thief.presence.cb=-1;
  if(kind==='returned')inventory(t.owner,t.slot,t.bi);else inventory(t.thief,destination,t.bi);
  event(t.owner,'theft',{kind:kind==='returned'?'returned':'lost',id:t.id,bi:t.bi,slot:t.slot,reason});
  event(t.thief,'theft',{kind,id:t.id,bi:t.bi,slot:destination,reason});
  roster(t.owner.room);return true;
 }
 function steal(c,d){
  const owner=members(c.room).find(x=>x.id===d.to),slot=d.slot;
  const deny=message=>event(c,'theft',{kind:'denied',message});
  if(!owner||owner===c||c.carryTheft||!Number.isInteger(slot)||slot<0||slot>7)return deny('Cannot steal that brainrot');
  const bi=owner.presence.s?.[slot];
  if(!Number.isInteger(bi)||bi<0||bi!==d.bi||owner.presence.lk||reserved(owner).has(slot))return deny('That brainrot moved or the base is locked');
  if(!rules.near(c.presence,rules.slotPosition(owner.baseSlot,slot),5.5))return deny('Move closer to the brainrot');
  if(free(c)<0)return deny('Free a slot in your base first');
  const t={id:crypto.randomUUID(),owner,thief:c,slot,bi};active.set(t.id,t);c.carryTheft=t.id;
  inventory(owner,slot,-1);c.presence.cb=bi;
  event(owner,'theft',{kind:'taken',id:t.id,bi,slot,thief:c.id,name:c.presence.nm||'A player'});
  event(c,'theft',{kind:'carry',id:t.id,bi,owner:owner.id,name:owner.presence.nm||'A player'});
  roster(c.room);
 }
 function bank(c,d){const t=active.get(c.carryTheft);if(!t||d.id!==t.id)return;if(!rules.atBase(c.presence,c.baseSlot))return event(c,'theft',{kind:'bankBlocked',message:'Bring it inside your own base'});if(finish(t,'banked')===false)event(c,'theft',{kind:'bankBlocked',message:'Your base is full'})}
 function hit(target){const t=active.get(target.carryTheft);if(t)finish(t,'returned','bonk')}
 function release(c){for(const t of [...active.values()])if(t.owner===c||t.thief===c)finish(t,'returned','disconnect')}
 return {steal,bank,hit,release,applyPresence,active};
}
module.exports={createThefts};
