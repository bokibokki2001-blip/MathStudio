const assert=require('node:assert/strict');
const {skills,tracks}=require('../src/skills.js');
const T=require('../src/tech_tree.js');
const l=T.makeLayout(skills,tracks);
assert.equal(Object.keys(l.positions).length,skills.length);
assert.equal(l.links.length,skills.reduce((n,s)=>n+s.prereq.length,0));
assert.deepEqual(l.grades,[1,2,3,4,5,6]);
for(const s of skills){assert(l.positions[s.id],s.id);for(const p of s.prereq){assert(l.positions[p],p);assert(l.positions[p].grade<=l.positions[s.id].grade,'Prerequisite cannot be in a later grade: '+p+' '+s.id)}}
for(let i=0;i<skills.length;i++)for(let j=i+1;j<skills.length;j++){const a=l.positions[skills[i].id],b=l.positions[skills[j].id];assert(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y,'Overlap: '+skills[i].id+' '+skills[j].id)}
const special=l.links.filter(x=>x.to==='e3.number.multiply_two_digit_by_two_digit');assert.equal(special.length,2,'Join node must preserve both prerequisites');
assert(l.links.some(x=>x.crossTrack),'Cross-track dependency must be represented');
const html=T.render({skills,tracks,statusOf:()=> 'open',records:{},selectedId:'e3.number.multiply_two_digit_by_two_digit'});
assert((html.match(/class="tech-node /g)||[]).length===skills.length);
assert((html.match(/class="tech-link /g)||[]).length===l.links.length);
for(const grade of l.grades)assert(html.includes(`小学${grade}年`));
assert(html.includes('data-act="map-zoom-in"'));
console.log('Technology tree: passed. Nodes '+skills.length+', links '+l.links.length+', cross-track '+l.links.filter(x=>x.crossTrack).length+'.');
