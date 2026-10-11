const { test } = require('node:test');
const assert = require('node:assert/strict');
const { WebSocket } = require('ws');
const { createGameServer } = require('../server');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
async function setup(t, options={}) {
 const game=createGameServer({adminToken:'legacy-test-token',ownerKey:'owner-test-password',...options});
 await new Promise(r=>game.server.listen(0,'127.0.0.1',r));
 const origin='http://127.0.0.1:'+game.server.address().port;
 t.after(async()=>{for(const c of game.clients.values())c.ws.terminate();await new Promise(r=>game.wss.close(r));await new Promise(r=>game.server.close(r))});
 const post=(route,password,extra={})=>fetch(origin+'/api/owner/'+route,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...extra},body:JSON.stringify({password})});
 return {game,origin,post};
}
async function socket(env,cookie='',origin=env.origin){
 const ws=new WebSocket(env.origin.replace('http:','ws:')+'/ws',{headers:{Origin:origin,Cookie:cookie}}),messages=[];
 ws.on('message',raw=>messages.push(JSON.parse(raw)));
 const wait=async predicate=>{const start=Date.now();while(true){const m=messages.find(predicate);if(m)return m;if(Date.now()-start>3000)throw Error('WebSocket response timeout');await delay(10)}};
 return {ws,messages,wait,hello:await wait(m=>m.type==='hello')};
}
test('owner password creates a private session and reconnect restores owner access',async t=>{
 const env=await setup(t);
 assert.equal((await env.post('login','wrong')).status,401);
 const login=await env.post('login','owner-test-password');assert.equal(login.status,200);
 const header=login.headers.get('set-cookie');assert.match(header,/HttpOnly/i);assert.match(header,/SameSite=Strict/i);assert.match(header,/Max-Age=604800/i);
 const cookie=header.split(';')[0];
 const owner=await socket(env,cookie);assert.equal(owner.hello.admin,true);
 owner.ws.close();
 const reconnect=await socket(env,cookie);assert.equal(reconnect.hello.admin,true);
 const stranger=await socket(env);assert.equal(stranger.hello.admin,false);
 const crossOrigin=await socket(env,cookie,'https://unrelated.example');assert.equal(crossOrigin.hello.admin,false);
 const tampered=await socket(env,cookie.slice(0,-1)+(cookie.endsWith('A')?'B':'A'));assert.equal(tampered.hello.admin,false);
 assert.equal((await fetch(env.origin+'/owner')).status,200);
 assert.equal((await fetch(env.origin+'/owner-auth.js')).status,404);
});
test('only signed-in owner can send events; sign-out revokes existing and replayed sessions',async t=>{
 const env=await setup(t),login=await env.post('login','owner-test-password'),cookie=login.headers.get('set-cookie').split(';')[0];
 const owner=await socket(env,cookie),viewer=await socket(env);
 for(const c of [owner,viewer]){c.ws.send(JSON.stringify({type:'join',room:'hb-owner'}));await c.wait(m=>m.type==='join')}
 viewer.ws.send(JSON.stringify({type:'emit',event:'evt',data:{k:'cash',v:10000}}));await delay(50);
 assert.equal(owner.messages.some(m=>m.type==='event'&&m.event==='evt'),false);
 owner.ws.send(JSON.stringify({type:'emit',event:'evt',data:{k:'cash',v:10000}}));
 await viewer.wait(m=>m.type==='event'&&m.event==='evt');
 const logout=await env.post('logout',null,{Cookie:cookie});assert.equal(logout.status,200);
 await owner.wait(m=>m.type==='auth'&&m.ok===false);
 owner.ws.send(JSON.stringify({type:'emit',event:'evt',data:{k:'stop'}}));await delay(50);
 assert.equal(viewer.messages.filter(m=>m.type==='event'&&m.event==='evt').length,1);
 const replay=await socket(env,cookie);assert.equal(replay.hello.admin,false);
});
test('owner sign-in blocks foreign origins, limits guesses, and preserves legacy token access',async t=>{
 const env=await setup(t);
 assert.equal((await env.post('login','owner-test-password',{Origin:'https://unrelated.example'})).status,403);
 assert.equal((await env.post('login','legacy-test-token')).status,200);
 for(let i=0;i<10;i++)assert.equal((await env.post('login','wrong')).status,401);
 assert.equal((await env.post('login','wrong')).status,429);
});
test('unconfigured owner sign-in grants no access and HTTPS sessions use secure cookies',async t=>{
 const empty=await setup(t,{adminToken:'',ownerKey:''});
 assert.equal((await empty.post('login','anything')).status,503);
 const guest=await socket(empty);assert.equal(guest.hello.admin,false);
 const env=await setup(t);
 const login=await env.post('login','owner-test-password',{'X-Forwarded-Proto':'https',Origin:env.origin.replace('http:','https:')});
 assert.equal(login.status,200);assert.match(login.headers.get('set-cookie'),/Secure/);
});
