(function(root,factory){const rules=factory();if(typeof module==='object'&&module.exports)module.exports=rules;else root.BrainrotRules=rules})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 const bases=[{x:-32,z:21},{x:-32,z:-63},{x:-32,z:-21},{x:-32,z:63},{x:32,z:-63},{x:32,z:-21},{x:32,z:21},{x:32,z:63}];
 const slotPosition=(baseSlot,k)=>{const b=bases[baseSlot];if(!b)return null;const j=k&7;return{x:b.x+(j%2?4.6:-4.6),z:b.z+((j>>1)-1.5)*6.2,y:k>>3?7:0}};
 const atBase=(p,slot)=>{const b=bases[slot];return !!b&&Number.isFinite(p.px)&&Number.isFinite(p.pz)&&Math.abs(p.px-b.x)<10.5&&Math.abs(p.pz-b.z)<15.5};
 const near=(p,q,r)=>Number.isFinite(p.px)&&Number.isFinite(p.pz)&&Number.isFinite(q.x)&&Number.isFinite(q.z)&&Math.hypot(p.px-q.x,p.pz-q.z)<=r&&Math.abs((p.py||0)-(q.y||0))<=2.5;
 return {bases,slotPosition,atBase,near,rebirthCash:100};
});
