/* Working sample. IDs deliberately align with curriculum_285_v0.1.json; the links below are a prototype subgraph, NOT the complete 485-link DAG. */
(function(root,factory){const v=factory();if(typeof module==='object'&&module.exports)module.exports=v;else root.MathSkills=v;})(typeof globalThis==='object'?globalThis:this,function(){
const proposed=typeof module==='object'&&module.exports?require('./catalog.js'):globalThis.MathCatalog;
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
// Incremental textbook-aligned practice. Keep existing 15 metadata and IDs unchanged.
// All chosen catalog ancestors are represented; 285-skill catalogue remains independently authoritative for the map.
const EXTRA_IDS=`e1.number.count_objects e1.number.read_write_100 e1.number.compare_100 e1.number.number_line e1.number.compose_decompose e1.number.place_value e1.number.add_meaning e1.number.subtract_meaning e1.number.subtract_single e1.number.subtract_borrow e1.number.simple_two_digit e1.number.story_add_sub e1.number.numbers_to_120 e1.geometry.shape_recognize e1.geometry.solid_recognize e1.geometry.compose_shapes e1.geometry.position_directions e1.measure.compare_length e1.measure.compare_area_capacity e1.measure.read_clock e1.data.picture_count e2.number.numbers_to_10000 e2.number.subtract_column e2.number.add_sub_3digit_simple e2.number.add_sub_inverse e2.number.mul_word_problems e2.number.commutative_property e2.number.associative_add e2.geometry.triangles_quads e2.geometry.square_rectangle e2.geometry.right_triangle e2.geometry.box_shape e2.measure.standard_length e2.measure.capacity_units e2.measure.minutes_hours e2.data.simple_tables e2.data.simple_graphs e3.number.large_numbers_100m e3.number.multi_digit_add e3.number.multi_digit_subtract e3.number.multiply_3by1 e3.number.multiplication_properties e3.number.remainder e3.number.decimal_tenths e3.number.decimal_add_sub e3.number.unknown_box_equation e3.geometry.circles e3.geometry.angles_compare e3.measure.km e3.measure.mass e3.measure.seconds e3.measure.elapsed_time e3.data.bar_graph e4.number.rounding e4.number.estimation e4.number.mixed_operations e4.number.decimal_place_value e4.number.decimal_add_sub e4.number.decimal_times_integer e4.geometry.rectangle_area e4.geometry.angle_degrees e3.number.fraction_same_denominator_simple e4.geometry.area_unit e4.number.fraction_over_one`.split(' ');
const oldIds=new Set(skills.map(x=>x.id));
const extraIds=new Set(EXTRA_IDS);
const playableIds=new Set([...oldIds,...extraIds]);
for(const id of EXTRA_IDS){
 const item=proposed?.byId?.[id];if(!item)throw Error('No proposed-curriculum skill for '+id);
 for(const p of item.prereq)if(!playableIds.has(p))throw Error('Unimplemented prerequisite for '+id+': '+p);
 const grade=Number(item.stage.slice(1));
 // "extra" keeps placement diagnosis on its original four validated tracks.
 skills.push(s(id,item.title,grade,6,'extended','extra',[...item.prereq],item.area));
}
const tracks=[{id:'add',title:'たし算',icon:'＋'},{id:'mul',title:'かけ算',icon:'×'},{id:'div',title:'わり算',icon:'÷'},{id:'frac',title:'分数',icon:'½'}];
function completedBefore(skill,g,m){if(skill.grade<g)return true;if(skill.grade>g)return false;const i=x=>x>=4?x-4:x+8;return i(skill.month)<i(m);}
function startingIndex(track,grade,month){const list=skills.filter(s=>s.track===track);let idx=list.findIndex(s=>!completedBefore(s,grade,month));if(idx<0)return list.length-1;return Math.max(0,idx-1);}
return {skills,tracks,byId:Object.fromEntries(skills.map(s=>[s.id,s])),completedBefore,startingIndex};});
