(function(root,factory){const route=factory(typeof module==='object'&&module.exports?require('./game-rules'):root.BrainrotRules);if(typeof module==='object'&&module.exports)module.exports=route;else root.BrainrotDelivery=route})(typeof globalThis!=='undefined'?globalThis:this,rules=>{
 const point=(x,z,y=0)=>({x,y,z});
 function plan(from,baseSlot,slot){const b=rules.bases[baseSlot],o=b.x<0?1:-1,p=rules.slotPosition(baseSlot,slot),path=[];
  const inside=rules.bases.find(a=>Math.abs(from.x-a.x)<10.9&&Math.abs(from.z-a.z)<15.9);
  if(inside){const dir=inside.x<0?1:-1;if((from.y||0)>0){path.push(point(inside.x-8.2*dir,inside.z,7));path.push(point(inside.x-8.2*dir,inside.z))}path.push(point(inside.x+13*dir,inside.z))}
  path.push(point(b.x+13*o,inside?inside.z:from.z),point(b.x+13*o,b.z),point(b.x,b.z));
  if(slot>=8)path.push(point(b.x-8.2*o,b.z),point(b.x-8.2*o,b.z,7));
  path.push(point(p.x,p.z,p.y));return path;
 }
 function advance(item,seconds,speed=5){let left=Math.max(0,seconds)*speed;item.x=item.x||0;item.y=item.y||0;while(item.route?.length){const q=item.route[0],dx=q.x-item.x,dy=(q.y||0)-item.y,dz=q.z-item.z,d=Math.hypot(dx,dy,dz);if(d<=left+.00001){item.x=q.x;item.y=q.y||0;item.z=q.z;left=Math.max(0,left-d);item.route.shift()}else{item.x+=dx/d*left;item.y+=dy/d*left;item.z+=dz/d*left;break}if(left<=0)break}return !item.route?.length}
 return {plan,advance,speed:5};
});
