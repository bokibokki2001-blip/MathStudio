'use strict';
const assert=require('node:assert/strict');
const T=require('../src/textbook_schedule.js'),C=require('../src/catalog.js');
assert.equal(T.PUBLISHERS.length,7);
assert.equal(C.skills.length,285);
for(let grade=1;grade<=6;grade++){
 const expected=C.skills.filter(s=>s.stage==='E'+grade).length;
 for(const p of T.PUBLISHERS){
  const plan=T.getPlan(p.id,grade);
  assert.equal(plan.rows.length,expected);
  assert.equal(new Set(plan.rows.map(s=>s.id)).size,expected);
  assert(plan.rows.every(s=>T.MONTHS.includes(s.month)));
  const timeline=T.getOverview(p.id,grade,11,{}).timeline;
  for(let i=1;i<timeline.length;i++)assert(timeline[i].count>=timeline[i-1].count);
  assert.equal(timeline.at(-1).count,expected);
 }
}
const a=T.getPlan('tokyo',4),b=T.getPlan('dainippon',4),c=T.getPlan('keirin',4);
assert.equal(a.mappedCount,26);assert.equal(b.mappedCount,26);assert.equal(c.mappedCount,26);
function month(plan,id){return plan.rows.find(s=>s.id===id)?.month;}
assert.equal(month(a,'e4.number.large_numbers_trillions'),4);
assert.equal(month(b,'e4.number.large_numbers_trillions'),5);
assert.equal(month(c,'e4.geometry.angle_degrees'),5);
assert.notEqual(month(a,'e4.data.line_graph'),month(b,'e4.data.line_graph'));
const p=T.getOverview('dainippon',4,10,{ 'e4.data.line_graph':{master:true}});
assert.equal(p.mastered.length,1);
assert(p.expected.every(s=>T.monthOrder(s.month)<T.monthOrder(10)));
assert.equal(T.getPlan('gakuto',4).type,'provisional_shared');
assert.equal(T.getPlan('tokyo',3).type,'provisional_shared');
assert.equal(T.safePublisher('unknown'),'common');
console.log('PASS: 7 publisher choices × grades 1-6, 285 skills, 3 grade-4 mappings, timeline consistency');
