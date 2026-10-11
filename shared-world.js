const crypto=require('node:crypto');
const catalog=require('./game-catalog.json');
const rules=require('./game-rules');
const delivery=require('./delivery-route');
const movement=require('./movement');
// One conveyor per lobby. Clients receive identities and positions, never roll their own online stock.
function createWorlds({members,event,roster,thefts,clock=Date.now,random=Math.random}){
 const worlds=new Map(),valid=i=>Number.isInteger(i)&&!!catalog.items[i];
 const defaults=()=>({base:2.2,g3:300,g4:900,mc:35,auto:[]});
 function get(room){if(!worlds.has(room))worlds.set(room,{items:[],queue:[],cfg:defaults(),next:0,last:clock(),sent:0,timers:{},effect:null});return worlds.get(room)}
 const speed=w=>w.effect?.k==='frenzy'?6:3;
 function snapshot(c){const w=get(c.room);event(c,'world',{items:w.items.map(({buyerClient,...o})=>({...o,route:o.route?.map(p=>({...p}))})),speed:speed(w),cfg:w.cfg,effect:w.effect,at:clock()})}
 function broadcast(room){for(const c of members(room))snapshot(c)}
 function pick(tier){const pool=catalog.items.slice(0,catalog.baseCount).map((b,i)=>({i,t:b.t})).filter(b=>tier==null||b.t===tier);const counts={};for(const b of pool)counts[b.t]=(counts[b.t]||0)+1;const weight=b=>catalog.weights[b.t]/counts[b.t];let n=random()*pool.reduce((s,b)=>s+weight(b),0);for(const b of pool){n-=weight(b);if(n<=0)return b.i}return pool.at(-1).i}
 function tick(){const time=clock();for(const [room,w] of worlds){if(!members(room).length){worlds.delete(room);continue}const dt=Math.min((time-w.last)/1000,2);w.last=time;for(const o of [...w.items]){if(o.buyer){if(delivery.advance(o,dt,delivery.speed))arrive(w,o)}else o.z+=dt*speed(w)}w.items=w.items.filter(o=>o.buyer||o.z<=92);if(w.effect&&w.effect.end<=time)w.effect=null;
  if(time>=w.next){w.next=time+(w.effect?.k==='frenzy'?1600:w.cfg.base*1000+1000);let i=pick();const mu=catalog.mutations[w.effect?.k];if(mu&&random()*100<w.cfg.mc)i+=catalog.baseCount*(random()<.12?12:mu);if(w.queue.length<32)w.queue.push(i)}
  const periodic=(key,sec,fn)=>{const n=Math.floor(time/1000/sec);if(w.timers[key]!==undefined&&w.timers[key]!==n)fn();w.timers[key]=n};
  for(const tier of [3,4])periodic('g'+tier+'_'+w.cfg['g'+tier],w.cfg['g'+tier],()=>{if(w.queue.length<32)w.queue.push(pick(tier))});
  for(const a of w.cfg.auto)periodic('a'+a.i+'_'+a.sec,a.sec,()=>{if(w.queue.length<32)w.queue.push(a.i)});
  if(w.queue.length&&w.items.filter(o=>!o.buyer).every(o=>o.z>-88.2))w.items.push({id:crypto.randomUUID(),i:w.queue.shift(),x:0,y:0,z:-95.2,revision:0});
  if(time-w.sent>=400){w.sent=time;broadcast(room)}
 }}
 function admin(c,d){const w=get(c.room);if(d.k==='spawn'){if(valid(d.i)&&w.queue.length<32)w.queue.push(d.i);return true}
  if(d.k==='cfg'){const v=d.c||{},num=(x,lo,hi,f)=>Math.max(lo,Math.min(hi,Number(x)||f));w.cfg={base:num(v.base,.3,60,2.2),g3:num(v.g3,10,86400,300),g4:num(v.g4,10,86400,900),mc:Math.max(0,Math.min(100,Number(v.mc)||0)),auto:(Array.isArray(v.auto)?v.auto:[]).slice(0,12).filter(a=>a&&valid(a.i)).map(a=>({i:a.i,sec:num(a.sec,3,3600,60)}))};}
  else if(d.k==='stop')w.effect=null;else if(catalog.mutations[d.k])w.effect={k:d.k,id:String(d.id||''),end:clock()+Math.min(300,Math.max(1,+d.d||30))*1000};broadcast(c.room);return false
 }
 function grant(c,d){if(!c.admin||!valid(d.i))return;const slot=thefts.free(c);if(slot<0)return event(c,'purchase',{ok:false,message:'Your base is full'});thefts.inventory(c,slot,d.i);event(c,'purchase',{ok:true,admin:true,bi:d.i,slot,price:0,id:crypto.randomUUID()});roster(c.room)}
 function refund(o,reason){const c=o.buyerClient;if(!c)return;c.deliverySlots?.delete(o.id);c.presence.cash=(c.presence.cash||0)+o.price;event(c,'purchase',{ok:true,kind:'refund',id:o.id,orderId:o.orderId,bi:o.i,price:o.price,reason})}
 function release(c){for(const [room,w] of worlds){for(const o of w.items.filter(o=>o.buyer===c.id)){refund(o,'left');w.items=w.items.filter(x=>x!==o)}if(room===c.room)broadcast(room)}}
 function arrive(w,o){const c=o.buyerClient;if(!c||c.room!==o.room){w.items=w.items.filter(x=>x!==o);return}c.deliverySlots?.delete(o.id);thefts.inventory(c,o.slot,o.i);w.items=w.items.filter(x=>x!==o);event(c,'purchase',{ok:true,kind:'delivered',id:o.id,orderId:o.orderId,bi:o.i,slot:o.slot,price:0});roster(c.room)}
 function buy(c,d){const w=get(c.room),o=w.items.find(o=>o.id===d.id),deny=message=>event(c,'purchase',{ok:false,message});
  if(!o)return deny('That brainrot already arrived or left the belt');if(o.buyer===c.id)return deny('This brainrot is already walking to your base');if(d.revision!==o.revision)return deny('Someone just bought it. Try again to redirect it');if(c.carryTheft||c.presence.cb>=0||c.stunUntil>clock())return deny('Finish carrying or recovering first');
  if(!rules.near(c.presence,{x:o.x||0,z:o.z,y:o.y||0},5.2)||!movement.clearLine({x:c.presence.px,z:c.presence.pz},{x:o.x||0,z:o.z}))return deny('Move closer to the brainrot');const slot=thefts.free(c),price=catalog.items[o.i].p;if(slot<0)return deny('Your base is full');if(!(c.presence.cash>=price))return deny('Not enough cash');
  if(o.buyer)refund(o,'redirected');c.presence.cash-=price;(c.deliverySlots||=new Map()).set(o.id,slot);Object.assign(o,{buyer:c.id,buyerName:c.presence.nm||'Player',buyerClient:c,room:c.room,slot,price,orderId:crypto.randomUUID(),revision:o.revision+1,route:delivery.plan(o,c.baseSlot,slot)});
  event(c,'purchase',{ok:true,kind:'ordered',id:o.id,orderId:o.orderId,bi:o.i,slot,price});broadcast(c.room);roster(c.room)
 }
 return {get,tick,snapshot,admin,grant,buy,release,worlds};
}
module.exports={createWorlds};
