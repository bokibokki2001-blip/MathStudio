/* MathStudio v0.2.0 - textbook schedule comparisons.
   Publisher schedules must NEVER be invented from a publisher name.
   Curated E4 mappings are based on publicly available 2024 unit plans;
   mapping of MathStudio micro-skills to the unit is an approximation.
   All other grades use a shared, explicitly provisional sequence.
*/
(function(root,factory){const v=factory();if(typeof module==='object'&&module.exports)module.exports=v;else root.MathTextbooks=v;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const C=typeof module==='object'&&module.exports?require('./catalog.js'):globalThis.MathCatalog;
const MONTHS=[4,5,6,7,9,10,11,12,1,2,3];
const PUBLISHERS=[
 {id:'common',name:'共通の暫定モデル'},
 {id:'tokyo',name:'東京書籍（新編 新しい算数）'},
 {id:'dainippon',name:'大日本図書（たのしい算数）'},
 {id:'keirin',name:'啓林館（わくわく算数）'},
 {id:'gakuto',name:'学校図書（みんなと学ぶ 小学校算数）'},
 {id:'kyoiku',name:'教育出版（小学算数）'},
 {id:'nichibun',name:'日本文教出版（小学算数）'}
];
const SOURCES={
 tokyo:{title:'東京書籍 令和6年度 新編 新しい算数 4年 年間指導計画案',url:'https://ten.tokyo-shoseki.co.jp/text/shou/sansu/data/sansu_keikaku_ryakuan_4_20240131.pdf',kind:'term'},
 dainippon:{title:'大日本図書 令和6年版 4年 年間指導計画案',url:'https://www.dainippon-tosho.co.jp/sansu/files/r6sansu4thSH.pdf',kind:'month'},
 keirin:{title:'啓林館 令和6年版 4年 年間指導計画案',url:'https://www.shinko-keirin.co.jp/keirinkan/sho_r6/sansu/file/sansu_guidance_plan04.pdf',kind:'month'}
};
// 4年用は出版社の単元順と実施月の資料に技能を対応づけた目安。
// 確定した学校の授業予定ではない。「開始の目安」であり修了月ではない。
const E4={
 tokyo:{
  4:'large_numbers_trillions',5:'line_graph,two_way_table,long_division',6:'angle_degrees',7:'decimal_place_value,decimal_add_sub',
  9:'simple_percent',10:'rounding,estimation',11:'mixed_operations,parallel_perpendicular,quadrilaterals',
  12:'fraction_over_one,fraction_equivalence,fraction_add_same,symbols_formula',
  1:'co_variation,simple_proportion,rectangle_area,area_unit',
  2:'decimal_times_integer,decimal_div_integer',3:'rectangles_cubes,nets_views,position_space'
 },
 dainippon:{
  4:'line_graph,two_way_table,long_division',5:'angle_degrees,large_numbers_trillions',6:'mixed_operations,parallel_perpendicular,quadrilaterals',
  9:'rounding,estimation,long_division',10:'co_variation,simple_proportion,simple_percent',
  11:'decimal_place_value,decimal_add_sub,rectangle_area,area_unit',
  1:'decimal_times_integer,decimal_div_integer',2:'fraction_over_one,fraction_equivalence,fraction_add_same',
  3:'rectangles_cubes,nets_views,position_space,symbols_formula'
 },
 keirin:{
  4:'long_division',5:'angle_degrees,parallel_perpendicular,quadrilaterals,line_graph,two_way_table',
  6:'large_numbers_trillions,mixed_operations',7:'rounding,estimation',
  9:'decimal_place_value,decimal_add_sub',10:'co_variation,simple_proportion',
  11:'rectangle_area,area_unit',12:'fraction_over_one,fraction_equivalence,fraction_add_same',
  1:'decimal_times_integer,decimal_div_integer',2:'rectangles_cubes,nets_views,position_space',3:'symbols_formula,simple_percent'
 }
};
function idMap(data){const out={};for(const [m,names] of Object.entries(data))for(const suffix of names.split(','))out['e4.'+(suffix.startsWith('line_graph')||suffix==='two_way_table'?'data':suffix.startsWith('angle_')||['parallel_perpendicular','quadrilaterals','rectangle_area','area_unit','rectangles_cubes','nets_views','position_space'].includes(suffix)?'geometry':suffix.startsWith('co_variation')||suffix.startsWith('simple_')?'functions':'number')+'.'+suffix]=Number(m);return out;}
const mapped=Object.fromEntries(Object.entries(E4).map(([k,v])=>[k,idMap(v)]));
const byGrade=Object.fromEntries(Array.from({length:6},(_,i)=>[i+1,C.skills.filter(s=>s.stage==='E'+(i+1))]));
const monthOrder=m=>MONTHS.indexOf(Number(m));
function safePublisher(id){return PUBLISHERS.some(p=>p.id===id)?id:'common';}
function fallbackOrder(grade){
 const nodes=byGrade[grade]||[];
 const ids=new Set(nodes.map(x=>x.id)),done=new Set(),out=[];
 let strandPosition=0;
 while(out.length<nodes.length){
  const available=nodes.filter(s=>!done.has(s.id)&&s.prereq.filter(p=>ids.has(p)).every(p=>done.has(p)));
  if(!available.length)throw Error('技能データに循環があります: E'+grade);
  const strands=['number','geometry','measure','data','functions','algebra','probability','calculus','modeling'];
  const choice=available.find(s=>s.strand===strands[strandPosition%strands.length])||available[0];
  out.push(choice);done.add(choice.id);strandPosition++;
 }
 return out;
}
const fallback=Object.fromEntries(Array.from({length:6},(_,i)=>{let grade=i+1,order=fallbackOrder(grade);return[grade,Object.fromEntries(order.map((s,j)=>[s.id,MONTHS[Math.min(MONTHS.length-1,Math.floor(j*MONTHS.length/order.length))]]))];}));
function getPlan(publisher,grade){
 publisher=safePublisher(publisher);grade=Number(grade);
 const skills=byGrade[grade]||[],curated=grade===4?mapped[publisher]:null;
 const rows=skills.map(s=>({id:s.id,title:s.title,month:curated?.[s.id]||fallback[grade][s.id],mapped:!!curated?.[s.id]}));
 // We NEVER adjust a mapped value silently to satisfy an unvalidated prerequisite ordering.
 const mappedCount=rows.filter(x=>x.mapped).length;
 const type=mappedCount?'publisher_unit_mapping':'provisional_shared';
 const source=mappedCount?SOURCES[publisher]:null;
 return {publisher,grade,rows,mappedCount,type,source,year:'2024〜2027年度の小学校教科書を対象',
  note:mappedCount?`公開された出版社の単元計画から小学4年の${mappedCount}技能を対応づけた参考開始月です。残りは共通仮モデル。東京書籍の月は学期順から推定し、他社も技能単位の月は厳密ではありません。`: 'この出版社・学年の月別技能対応は未検証のため、出版社別の差を反映していない共通仮モデルを表示しています。'};
}
function getOverview(publisher,grade,currentMonth,records={}){
 const plan=getPlan(publisher,grade),idx=monthOrder(currentMonth),month=idx<0?4:Number(currentMonth);
 const expected=plan.rows.filter(s=>monthOrder(s.month)>=0&&monthOrder(s.month)<monthOrder(month));
 const mastered=plan.rows.filter(s=>records[s.id]?.master);
 const startList=expected.filter(s=>!records[s.id]?.master);
 const upcoming=plan.rows.filter(s=>monthOrder(s.month)===monthOrder(month));
 const timeline=MONTHS.map((m,i)=>({month:m,count:plan.rows.filter(s=>monthOrder(s.month)<=i).length}));
 return {...plan,month,expected,mastered,startList,upcoming,timeline,gap:mastered.length-expected.length};
}
return{PUBLISHERS,SOURCES,MONTHS,safePublisher,getPlan,getOverview,monthOrder};
});
