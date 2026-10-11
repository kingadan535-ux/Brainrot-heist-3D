/* Compatibility layer for the game's existing room API. Gameplay code unchanged. */
(()=>{
let ws,peer=null,admin=false;const listeners=new Map(),roomListeners=new Map(),joined=new Map();let hubPresence={},roomCode=null;const pending=new Map();
const fire=(map,key,data)=>{for(const f of map.get(key)||[])try{f(data)}catch(e){console.error(e)}};
const on=(map,key,fn)=>{if(!map.has(key))map.set(key,new Set());map.get(key).add(fn);return()=>map.get(key)?.delete(fn)};
function connect(){return new Promise((resolve,reject)=>{
 const scheme=location.protocol==='https:'?'wss:':'ws:';
 ws=new WebSocket(scheme+'//'+location.host+'/ws');
 ws.onopen=resolve;ws.onerror=()=>reject(Error('Connection failed'));
 ws.onclose=()=>{roomCode=null;fire(listeners,'disconnect',{})};
 ws.onmessage=e=>{
  let m;try{m=JSON.parse(e.data)}catch{return}
  if(m.type==='hello')peer=m.peer;
  if(m.type==='auth'){admin=m.ok;fire(listeners,'auth',m.ok)}
  if(m.type==='join'){const p=pending.get(m.room);if(p){pending.delete(m.room);m.ok?p.resolve():p.reject(Error(m.error||'Cannot join'))}}
  if(m.type==='lobbies'){const peers=Object.entries(m.counts).flatMap(([lb,count])=>Array.from({length:count},(_,i)=>({peer:lb+'-'+i,kind:'viewer',presence:{lb}})));fire(listeners,'lobbies',{peers})}
  if(m.type==='peers'){const r=joined.get(m.room);if(r){r.peers=m.peers;fire(roomListeners,m.room+':peers',{peers:m.peers})}}
  if(m.type==='event')fire(roomListeners,m.room+':'+m.event,m);
 };
})}

const send=x=>{if(ws?.readyState===1)ws.send(JSON.stringify(x))};
const hub={onPeers:f=>on(listeners,'lobbies',f),presence:async d=>{hubPresence={...hubPresence,...d}},join:async code=>{if(!/^hb-[a-z0-9]{3,12}$/.test(code))throw Error('Invalid lobby');if(roomCode===code&&joined.has(code))return joined.get(code);await new Promise((resolve,reject)=>{pending.set(code,{resolve,reject});send({type:'join',room:code});setTimeout(()=>{if(pending.has(code)){pending.delete(code);reject(Error('Join timeout'))}},6000)});roomCode=code;const r={peers:[],onPeers:f=>{const off=on(roomListeners,code+':peers',f);f({peers:r.peers});return off},on:(event,f)=>on(roomListeners,code+':'+event,f),presence:async d=>send({type:'presence',data:d}),emit:async(event,data)=>send({type:'emit',event,data}),leave:async()=>{if(roomCode===code){send({type:'leave'});roomCode=null}joined.delete(code)}};joined.set(code,r);return r}};
window.claude={use:async kind=>{if(kind==='room'){if(!ws||ws.readyState!==1)await connect();return hub}if(kind==='user')return {isOwner:()=>admin,canEdit:()=>admin};throw Error('Unknown service')}};
window.brainrotAdminLogin=token=>{send({type:'auth',token});return new Promise(resolve=>{const off=on(listeners,'auth',ok=>{off();resolve(ok)})})};
window.brainrotConnection=()=>ws?.readyState===1;
})();
