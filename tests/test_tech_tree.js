const assert=require('node:assert/strict');
const C=require('../src/catalog.js'), S=require('../src/skills.js'), T=require('../src/tech_tree.js');
assert.equal(C.skills.length,285);
assert.equal(C.skills.filter(s=>s.stage.startsWith('E')).length,143);
assert.equal(C.skills.filter(s=>s.stage.startsWith('J')).length,66);
assert.equal(C.skills.filter(s=>s.stage.startsWith('H')).length,76);
assert.equal(C.skills.reduce((sum,s)=>sum+s.prereq.length,0),485);
assert.equal(new Set(C.skills.map(s=>s.id)).size,285);
for(const s of C.skills)for(const id of s.prereq)assert(C.byId[id],id);
for(const mode of C.ranges){
 const list=C.visibleSkills(mode.id),layout=T.makeLayout(list,C.strands);
 assert.equal(Object.keys(layout.positions).length,list.length);
 assert.equal(layout.links.length,list.reduce((sum,s)=>sum+s.prereq.filter(p=>layout.positions[p]).length,0));
 for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){
  const a=layout.positions[list[i].id],b=layout.positions[list[j].id];
  assert(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y);
 }
 const html=T.render({skills:list,tracks:C.strands,statusOf:id=>S.byId[id]?'open':'planned',records:{},selectedId:list[0].id,activeRange:mode.id});
 assert.equal((html.match(/class="tech-node /g)||[]).length,list.length);
 assert.equal((html.match(/class="tech-link /g)||[]).length,layout.links.length);
 assert(html.indexOf('class="tech-grade-overlay"')<html.indexOf('class="tech-map-scroll"'));
}
console.log('PASS v0.1.4: 285 skills, 485 dependencies, six display ranges, non-overlapping nodes, fixed grade-row structure');
