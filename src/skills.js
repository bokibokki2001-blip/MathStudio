/* Working sample. IDs deliberately align with curriculum_285_v0.1.json; the links below are a prototype subgraph, NOT the complete 485-link DAG. */
(function(root,factory){const v=factory();if(typeof module==='object'&&module.exports)module.exports=v;else root.MathSkills=v;})(typeof globalThis==='object'?globalThis:this,function(){
const s=(id,title,grade,month,kind,track,prereq=[],note='')=>({id,title,grade,month,kind,track,prereq,note});
const skills=[
s('e1.number.add_single','1桁のたし算',1,6,'add1','add',[]),
s('e1.number.add_carry','くり上がりのたし算',1,10,'addcarry','add',['e1.number.add_single']),
s('e2.number.add_column','2桁のたし算',2,6,'add2','add',['e1.number.add_carry']),
s('e2.number.mul_equal_groups','同じ数ずつのまとまり',2,9,'groups','mul',['e1.number.add_single']),
s('e2.number.multiplication_table','九九',2,11,'table','mul',['e2.number.mul_equal_groups']),
s('e2.number.mul_2digit_simple','2桁×1桁の暗算',2,2,'mul2simple','mul',['e2.number.multiplication_table']),
s('e3.number.multiply_2by1','2桁×1桁の筆算',3,6,'mul21','mul',['e2.number.mul_2digit_simple']),
s('e3.number.multiply_two_digit_by_two_digit','2桁×2桁の掛け算',3,11,'mul22','mul',['e3.number.multiply_2by1','e2.number.add_column']),
s('e3.number.division_meaning','わり算の意味',3,5,'divMeaning','div',['e2.number.multiplication_table']),
s('e3.number.divide_2by1','2桁÷1桁',3,9,'div21','div',['e3.number.division_meaning']),
s('e4.number.long_division','2桁で割る筆算',4,7,'longdiv','div',['e3.number.divide_2by1','e3.number.multiply_two_digit_by_two_digit']),
s('e2.number.simple_fraction','分数の意味',2,3,'fracConcept','frac',['e1.number.add_single']),
s('e3.number.fraction_unit','分数の大きさ',3,1,'fracUnit','frac',['e2.number.simple_fraction']),
s('e4.number.fraction_add_same','同分母の分数のたし算',4,10,'fracAdd','frac',['e3.number.fraction_unit']),
s('e4.number.fraction_equivalence','等しい分数',4,12,'fracEqual','frac',['e3.number.fraction_unit'])
];
const tracks=[{id:'add',title:'たし算',icon:'＋'},{id:'mul',title:'かけ算',icon:'×'},{id:'div',title:'わり算',icon:'÷'},{id:'frac',title:'分数',icon:'½'}];
function completedBefore(skill,g,m){if(skill.grade<g)return true;if(skill.grade>g)return false;const i=x=>x>=4?x-4:x+8;return i(skill.month)<i(m);}
function startingIndex(track,grade,month){const list=skills.filter(s=>s.track===track);let idx=list.findIndex(s=>!completedBefore(s,grade,month));if(idx<0)return list.length-1;return Math.max(0,idx-1);}
return {skills,tracks,byId:Object.fromEntries(skills.map(s=>[s.id,s])),completedBefore,startingIndex};});
