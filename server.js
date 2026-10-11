const express=require('express');
const http=require('http');
const {WebSocketServer,WebSocket}=require('ws');
const crypto=require('crypto');
const app=express();app.use(express.static(__dirname,{index:'index.html'}));
const server=http.createServer(app);const wss=new WebSocketServer({server,path:'/ws'});
const clients=new Map();const MAX=8;
const send=(ws,obj)=>{if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(obj))};
const validRoom=s=>typeof s==='string'&&/^hb-[a-z0-9]{3,12}$/.test(s);
const members=room=>[...clients.values()].filter(c=>c.room===room);
function roster(room){return members(room).map(c=>({peer:c.id,kind:'viewer',presence:c.presence,isMe:false}))}
function update(room){if(!room)return;const list=roster(room);for(const c of members(room))send(c.ws,{type:'peers',room,peers:list.map(p=>({...p,isMe:p.peer===c.id}))});for(const c of clients.values())send(c.ws,{type:'lobbies',counts:Object.fromEntries([...new Set([...clients.values()].map(x=>x.room).filter(Boolean))].map(r=>[r.slice(3),members(r).length]))})}
wss.on('connection',ws=>{const c={ws,id:crypto.randomUUID(),room:null,presence:{},admin:false};clients.set(ws,c);send(ws,{type:'hello',peer:c.id});update(null);
ws.on('message',raw=>{if(raw.length>16000)return;let m;try{m=JSON.parse(raw)}catch{return}if(!m||typeof m!=='object')return;
if(m.type==='auth'){c.admin=!!process.env.ADMIN_TOKEN&&typeof m.token==='string'&&m.token===process.env.ADMIN_TOKEN;send(ws,{type:'auth',ok:c.admin});return}
if(m.type==='join'){if(!validRoom(m.room))return send(ws,{type:'join',room:m.room,ok:false,error:'Invalid lobby'});if(c.room!==m.room&&members(m.room).length>=MAX)return send(ws,{type:'join',room:m.room,ok:false,error:'Lobby full'});const old=c.room;c.room=m.room;c.presence={};send(ws,{type:'join',room:c.room,ok:true});update(old);update(c.room);return}
if(m.type==='leave'){const old=c.room;c.room=null;c.presence={};update(old);return}
if(m.type==='presence'){if(!c.room||!m.data||typeof m.data!=='object')return;const d=m.data;const safe={};if(typeof d.nm==='string')safe.nm=d.nm.slice(0,20);if(Array.isArray(d.s))safe.s=d.s.slice(0,8).map(x=>Number.isInteger(x)&&x>=-1&&x<1000?x:-1);for(const k of ['px','pz','cash','cb'])if(Number.isFinite(d[k]))safe[k]=Math.max(-1000000,Math.min(1000000,d[k]));if(typeof d.lk==='boolean')safe.lk=d.lk;c.presence={...c.presence,...safe};update(c.room);return}
if(m.type==='emit'){if(!c.room||!['raid','rres','hit','ret','evt'].includes(m.event)||!m.data||typeof m.data!=='object')return;if(m.event==='evt'&&!c.admin)return;const d=m.data;for(const other of members(c.room)){if(d.to&&other.id!==d.to)continue;send(other.ws,{type:'event',room:c.room,event:m.event,peer:c.id,data:d,isMe:other.id===c.id})}return}
});ws.on('close',()=>{const old=c.room;clients.delete(ws);update(old)});ws.on('error',()=>{});
});
const port=process.env.PORT||3000;server.listen(port,()=>console.log('Brainrot Heist running on port '+port));
