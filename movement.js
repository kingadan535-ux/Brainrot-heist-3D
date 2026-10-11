(function(root,factory){const movement=factory();if(typeof module==='object'&&module.exports)module.exports=movement;else root.BrainrotMovement=movement})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 const bases=[{x:-32,z:21},{x:-32,z:-63},{x:-32,z:-21},{x:-32,z:63},{x:32,z:-63},{x:32,z:-21},{x:32,z:21},{x:32,z:63}];
 function walls(locked=[],own=-1){const out=[];bases.forEach((b,i)=>{const o=b.x<0?1:-1;out.push({x:b.x-10*o,z:b.z,hx:.2,hz:15.2});for(const s of [-1,1])out.push({x:b.x,z:b.z+s*15,hx:10.2,hz:.2});if(locked[i]&&i!==own)out.push({x:b.x+10.2*o,z:b.z,hx:.15,hz:15.2})});return out}
 function blocked(x,z,boxes,r=.65){return boxes.some(b=>Math.abs(x-b.x)<b.hx+r&&Math.abs(z-b.z)<b.hz+r)}
 function move(p,dx,dz,locked=[],own=-1){const boxes=walls(locked,own),steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.25));for(let n=0;n<steps;n++){const x=Math.max(-58,Math.min(58,p.x+dx/steps));if(!blocked(x,p.z,boxes))p.x=x;else p.vx=0;const z=Math.max(-92,Math.min(92,p.z+dz/steps));if(!blocked(p.x,z,boxes))p.z=z;else p.vz=0}return p}
 function clearLine(p,q){const boxes=walls(),dx=q.x-p.x,dz=q.z-p.z,n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.15));for(let i=1;i<n;i++)if(blocked(p.x+dx*i/n,p.z+dz*i/n,boxes,.05))return false;return true}
 const canSprint=(p,carrying)=>!carrying&&!(p.stun>0);
 const canHit=(p,carrying)=>!carrying&&!(p.stun>0);
 function jump(p){if(p.stun>0||(p.jumpY||0)>.001||(p.vy||0)>0)return false;p.vy=9;return true}
 function bonk(p,vx,vz){p.stun=1.5;p.vx=vx;p.vz=vz;p.vy=8;p.jumpY=Math.max(0,p.jumpY||0)}
 function step(p,input,dt,locked=[],own=0){const stunned=p.stun>0,carrying=!!input.carrying;dt=Math.min(.05,Math.max(0,dt));
  if(stunned){p.stun=Math.max(0,p.stun-dt);const damping=Math.exp(-2.8*dt);p.vx*=damping;p.vz*=damping}
  else{const speed=10*(1+.1*(input.level||0))*(carrying?input.carryMultiplier||.7:input.sprint?1.6:1),k=1-Math.exp(-9*dt);p.vx+=(input.x*speed-p.vx)*k;p.vz+=(input.z*speed-p.vz)*k}
  move(p,p.vx*dt,p.vz*dt,locked,own);
  if(p.fl===1){const b=bases[own];p.x=Math.max(b.x-9.1,Math.min(b.x+9.1,p.x));p.z=Math.max(b.z-14.1,Math.min(b.z+14.1,p.z))}
  p.vy=(p.vy||0)-22*dt;p.jumpY=Math.max(0,(p.jumpY||0)+p.vy*dt);if(!p.jumpY)p.vy=0;
  const target=(p.fl||0)*7;p.liftY=p.liftY??Math.max(0,(p.y||0)-(p.jumpY||0));p.liftY+=Math.sign(target-p.liftY)*Math.min(Math.abs(target-p.liftY),9*dt);p.y=p.liftY+p.jumpY;
  return p;
 }
 return {walls,move,clearLine,canSprint,canHit,jump,bonk,step};
});
