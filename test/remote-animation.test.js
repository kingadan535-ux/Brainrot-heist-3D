const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require.resolve('../index.html'),'utf8');
// Exercise the actual remote-avatar update, including its call into walk().
const helper=html.match(/function remoteGait\([\s\S]*?\n\}/)[0];
const update=html.match(/const dx=tx-a\.g\.position\.x[\s\S]*?carryPose\(a\.g,T\)/)[0];
function observer(){
 const a={g:{position:{x:0,y:0,z:0},rotation:{y:0}}};
 const ctx=vm.createContext({a,tx:0,tz:0,dt:0,T:0,p:{presence:{py:0,cb:-1}},
  ang:(a,b,k)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*k,
  walk:(_g,phase,amount)=>{ctx.phase=phase;ctx.amount=amount},setCarry:()=>{},carryPose:()=>{}});
 vm.runInContext(helper,ctx);
 const step=new vm.Script('{'+update+'}');
 return {a,ctx,step(target,dt){ctx.tx=target;ctx.dt=dt;ctx.T+=dt;step.runInContext(ctx)}};
}
function run(fps,{speed=10,jitter=false}={}){
 const o=observer();let next=0,target=0,packet=0;
 const gaps=jitter?[.07,.14,.09,.11,.08,.13]:[.1];
 for(let frame=0;frame<fps*5;frame++){
  const t=frame/fps;
  if(t+1e-8>=next){target=speed*t;next=t+gaps[packet++%gaps.length]}
  o.step(target,1/fps);
 }
 return o;
}
test('remote runner stride matches the distance-based local gait at 30, 60 and 144 FPS',()=>{
 const results=[30,60,144].map(fps=>run(fps));
 for(const o of results){
  const expected=o.a.g.position.x*1.15/10;
  assert.ok(Math.abs(o.ctx.phase-expected)<1e-9,'walk phase must follow rendered distance');
  assert.ok(o.a.runSpeed>7&&o.a.runSpeed<13,'normal run speed, independent of display rate');
 }
 const phases=results.map(o=>o.ctx.phase);
 assert.ok(Math.max(...phases)-Math.min(...phases)<.2,'display rate must not accelerate leg cycles');
});
test('irregular network updates do not multiply stride speed',()=>{
 const o=run(144,{jitter:true});
 assert.ok(Math.abs(o.ctx.phase-o.a.g.position.x*1.15/10)<1e-9);
 assert.ok(o.ctx.phase>5&&o.ctx.phase<6);
});
test('slow movement blends the run pose and stopping settles to idle',()=>{
 const o=run(60,{speed:2});
 assert.ok(o.ctx.amount>.1&&o.ctx.amount<.4,'slow movement must not use a full-speed pose');
 const target=o.ctx.tx;
 for(let i=0;i<120;i++)o.step(target,1/60);
 assert.ok(o.ctx.amount<.0001,'no running in place after stopping');
 const phase=o.ctx.phase;
 for(let i=0;i<60;i++)o.step(target,1/60);
 assert.ok(o.ctx.phase-phase<1e-6,'settled avatar has no extra strides');
});
test('stationary avatars remain idle and a zero-duration frame stays finite',()=>{
 const o=observer();
 o.step(0,0);
 for(let i=0;i<120;i++)o.step(0,1/60);
 assert.equal(o.ctx.phase,0);assert.equal(o.ctx.amount,0);
});
