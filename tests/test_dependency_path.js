const assert=require('node:assert/strict');
const J=require('../src/dependency_path.js'),C=require('../src/catalog.js'),S=require('../src/skills.js');
const playable=new Set(S.skills.map(s=>s.id));
function test(id, statuses={}) {return J.analyze(id,{catalog:C,statusOf:id=>statuses[id]|| (playable.has(id)?'locked':'planned'),playableIds:playable});}
for(const s of C.skills){let j=test(s.id);assert(!j.ancestors.has(s.id));assert.equal(j.edgeCount,j.edges.length);assert.equal(new Set(j.order).size,j.order.length);assert(j.order.at(-1)===s.id);for(const e of j.edges)assert(j.order.indexOf(e.from)<j.order.indexOf(e.to));
 for(const f of j.firstSteps)assert(C.byId[f].prereq.every(p=>J.met('master') || j.completed.includes(p) || !j.all.has(p))===true || C.byId[f].prereq.length===0);
}
const mul=test('e3.number.multiply_two_digit_by_two_digit');
assert(mul.ancestors.has('e1.number.count_objects'));assert(mul.ancestors.has('e2.number.multiplication_table'));assert(mul.ancestors.has('e3.number.multi_digit_add'));
assert.equal(mul.firstSteps.every(id=>C.byId[id].prereq.length===0),true);
const done={};for(const id of mul.ancestors)done[id]='licensed';
const doneRoute=test(mul.targetId,done);assert.equal(doneRoute.remaining.length,0);assert.equal(doneRoute.canAttemptByCatalog,true);
assert.equal(doneRoute.completed.length,mul.pathCount);
const start=test(mul.targetId,{'e1.number.count_objects':'master'});
assert(start.firstSteps.length>0);assert(start.firstSteps.every(id=>C.byId[id].prereq.every(p=>p==='e1.number.count_objects')));
const diamondCatalog={byId:{r:{id:'r',prereq:[]},a:{id:'a',prereq:['r']},b:{id:'b',prereq:['r']},t:{id:'t',prereq:['a','b']}},};
let d=J.analyze('t',{catalog:diamondCatalog,statusOf:()=>'open'});assert.deepEqual([...d.ancestors].sort(),['a','b','r']);assert.equal(d.edges.length,4);assert.deepEqual(d.firstSteps,['r']);
let d2=J.analyze('t',{catalog:diamondCatalog,statusOf:id=>id==='r'?'licensed':'open'});assert.deepEqual(d2.firstSteps.sort(),['a','b']);
assert.throws(()=>J.analyze('t',{catalog:{byId:{t:{id:'t',prereq:['t']}}},statusOf:()=>'open'}),/cycle/);
console.log(`PASS: 285 skills, transitive ancestry, branching/merging, first steps, completed states, cycles (max ancestry ${Math.max(...C.skills.map(s=>test(s.id).pathCount))})`);
