const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {WebSocket}=require('ws'),{createGameServer}=require('../server'),rules=require('../game-rules');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function setup(t){const game=createGameServer({adminToken:'',ownerKey:''});await new Promise(r=>game.server.listen(0,'127.0.0.1',r));t.after(async()=>{for(const c of game.clients.values())c.ws.terminate();await new Promise(r=>game.wss.close(r));await new Promise(r=>game.server.close(r))});return{game,url:'ws://127.0.0.1:'+game.server.address().port+'/ws'}}
async function connect(env){const ws=new WebSocket(env.url),messages=[];ws.on('message',raw=>messages.push(JSON.parse(raw)));const c={ws,messages,send:m=>ws.send(JSON.stringify(m)),wait:async(fn,from=0)=>{const start=Date.now();while(true){const m=messages.slice(from).find(fn);if(m)return m;if(Date.now()-start>3000)throw Error('Response timeout');await delay(5)}}};c.id=(await c.wait(m=>m.type==='hello')).peer;c.join=async room=>{const from=messages.length;c.send({type:'join',room});const m=await c.wait(m=>m.type==='join',from);c.slot=m.baseSlot;return m};c.presence=async data=>{const from=messages.length;c.send({type:'presence',data});await c.wait(m=>m.type==='peers'&&m.peers.some(p=>p.peer===c.id),from)};c.emit=(event,data)=>c.send({type:'emit',event,data});return c}
const packet=(m,kind,id)=>m.type==='event'&&m.event==='theft'&&m.data.kind===kind&&(!id||m.data.id===id);
async function pair(t){const env=await setup(t),owner=await connect(env),thief=await connect(env);await owner.join('hb-testing');await thief.join('hb-testing');const p=rules.slotPosition(owner.slot,0);await owner.presence({nm:'Owner',s:[7,8],px:-32,pz:21,py:0,lk:false});await thief.presence({nm:'Thief',s:[],px:p.x,pz:p.z,py:0});return{env,owner,thief,p}}
async function steal(owner,thief){thief.emit('steal',{to:owner.id,slot:0,bi:7});const m=await thief.wait(m=>packet(m,'carry'));await owner.wait(x=>packet(x,'taken',m.data.id));return m.data.id}
test('all eight clients see identical unique base assignments; remaining bases do not shuffle',async t=>{
 const env=await setup(t),clients=[];for(let i=0;i<8;i++){const c=await connect(env);await c.join('hb-bases');clients.push(c)}
 const rosters=await Promise.all(clients.map(c=>c.wait(m=>m.type==='peers'&&m.peers.length===8)));
 const expected=rosters[0].peers.map(p=>[p.peer,p.baseSlot]);
 assert.equal(new Set(expected.map(p=>p[1])).size,8);
 for(const roster of rosters)assert.deepEqual(roster.peers.map(p=>[p.peer,p.baseSlot]),expected);
 const html=fs.readFileSync(require.resolve('../index.html'),'utf8'),field=html.match(/const field=\(\)=>[^\n]+/)[0];
 for(let i=0;i<8;i++){const peers=rosters[i].peers.filter(p=>!p.isMe);const ctx=vm.createContext({peers,pads:Array(8).fill({}),myBaseSlot:clients[i].slot,B:[]});vm.runInContext(field,ctx);const view=vm.runInContext('field()',ctx);for(const player of view)assert.equal(player.pad,expected.find(x=>x[0]===player.peer)[1]);assert.equal(view.length,7)}
 const beforeLeave=clients[0].messages.length;clients[2].ws.close();await clients[0].wait(m=>m.type==='peers'&&m.peers.length===7,beforeLeave);
 const replacement=await connect(env);await replacement.join('hb-bases');assert.equal(replacement.slot,2);
 const last=await replacement.wait(m=>m.type==='peers'&&m.peers.length===8);for(const c of clients.filter((_,i)=>i!==2))assert.equal(last.peers.find(p=>p.peer===c.id).baseSlot,c.slot);
});
test('a distant bonk cannot recover a stolen item; a close bonk returns it exactly once',async t=>{
 const {owner,thief,p}=await pair(t),id=await steal(owner,thief);
 await owner.presence({s:[-1,8],px:60,pz:80,py:0});
 owner.emit('hit',{to:thief.id});await delay(70);assert.equal(owner.messages.some(m=>packet(m,'returned',id)),false);
 await owner.presence({s:[-1,8],px:p.x+1,pz:p.z,py:0});await delay(560);owner.emit('hit',{to:thief.id});
 const returned=await owner.wait(m=>packet(m,'returned',id));assert.equal(returned.data.slot,0);assert.equal(returned.data.bi,7);await thief.wait(m=>packet(m,'returned',id));
 thief.emit('bank',{id});owner.emit('ret',{to:owner.id,bi:7});await delay(50);assert.equal(owner.messages.filter(m=>packet(m,'returned',id)).length,1);
});
test('stealing is proximity/lock checked and banking works only inside the thief’s assigned base',async t=>{
 const {owner,thief,p}=await pair(t);
 await thief.presence({px:0,pz:0});thief.emit('steal',{to:owner.id,slot:0,bi:7});await thief.wait(m=>packet(m,'denied'));
 await thief.presence({px:p.x,pz:p.z});await owner.presence({lk:true});let from=thief.messages.length;thief.emit('steal',{to:owner.id,slot:0,bi:7});await thief.wait(m=>packet(m,'denied'),from);
 await owner.presence({lk:false});const id=await steal(owner,thief);
 thief.emit('bank',{id});await thief.wait(m=>packet(m,'bankBlocked'));
 const base=rules.bases[thief.slot];await thief.presence({px:base.x,pz:base.z});thief.emit('bank',{id});
 const banked=await thief.wait(m=>packet(m,'banked',id));assert.equal(banked.data.bi,7);assert.equal(banked.data.slot,0);await owner.wait(m=>packet(m,'lost',id));
});
test('disconnect returns the brainrot to its reserved slot, even with a stale inventory update',async t=>{
 const {env,owner,thief}=await pair(t),id=await steal(owner,thief);
 await owner.presence({s:[7,8,9,10,11,12,13,14]});
 let ownerState=[...env.game.clients.values()].find(c=>c.id===owner.id);assert.equal(ownerState.presence.s[0],-1);
 thief.ws.close();await owner.wait(m=>packet(m,'returned',id));
 await owner.presence({s:[-1,8,9,10,11,12,13,14]});assert.equal(ownerState.presence.s[0],7);
});
test('rebirth immediately resets and saves $100 with an empty inventory',()=>{
 const html=fs.readFileSync(require.resolve('../index.html'),'utf8'),fn=html.match(/function performRebirth\(\)\{[^\n]+/)[0];
 const ctx=vm.createContext({cash:50000,reb:0,mine:Array(16).fill({}),carry:null,heist:null,raid:null,esc:null,pendingTaken:new Map(),pendingDeliveries:new Map(),BrainrotRules:rules,toast:()=>{},sync:()=>{},rebCost:()=>50000});
 vm.runInContext('function save(){saved={cash,reb,mine:mine.slice()}};'+fn,ctx);assert.equal(vm.runInContext('performRebirth()',ctx),true);assert.equal(ctx.cash,100);assert.equal(ctx.reb,1);assert.equal(ctx.saved.cash,100);assert.ok(ctx.saved.mine.every(x=>x===null));
});
test('the same rebirth cannot be used to erase an in-flight stolen brainrot',()=>{
 const html=fs.readFileSync(require.resolve('../index.html'),'utf8'),fn=html.match(/function performRebirth\(\)\{[^\n]+/)[0];
 const ctx=vm.createContext({cash:50000,reb:0,mine:[],carry:null,heist:null,raid:null,esc:null,pendingTaken:new Map([['theft',{slot:0,bi:7}]]),BrainrotRules:rules,toast:()=>{},sync:()=>{},save:()=>{},rebCost:()=>50000});
 vm.runInContext(fn,ctx);assert.equal(vm.runInContext('performRebirth()',ctx),false);assert.equal(ctx.cash,50000);
});
test('the existing frontend reserves, restores, and banks the same stolen item',()=>{
 const html=fs.readFileSync(require.resolve('../index.html'),'utf8'),fn=html.slice(html.indexOf('function onTheft(m)'),html.indexOf('const EVN={}'));
 const ctx=vm.createContext({mine:[{n:'Item'},null],B:Array.from({length:10},(_,i)=>({n:'Item '+i})),pendingTaken:new Map(),heist:{},raid:null,carry:null,stolen:0,toast:()=>{},bar:()=>{},sync:()=>{},save:()=>{},now:()=>0});
 vm.runInContext('function startCarry(b,src){carry={b,src}};function endCarry(){carry=null};'+fn,ctx);
 const deliver=data=>ctx.onTheft({data});
 deliver({kind:'taken',id:'one',slot:0,bi:7,thief:'b',name:'Bob'});assert.equal(ctx.mine[0],null);assert.equal(ctx.pendingTaken.size,1);
 deliver({kind:'returned',id:'one',bi:7});assert.equal(ctx.mine[0].n,'Item 7');assert.equal(ctx.pendingTaken.size,0);
 ctx.mine[0]=null;deliver({kind:'returned',id:'one',bi:7});assert.equal(ctx.mine[0],null,'duplicate return must not create another item');
 deliver({kind:'carry',id:'two',bi:8,owner:'a',name:'Alice'});assert.equal(ctx.carry.src.id,'two');assert.equal(ctx.heist,null);
 deliver({kind:'banked',id:'two',bi:8,slot:1});assert.equal(ctx.mine[1].n,'Item 8');assert.equal(ctx.carry,null);assert.equal(ctx.stolen,1);
});
test('claiming a server base moves the owner marker, spawn, camera, and return beacon together',()=>{
 const html=fs.readFileSync(require.resolve('../index.html'),'utf8'),fn=html.match(/function claimBase\(slot\)\{[\s\S]*?\n\}/)[0];
 const vector=()=>({set(x,y,z){this.x=x;this.y=y;this.z=z}});
 const pads=rules.bases.map(p=>({g:{position:{...p}},o:p.x<0?1:-1,roofL:{visible:true},on2:false,conG:{add(label){this.label=label}}}));
 const ctx=vm.createContext({pads,own:pads[0],myBaseSlot:0,OWN:{...rules.bases[0]},HW:10,consoleLabel:{},pk:'old',P:{},bcn:{position:vector()},me:{position:vector()},C:{position:vector()},FC:[{}],fcT:50,setSlot:()=>{},nameBase:(p,n)=>{p.name=n},sync:()=>{}});
 vm.runInContext(fn,ctx);ctx.claimBase(6);
 assert.equal(ctx.own,pads[6]);assert.equal(ctx.OWN.x,32);assert.equal(ctx.OWN.z,21);assert.equal(ctx.P.x,19);assert.equal(ctx.P.z,21);assert.equal(ctx.bcn.position.x,32);assert.equal(ctx.bcn.position.z,21);assert.equal(pads[6].name,'YOUR BASE');assert.equal(pads[0].name,'');
});

test('server rejects hits while carrying or stunned, broadcasts ragdolls to spectators, and allows recovery',async t=>{
 const {env,owner,thief,p}=await pair(t);const spectator=await connect(env);await spectator.join('hb-testing');await owner.presence({px:p.x+1,pz:p.z,py:0,cb:7});
 owner.emit('hit',{to:thief.id});await delay(60);assert.equal(thief.messages.some(m=>m.event==='hit'),false);
 await owner.presence({cb:-1});owner.emit('hit',{to:thief.id});const hit=await thief.wait(m=>m.event==='hit');assert.equal(hit.data.duration,1.5);assert.ok(Math.abs(hit.data.vx)>17);await spectator.wait(m=>m.event==='hit'&&m.data.to===thief.id);
 thief.emit('hit',{to:owner.id});await delay(60);assert.equal(owner.messages.some(m=>m.event==='hit'&&m.peer===thief.id),false);
 await delay(1500);thief.emit('hit',{to:owner.id});await owner.wait(m=>m.event==='hit'&&m.peer===thief.id);
});
