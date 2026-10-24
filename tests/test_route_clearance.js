/* MathStudio v0.1.5: prerequisite route clearance test. */
'use strict';
const assert=require('node:assert/strict');
const C=require('../src/catalog.js'),T=require('../src/tech_tree.js');
const eps=.001;
function overlaps(a,b,r){
 const lo=Math.min,hi=Math.max;
 if(Math.abs(a[1]-b[1])<eps){const y=a[1];return y>r.y+eps&&y<r.y+r.height-eps&&hi(a[0],b[0])>r.x+eps&&lo(a[0],b[0])<r.x+r.width-eps;}
 if(Math.abs(a[0]-b[0])<eps){const x=a[0];return x>r.x+eps&&x<r.x+r.width-eps&&hi(a[1],b[1])>r.y+eps&&lo(a[1],b[1])<r.y+r.height-eps;}
 throw Error('Non-orthogonal route');
}
let checked=0;
for(const range of C.ranges){
 const l=T.makeLayout(C.visibleSkills(range.id),C.strands);
 l.links.forEach((edge,i)=>{
  const pts=T.routePoints(l.positions[edge.from],l.positions[edge.to],i);
  for(const [id,rect] of Object.entries(l.positions)){
   if(id===edge.from||id===edge.to)continue;
   for(let k=1;k<pts.length;k++){
    assert(!overlaps(pts[k-1],pts[k],rect),edge.from+' to '+edge.to+' crosses '+id);
   }
  }
  checked++;
 });
}
assert.equal(checked,1069);
console.log('PASS '+checked+' routes without crossings through unrelated cards');
