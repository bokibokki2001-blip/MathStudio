'use strict';
const assert=require('node:assert/strict');
const C=require('../src/catalog.js'),T=require('../src/tech_tree.js');
const prior={'e1-3':539,'e4-6':504,elementary:527,junior:305,high:315,all:484};
function hits(a,b,r){let t0=0,t1=1;const dx=b[0]-a[0],dy=b[1]-a[1],e=2.2;for(const [p,q] of [[-dx,a[0]-r.x-e],[dx,r.x+r.width-e-a[0]],[-dy,a[1]-r.y-e],[dy,r.y+r.height-e-a[1]]]){if(Math.abs(p)<1e-9){if(q<0)return false;continue;}let t=q/p;if(p<0)t0=Math.max(t0,t);else t1=Math.min(t1,t);if(t0>t1)return false;}return true;}
let checked=0,direct=0;
for(const range of C.ranges){const l=T.makeLayout(C.visibleSkills(range.id)),rects=Object.values(l.positions);let distance=0;
for(let i=0;i<l.links.length;i++){let e=l.links[i],a=l.positions[e.from],b=l.positions[e.to],pts=T.routePoints(a,b,i,rects);assert(a.column<b.column,'edge must lead left-to-right');distance+=Math.abs(a.y-b.y);if(pts.length===2)direct++;
for(const [id,r] of Object.entries(l.positions)){if(id===e.from||id===e.to)continue;for(let j=1;j<pts.length;j++)assert(!hits(pts[j-1],pts[j],r),'line crosses unrelated card: '+e.from+'->'+e.to+' / '+id);}
checked++;}
assert(distance/l.links.length<prior[range.id]*1.01,'must improve mean vertical displacement');console.log(range.id,l.links.length,Math.round(distance/l.links.length));}
assert.equal(checked,1069);assert.equal(direct,637);console.log('PASS',checked,'routed edges,',direct,'straight edges, no unrelated card collisions');
