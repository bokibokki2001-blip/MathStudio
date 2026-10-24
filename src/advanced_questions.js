/* MathStudio v0.1.9: individually mapped practice generators for remaining curriculum.
   Focus: correctly gradable numeric/fraction facts and reasoned-choice items.
   Geometry constructions, free proofs, modeling and advanced symbolic algebra are
   sampled with structured tasks, NOT claimed to assess complete open-ended mastery.
*/
(function(root,factory){const v=factory();if(typeof module==='object'&&module.exports)module.exports=v;else root.MathAdvancedQuestions=v;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const U=(a,b,r)=>Math.floor(r()*(b-a+1))+a, P=(a,r)=>a[U(0,a.length-1,r)];
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const F=(a,b=1)=>{if(b<0){a=-a;b=-b}const d=gcd(a,b);return b/d===1?String(a/d):`${a/d}/${b/d}`};
const fmt=v=>typeof v==='number'?(Number.isInteger(v)?String(v):String(Math.round(v*1000000)/1000000)):String(v);
const PI=3.14;
let seq=0;
function makeQuestion(skill,category='basic',r=Math.random){
 const id=skill.id, ix=category==='basic'?0:category==='application'?1:2;
 const n=(a,b)=>U(a,b,r),p=a=>P(a,r), a=n(2,8), b=n(2,8), c=n(2,6), d=n(2,6), k=ix+1;
 const out=(answer,prompt,meta={})=>({id:`advanced_${Date.now().toString(36)}_${seq++}`,skillId:id,category,prompt,answer,displayAnswer:meta.displayAnswer||fmt(answer),inputMode:meta.options?'choice':'value',options:meta.options||undefined,hint:meta.hint||'数量の関係、定義や公式を確認してみよう。',archetype:`${id}:${category}`,assessmentScope:meta.scope||'structured'});
 const num=(v,t)=>out(v,t);
 const fr=(v,t)=>out(v,t,{displayAnswer:fmt(v)});
 // Multiple-choice distractors are supplied as distinctly worded conceptual alternatives.
 // The correct answer is shuffled, so fixed-choice strategies cannot earn points.
 const ch=(question,correct,others)=>{
  const pool=[correct,...others.filter(x=>x!==correct)].filter((x,i,self)=>self.indexOf(x)===i);
  if(pool.length<3)throw Error('Need 3 distinct options: '+id);
  for(let i=pool.length-1;i>0;i--){let j=n(0,i);[pool[i],pool[j]]=[pool[j],pool[i]]}
  let ans=pool.indexOf(correct)+1;
  return out(ans,question,{options:pool,displayAnswer:`${ans}. ${correct}`,scope:'conceptual-check'});
 };
 const rational=(top,den,t)=>out(top/den,t,{displayAnswer:F(top,den)});
 const z=n(1,9),z2=n(1,8), t=n(2,7), w=n(3,8), y=n(2,6);
 const roots=[a,b].sort((x,y)=>x-y);
 switch(id){
// ---- Remaining grade 3–4: concrete numeracy / spatial and data ----
case 'e3.number.expression_diagram':{
 const total=a+b+c;
 if(ix===0)return num(total,`テープ図は左から「${a}」「${b}」「${c}」の3区間でできています。全体の長さを式にして求めると？`);
 if(ix===1)return num(b+c,`全体${total}、左の区間${a}のテープ図です。残りの2区間の長さの合計は？`);
 return num(a+b,`赤いテープが${a}cm、青いテープが${b}cm、緑が${c}cmです。赤と青の区間を合わせた長さは何cm？`);
}
case 'e3.geometry.spheres':{
 const radius=n(2,19);
 if(ix===0)return num(radius*2,`球の半径が${radius}cmです。直径は何cm？`);
 if(ix===1)return num(radius,`球の直径が${radius*2}cmです。半径は何cm？`);
 return num(radius*2,`半径が${radius}cmの球形のボールを中心を通って切ります。切り口の最大の円の直径は何cm？`);
}
case 'e3.geometry.isosceles_equilateral':{
 const side=n(3,15),base=n(2,12);
 if(ix===0)return num(side*3,`一辺${side}cmの正三角形の周の長さは何cm？`);
 if(ix===1)return num(side*2+base,`同じ長さの2辺${side}cm、底辺${base}cmの二等辺三角形。周の長さは？`);
 return num(180-2*(n(3,7)*10),`二等辺三角形の2つの底角はともに${n(3,7)*10}度です。頂角は？`);
}
case 'e4.number.large_numbers_trillions':{
 const power=ix===0?8:ix===1?12:9;const digit=n(1,9);
 return num(digit,`${digit}×10^${power} の数で、10^${power} の位の数字は？`);
}
case 'e4.number.decimal_div_integer':{
 const divisor=n(2,8),q=n(11,88),scale=ix===2?100:10;
 return rational(q,scale,`${fmt(q*divisor/scale)} ÷ ${divisor} の答えは？`);
}
case 'e4.number.symbols_formula':{
 const x=n(2,12),total=x*a+b;
 if(ix===0)return num(total,`□を${x}とします。「□×${a}＋${b}」に値を代入した結果は？`);
 if(ix===1)return num(x,`□×${a}＋${b}＝${total}。□の値は？`);
 return num(x,`1冊${a}円のノートを□冊買い、送料${b}円を足すと${total}円でした。□は何冊？`);
}
case 'e4.geometry.parallel_perpendicular':{
 const angle=n(1,8)*10, intersections=n(2,10);
 if(ix===0)return num(90-angle,`直角90度を${angle}度と別の角に分けました。もう一方の角度は？（垂直の理解）`);
 if(ix===1)return num(4*intersections,`垂直な2直線が別々の場所で${intersections}組交わっています。直角は全部で何個？`);
 return num(90,`縦横の道路が垂直に交わる交差点（道幅${n(2,9)}m）で、道路のなす角は何度？`);
}
case 'e4.geometry.quadrilaterals':{
 const side=n(3,16),parallel=n(2,8);
 if(ix===0)return num(side*4,`4辺がすべて${side}cmのひし形があります。周の長さは？`);
 if(ix===1)return ch(`辺${side}cmを持つ四角形で、2組の向かい合う辺が平行なら何という図形？`,'平行四辺形',['直角三角形','円','必ず台形で平行四辺形ではない']);
 return num((side+parallel)*2,`向かい合う辺がそれぞれ等しく、辺の長さ${side}cmと${parallel}cmの平行四辺形。周の長さは？`);
}case 'e4.geometry.rectangles_cubes':{
 const count=n(2,15);
 if(ix===0)return num(count*12,`直方体が別々に${count}個あります。辺は全部で何本？`);
 if(ix===1)return num(count*8,`立方体が${count}個、重ならずにあります。頂点は全部で何個？`);
 return num(count*6,`積み木の立方体${count}個の面を、1個ずつばらばらに数えると全部で何枚？`);
}
case 'e4.geometry.nets_views':{
 const count=n(2,13);
 if(ix===0)return num(count*6,`立方体を${count}個、それぞれ展開すると正方形の面は全部で何枚？`);
 if(ix===1)return num(count*3,`直方体が${count}個あります。各直方体の向かい合う面の組は3組。全部で何組？`);
 return num(count*6,`立方体の紙模型を${count}個作ります。面用の正方形は何枚必要？`);
}
case 'e4.geometry.position_space':{
 const xx=n(1,8),yy=n(1,8);
 if(ix===0)return num(xx,`空間の位置を (x,y,z)=(${xx},${yy},${z}) と表します。x座標はいくつ？`);
 if(ix===1)return num(yy+2,`点(${xx},${yy},${z})をy方向へ2移動します。新しいy座標は？`);
 return num(z+3,`倉庫の棚位置が(${xx},${yy},${z})です。高さ方向を3段上げるとz座標はいくつ？`);
}
case 'e4.functions.co_variation':{
 const slope=n(2,7),x=n(2,10),inter=n(1,8);
 if(ix===0)return num(slope*x+inter,`xとyの関係が y=${slope}x+${inter} です。x=${x} のときyは？`);
 if(ix===1)return num(slope*2,`xが1増えるとyが${slope}増える表があります。xが2増えるとyはいくつ増える？`);
 return num(slope*x,`1本${slope}円の鉛筆をx本買います。x=${x}のとき代金は何円？`);
}
case 'e4.functions.simple_proportion':{
 const rate=n(2,9),x=n(3,12);
 if(ix===0)return num(rate*x,`比例 y=${rate}x で、x=${x}のときyは？`);
 if(ix===1)return num(rate,`比例する量はx=${x}でy=${rate*x}。比例定数はいくつ？`);
 return num(rate*x,`1本${rate}cmのひもを${x}本並べます。長さの合計は何cm？`);
}
case 'e4.functions.simple_percent':{
 const total=n(2,12)*10,part=total/2;
 if(ix===0)return num(50,`全体${total}個の半分は、全体の何%？`);
 if(ix===1)return num(part,`${total}個の50%に当たる個数は？`);
 return num(total/4,`${total}円の商品の25%に当たる金額は何円？`);
}
case 'e4.data.two_way_table':{
 const q=n(3,13),r1=n(2,9),r2=n(2,9);
 if(ix===0)return num(q+r1,`2次元表：男子の徒歩${q}人、自転車${r1}人。男子の合計は？`);
 if(ix===1)return num(q+r2,`2次元表：男子の徒歩${q}人、女子の徒歩${r2}人。徒歩の合計は？`);
 return num(q+r1+r2,`通学方法の表から、徒歩の男子${q}人・女子${r2}人、自転車の男子${r1}人。これら3区分の合計は？`);
}
case 'e4.data.line_graph':{
 const first=n(12,25),grow=n(2,9),next=first+grow;
 if(ix===0)return num(grow,`折れ線グラフで月曜${first}℃、火曜${next}℃でした。何℃上がった？`);
 if(ix===1)return num(next+grow,`月曜${first}、火曜${next}と同じ増加幅なら、水曜の値は？`);
 return num(first,`折れ線グラフで火曜が${next}℃、月曜から${grow}℃上昇しました。月曜は何℃？`);
}
// ---- Grade 5: fractions, geometry, ratios & statistics ----
case 'e5.number.even_odd':{
 const even=2*n(2,50),odd=2*n(2,50)+1;
 if(ix===0)return num(even+2,`${even}の次に来る偶数は？`);
 if(ix===1)return num((even+odd)%2,`偶数${even}と奇数${odd}を足した数を2で割った余りは？`);
 return num(even+odd,`番号が偶数${even}番と奇数${odd}番の札があります。番号の合計は？`);
}
case 'e5.number.multiples_divisors':{
 if(ix===0)return num(a*4,`${a}の4倍は？`);
 if(ix===1)return num(a,`${a*6}の約数で、${a}と等しい数を答えてください。`);
 return num(a*5,`${a}日ごとに開くイベントの5回後は、初回を0日として何日後？`);
}
case 'e5.number.gcd_lcm':{
 const m=n(2,9),v=n(2,6);
 if(ix===0)return num(m,`${m*2} と ${m*3} の最大公約数は？`);
 if(ix===1)return num(m*6,`${m*2} と ${m*3} の最小公倍数は？`);
 return num(m*6,`${m*2}分ごとと${m*3}分ごとに鳴る2つのベルは、同時に鳴ってから何分後に再び同時に鳴る？`);
}
case 'e5.number.fraction_reduce':{
 const den=n(3,9),x=n(1,den-1),mul=n(2,6);
 if(ix===0)return rational(x,den,`${x*mul}/${den*mul} を約分した値を答えてください。`);
 if(ix===1)return rational(x,den,`${x*mul}/${den*mul} と等しい、できるだけ簡単な分数は？`);
 return rational(x,den,`ケーキを${den*mul}等分して${x*mul}切れ食べました。食べた割合を約分した分数は？`);
}
case 'e5.number.fraction_common_denominator':{
 const aa=n(2,7),bb=n(2,8),den=aa*bb;
 if(ix===0)return num(bb,`1/${aa} を分母${den}の分数に直すと、分子は？`);
 if(ix===1)return num(aa,`1/${bb} を分母${den}の分数に直すと、分子は？`);
 return num(den,`分母${aa}と分母${bb}の通分で、共通分母として確実に使える${aa}×${bb}の値は？`);
}
case 'e5.number.fraction_add_unlike':{
 const x=n(1,4),y=n(1,5),den=n(2,6),den2=n(2,6),v=x/den+y/den2;
 return rational(x*den2+y*den,den*den2,ix===0?`${x}/${den} ＋ ${y}/${den2} の値は？`:ix===1?`通分して計算：${x}/${den} ＋ ${y}/${den2} ＝ □。□ は？`:`${x}/${den}Lと${y}/${den2}Lを合わせると何L？`);
}
case 'e5.number.fraction_sub_unlike':{
 const den=n(2,8),q=n(2,6),top=n(2,6);const v=(top*q+1)/(den*q)-1/den;
 return rational(top,den,ix===0?`${top*q+1}/${den*q} − 1/${den*q} は？`:ix===1?`${top}/${den} ＋ 1/${den*q} − 1/${den*q} は？`:`${top*q+1}/${den*q}Lから1/${den*q}Lを引きます。残りは何L？`);
}
case 'e5.number.fraction_decimal_convert':{
 const nume=n(1,9),den=ix===2?5:10;
 if(ix===0)return rational(nume,10,`小数 ${fmt(nume/10)} を分数で答えてください。`);
 if(ix===1)return num(nume/10,`${nume}/10 を小数で答えてください。`);
 return num(nume/den,`1mの${nume}/${den}は、1mの何倍？（小数または分数）`);
}
case 'e5.number.decimal_times_decimal':{
 const x=n(11,85),y=n(11,48);return rational(x*y,100,ix===0?`${fmt(x/10)} × ${fmt(y/10)} ＝ □`:ix===1?`小数の積：${fmt(x/10)} × ${fmt(y/10)} を計算。`:`${fmt(x/10)}mのリボンを${fmt(y/10)}倍すると何m？`);
}
case 'e5.number.decimal_div_decimal':{
 const divisor=n(12,35),q=n(2,14),v=divisor*q/10;
 return num(q,ix===0?`${fmt(v)} ÷ ${fmt(divisor/10)} ＝ □`:ix===1?`□ × ${fmt(divisor/10)} ＝ ${fmt(v)}。□は？`:`${fmt(v)}Lの液体を${fmt(divisor/10)}Lずつ分けると何本できる？`);
}
case 'e5.number.fraction_times_integer':{
 const den=n(3,9),top=n(1,den-1),x=n(2,8);return rational(top*x,den,ix===0?`${top}/${den} × ${x} は？`:ix===1?`分数のかけ算：${x} × ${top}/${den} の値は？`:`${top}/${den}L入りを${x}本用意しました。全部で何L？`);
}
case 'e5.number.fraction_div_integer':{
 const den=n(2,7),top=n(1,den),x=n(2,8);return rational(top,den*x,ix===0?`${top}/${den} ÷ ${x} は？`:ix===1?`分数を整数で割る：${top}/${den} ÷ ${x} の値は？`:`${top}/${den}Lのジュースを${x}人で等分すると1人何L？`);
}
case 'e5.geometry.polygons_regular':{
 const sides=n(3,10);if(ix===0)return num(sides,`正${sides}角形の辺の数は？`);
 if(ix===1)return num(sides*(sides-3)/2,`${sides}角形で、隣り合わない頂点どうしを結ぶ対角線は全部で何本？`);
 return num(sides*a,`正${sides}角形の一辺が${a}cmのとき、周りの長さは何cm？`);
}
case 'e5.geometry.congruent_figures':{
 const len=n(3,18),angle=n(3,14)*10;
 if(ix===0)return num(len,`合同な2つの三角形で一方の対応辺が${len}cm。もう一方の対応辺は何cm？`);
 if(ix===1)return num(angle,`合同な2つの三角形の対応する角の一つが${angle}度。もう一方は何度？`);
 return ch(`対応する辺が${len}cmの合同な図形について、常に成り立つのは？`,'対応する角の大きさも等しい',['面積だけが倍になる','対応する角は必ず異なる','対応する辺の長さは必ず半分になる']);
}
case 'e5.geometry.triangle_angle_sum':{
 const x=n(30,70),y=n(30,70);return num(180-x-y,ix===0?`三角形の2つの内角が${x}度と${y}度。残りは？`:ix===1?`三角形の内角の和180度。${x}度、${y}度以外の角度は？`:`三角形の形をした看板の2つの角が${x}度、${y}度です。3つ目は何度？`);
}
case 'e5.geometry.polygon_angle_sum':{
 const sides=n(4,9);if(ix===0)return num((sides-2)*180,`${sides}角形の内角の和は何度？`);
 if(ix===1)return num(sides-2,`${sides}角形は1つの頂点から線を引くと何個の三角形に分けられる？`);
 return num((sides-2)*180,`正${sides}角形のすべての内角を足すと何度？`);
}
case 'e5.geometry.triangle_area':{
 const h=n(2,12),base=n(2,12);return num(base*h/2,ix===0?`三角形の底辺${base}cm、高さ${h}cm。面積は何cm²？`:ix===1?`底辺${base}cmの三角形の高さが${h}cm。面積は？`:`旗の形が底辺${base}m、高さ${h}mの三角形です。面積は何m²？`);
}
case 'e5.geometry.parallelogram_area':{
 const base=n(3,20),h=n(2,13);return num(base*h,ix===0?`平行四辺形の底辺${base}cm、高さ${h}cm。面積は？`:ix===1?`平行四辺形の面積を「底辺×高さ」で求めます。底辺${base}、高さ${h}なら？`:`平行四辺形の花壇が底辺${base}m、高さ${h}m。面積は何m²？`);
}
case 'e5.geometry.trapezoid_rhombus_area':{
 const h=n(2,12),b1=n(3,14),b2=n(3,14);
 if(ix===0)return num((b1+b2)*h/2,`台形の上底${b1}cm、下底${b2}cm、高さ${h}cm。面積は？`);
 if(ix===1)return num(b1*b2/2,`ひし形の対角線の長さが${b1}cmと${b2}cm。面積は？`);
 return num((b1+b2)*h/2,`台形の土地の上底${b1}m、下底${b2}m、高さ${h}m。面積は何m²？`);
}
case 'e5.geometry.circle_circumference':{
 const rad=n(2,12);return num(rad*(ix===1?2:2)*PI,ix===0?`半径${rad}cmの円周を円周率3.14で求めると？`:ix===1?`直径${rad*2}cmの円周は？ 円周率3.14。`:`半径${rad}mの円形の池の周りを1周すると何m？（円周率3.14）`);
}
case 'e5.geometry.prism_cylinder':{
 const side=n(3,10),count=n(2,10);
 if(ix===0)return num(side+2,`${side}角柱の面の数は？`);
 if(ix===1)return num(side*2,`${side}角柱の頂点の数は？`);
 return num(count*3,`別々の円柱を${count}個用意しました。1個につき側面1つ・底面2つなら、面は合計何つ？`);
}
case 'e5.geometry.volume_units':{
 const x=n(2,8);if(ix===0)return num(x*1000000,`${x}m³ は何cm³？`);
 if(ix===1)return num(x*1000,`${x}L は何cm³？`);
 return num(x*1000,`水${x}Lは何cm³ですか？`);
}
case 'e5.geometry.rect_prism_volume':{
 const h=n(2,9),l=n(2,9),v=n(2,9);return num(h*l*v,ix===0?`直方体の縦${h}cm、横${l}cm、高さ${v}cm。体積は？`:ix===1?`底面積${h*l}cm²、高さ${v}cmの直方体の体積は？`:`縦${h}cm、横${l}cm、深さ${v}cmの水槽の容量は何cm³？`);
}
case 'e5.functions.unit_rate':{
 const rate=n(2,18),people=n(3,9);return num(rate,ix===0?`${people}人で${people*rate}個のパンを等分します。1人何個？`:ix===1?`${people}m²の畑で${people*rate}kg収穫しました。1m²当たり何kg？`:`${people}枚で${people*rate}円の紙です。1枚当たり何円？`);
}
case 'e5.functions.speed':{
 const rate=n(10,85),hour=n(2,6);if(ix===0)return num(rate*hour,`時速${rate}kmで${hour}時間進むと何km？`);
 if(ix===1)return num(rate,`${hour}時間で${rate*hour}km進みました。時速は何km？`);
 return num(hour,`${rate}km/hの自転車で${rate*hour}km走ります。何時間？`);
}
case 'e5.functions.percentage':{
 const x=n(2,12)*100,per=p([10,20,25,50]);if(ix===0)return num(x*per/100,`${x}円の${per}%はいくら？`);
 if(ix===1)return num(per,`${x}円のうち${x*per/100}円は何%？`);
 return num(x-x*per/100,`${x}円の品物を${per}%引きで購入しました。代金は？`);
}
case 'e5.functions.proportion_relation':{
 const rate=n(2,13),x=n(2,12),x2=n(2,8);
 if(ix===0)return num(rate*x,`比例 y=${rate}xでx=${x}ならyは？`);
 if(ix===1)return num(rate,`比例表でx=${x}のときy=${rate*x}です。比例定数は？`);
 return num(rate*x2,`1冊${rate}円の本を${x2}冊買います。比例する代金は何円？`);
}
case 'e5.data.average':{
 const x=n(2,10),mid=n(3,12),high=n(4,14);const arr=[x,mid,high];if(ix===0)return num((x+mid+high)/3,`${x}, ${mid}, ${high} の平均は？`);
 if(ix===1)return num(x+mid+high,`3つの値${x},${mid},${high}の合計は？（平均の準備）`);
 return num((x+mid+high)/3,`3日間に${x}個、${mid}個、${high}個の工作を作りました。1日平均は？`);
}
case 'e5.data.pie_graph':{
 const pct=p([5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90]);if(ix===0)return num(360*pct/100,`円グラフの${pct}%に相当する中心角は何度？`);
 if(ix===1)return num(pct,`全体200人中${pct*2}人の区分は、円グラフの何%？`);
 return num(pct*3,`帯グラフで${pct}%が青です。全体300人のうち青は何人？`);
}
case 'e5.data.statistical_problem_solving':{
 const count=n(3,12),scores=n(6,17),spread=n(2,7);
 if(ix===0)return num(scores,`${count}人のデータの合計が${count*scores}点です。平均は？`);
 if(ix===1)return num(spread,`2つの学校の記録を比較します。A校の最大${scores+spread}点・最小${scores}点の範囲は何点？`);
 return num(scores*4,`4人の得点が${scores-2}, ${scores-1}, ${scores+1}, ${scores+2}点でした。合計は？`);
}
case 'e6.number.reciprocal':{
 const x=n(2,9),y=n(2,9);if(ix===0)return rational(y,x,`${x}/${y} の逆数は？`);
 if(ix===1)return num(1/x,`${x} の逆数は？`);
 return rational(y,x,`速さを${x}/${y}倍するとき、元に戻すために掛ける倍率は？`);
}
case 'e6.number.fraction_times_fraction':{
 const x=n(1,7),y=n(2,9),z=n(1,8),w=n(2,9);return rational(x*z,y*w,ix===0?`${x}/${y} × ${z}/${w} ＝ □`:ix===1?`分数同士の積 ${z}/${w} × ${x}/${y} は？`:`${x}/${y}Lの${z}/${w}倍の水は何L？`);
}
case 'e6.number.fraction_div_fraction':{
 const x=n(1,7),y=n(2,9),z=n(1,8),w=n(2,9);return rational(x*w,y*z,ix===0?`${x}/${y} ÷ ${z}/${w} ＝ □`:ix===1?`分数で割る計算：${x}/${y} ÷ ${z}/${w} は？`:`${x}/${y}Lを、${z}/${w}Lずつ分けると何杯分？`);
}
case 'e6.number.mixed_numbers':{
 const x=n(1,6),y=n(1,8);return rational(2*x+y,2,ix===0?`${x} ＋ ${y}/2 ＝ □`:ix===1?`${x} ＋ 1/2 ＋ ${y-1}/2 ＝ □`:`${x}Lと${y}/2Lの水を合わせると何L？`);
}
case 'e6.number.letter_expressions':{
 const x=n(2,9),v=n(2,9);if(ix===0)return num(x*v,`a=${v}のとき、${x}a の値は？`);
 if(ix===1)return num(x*v+3,`a=${v}のとき ${x}a+3 の値は？`);
 return num(x*v,`1箱${x}個入りの箱がa箱です。a=${v}なら何個？`);
}
case 'e6.geometry.enlarge_reduce':{
 const len=n(3,15),factor=n(2,5);if(ix===0)return num(len*factor,`1辺${len}cmを${factor}倍に拡大すると何cm？`);
 if(ix===1)return num(len,`長さ${len*factor}cmを1/${factor}に縮小すると何cm？`);
 return num(len*factor*factor,`面積${len}cm²の図形を縦横${factor}倍に拡大しました。面積は何cm²？`);
}
case 'e6.geometry.line_symmetry':{
 const x=n(3,16),y=n(2,12);
 if(ix===0)return num(-x,`点(${x},${y})をy軸に関して線対称に移すと、x座標は？`);
 if(ix===1)return num(-y,`点(${x},${y})をx軸に関して線対称に移すと、y座標は？`);
 return num(x,`川の中心線を対称軸とし、岸から${x}m離れた位置の反対側の対称点も、岸から何m離れる？`);
}
case 'e6.geometry.point_symmetry':{
 const x=n(2,16),y=n(2,12);
 if(ix===0)return num(-x,`点(${x},${y})を原点について点対称にするとx座標は？`);
 if(ix===1)return num(-y,`点(${x},${y})を原点について点対称にするとy座標は？`);
 return num(-x,`地図の地点(${x},${y})を原点周りに180度回転すると、x座標は？`);
}
case 'e6.geometry.circle_area':{
 const radius=n(2,12);return num(radius*radius*PI,ix===0?`半径${radius}cmの円の面積は？（円周率3.14）`:ix===1?`直径${radius*2}cmの円の面積は何cm²？（円周率3.14）`:`半径${radius}mの丸い池の面積は何m²？（円周率3.14）`);
}
case 'e6.geometry.prism_volume':{
 const base=n(5,35),h=n(2,12),rad=n(2,6);if(ix===0)return num(base*h,`角柱の底面積${base}cm²、高さ${h}cm。体積は？`);
 if(ix===1)return num(rad*rad*PI*h,`円柱の半径${rad}cm、高さ${h}cm。体積は？（円周率3.14）`);
 return num(base*h,`底面積${base}m²、深さ${h}mの柱形の水槽は何m³？`);
}
case 'e6.functions.ratio':{
 const x=n(2,8),y=n(2,8),mul=n(2,6);if(ix===0)return rational(x,y,`比 ${x}:${y} の比の値は？`);
 if(ix===1)return num(x*mul,`比${x}:${y}を${mul}倍したとき、前項はいくつ？`);
 return num(x*mul,`赤と青の個数の比が${x}:${y}で、赤は${x*mul}個です。赤の個数を答えてください。`);
}
case 'e6.functions.proportional_expression':{
 const rate=n(2,12),x=n(3,10);if(ix===0)return num(rate*x,`y=${rate}x のとき x=${x}。yは？`);
 if(ix===1)return num(rate,`比例グラフが点(${x},${rate*x})を通ります。比例定数は？`);
 return num(rate*x,`1本${rate}cmの棒が${x}本あります。全長は何cm？`);
}
case 'e6.functions.inverse_proportional':{
 const k=n(3,9)*n(2,8),x=n(2,8);if(ix===0)return rational(k,x,`反比例 y=${k}/x、x=${x}のときyは？`);
 if(ix===1)return num(k,`反比例の関係でx=${x}, y=${fmt(k/x)}です。比例定数xyは？`);
 return rational(k,x,`${k}個のお菓子を${x}人で同じ数ずつ分けます。1人分は？`);
}
case 'e6.functions.proportional_problem':{
 const unit=n(4,18),x=n(2,8);if(ix===0)return num(unit*x,`比例で1個${unit}円、${x}個の代金は？`);
 if(ix===1)return num(unit,`${x}個で${unit*x}円です。単価は？`);
 return rational(unit*x,x,`一定距離${unit*x}kmを時速${x}kmで進むと何時間？`);
}
case 'e6.data.representative_values':{
 const x=n(1,6),y=n(6,12);if(ix===0)return num(y,`値 ${x},${y},${y},${y+2},${y+4} の中央値は？`);
 if(ix===1)return num(y,`値 ${x},${y},${y},${y},${y+4} の最頻値は？`);
 return num((x+y+y+(y+2)+(y+4))/5,`5日間の観測値が${x},${y},${y},${y+2},${y+4}でした。平均は？`);
}
case 'e6.data.frequency_distribution':{
 const x=n(3,14),y=n(2,12),z=n(1,9);if(ix===0)return num(x+y+z,`度数分布表：0〜10が${x}人、10〜20が${y}人、20〜30が${z}人。合計何人？`);
 if(ix===1)return rational(y,x+y+z,`階級10〜20の度数${y}、全体${x+y+z}の相対度数は？`);
 return num(x,`ヒストグラムの0〜10の棒の高さが${x}人です。この階級の度数は？`);
}
case 'e6.data.possible_cases':{
 const x=n(2,6),y=n(2,7);if(ix===0)return num(x*y,`${x}通りの帽子と${y}通りの上着の組み合わせは何通り？`);
 if(ix===1)return num(x*(x-1),`${x}人の中から会長と副会長を順番に選ぶ場合は何通り？`);
 return num(x*y,`朝食にパン${x}種類と飲み物${y}種類。1種類ずつ選ぶと何通り？`);
}
case 'e6.data.statistical_inference_intro':{
 const total=n(3,12)*100,percent=n(2,8)*10;
 if(ix===0)return num(total*percent/100,`母集団${total}人のうち、標本調査の推定比率${percent}%に相当する人数は？`);
 if(ix===1)return num(percent,`全体${total}人に対し、${total*percent/100}人が該当する推定です。推定割合は何%？`);
 return ch(`住民${total}人のうち一部${n(20,90)}人を調査しました。全体を推定するとき大切なことは？`,'標本の偏りと人数を確認する',['友人だけから回答を集める','標本数は1人でも十分と決めつける','予想と合わない値を捨てる']);
}
case 'j1.number.negative_numbers':{
 const x=n(2,19);if(ix===0)return num(-x,`数直線で0から左へ${x}進んだ点の数は？`);
 if(ix===1)return num(x,`−${x}と${x}のうち大きい数は？`);
 return num(-x,`気温が0℃から${x}℃下がりました。気温は何℃？（負数）`);
}
case 'j1.number.integer_four_ops':{
 const x=n(3,15),y=n(2,12);if(ix===0)return num(-x+y,`−${x} ＋ ${y} ＝ □`);
 if(ix===1)return num(x*y,`(−${x}) × (−${y}) ＝ □`);
 return num(-x-y,`残高が−${x}円の状態から${y}円支出すると残高は？`);
}
case 'j1.number.exponent_positive':{
 const x=n(2,6),pow=n(2,4);return num(x**pow,ix===0?`${x}^${pow} ＝ □`:ix===1?`同じ${x}を${pow}回掛けた数は？`:`長さ${x}を${pow}次元の積として考えます。${x}を${pow}回掛けた値は？`);
}
case 'j1.number.prime_factorization':{
 const pr=p([2,3,5,7]),ex=n(2,4),v=pr**ex;if(ix===0)return num(ex,`${v}を素因数分解したとき、素数${pr}の指数は？`);
 if(ix===1)return num(pr,`${v}の素因数分解に現れる素数を1つ答えてください（${pr}だけ）。`);
 return num(ex,`${pr}だけを掛けて${v}を作ります。何回掛ける？`);
}
case 'j1.algebra.variables_terms':{
 const x=n(2,12),co=n(2,8);if(ix===0)return num(co*x,`x=${x}のとき ${co}x の値は？`);
 if(ix===1)return num(co*x+5,`x=${x}のとき ${co}x+5 の値は？`);
 return num(co*x,`1冊${co}円のノートをx冊買います。x=${x}のとき何円？`);
}
case 'j1.algebra.linear_expression':{
 const co=n(2,8),co2=n(1,7),x=n(2,9);if(ix===0)return num((co+co2)*x,`x=${x}として、${co}x+${co2}x の値は？`);
 if(ix===1)return num((co-co2)*x,`x=${x}として、${co}x−${co2}x の値は？`);
 return num(co*x+co2*x,`代金が${co}x円と${co2}x円です。x=${x}のとき合計は？`);
}
case 'j1.algebra.inequality_expressions':{
 const x=n(2,10);return ch(ix===0?`x=${x}のとき、次のうち成り立つ不等式は？`:ix===1?`x=${x}のとき正しい大小関係は？`:`商品価格x=${x}円について、xが${x+2}より安いことを表す不等式は？`,`x<${x+2}`,[`x>${x+2}`,`x=${x+2}`,`x≥${x+2}`]);
}
case 'j1.algebra.linear_equation_meaning':{
 const x=n(2,11),co=n(2,8),rhs=co*x+3;if(ix===0)return num(x,`${co}x+3=${rhs}の解xは？`);
 if(ix===1)return num(x,`xに${x}を代入すると${co}x+3=${rhs}が成り立ちます。xはいくつ？`);
 return num(x,`1個${co}円の商品をx個買い、袋代3円を足すと${rhs}円。xは？`);
}
case 'j1.algebra.solve_linear':case 'j1.algebra.linear_equation':{
 const x=ix===2?n(2,12):n(-8,12),co=n(2,9),off=n(2,11),rhs=co*x+off;
 if(ix===0)return num(x,`${co}x + ${off} = ${rhs} を解いてください。`);
 if(ix===1)return num(x,`${co}(x+${off}) = ${co*(x+off)}。xを求めてください。`);
 return num(x,`x個の品物を1個${co}円で買い送料${off}円、合計${rhs}円。xはいくつ？（負数になる設定なら方程式の解として答える）`);
}
case 'j1.algebra.ratio_equation':{
 const x=n(2,13),co=n(2,8),den=n(2,9);return num(x,ix===0?`x:${den} = ${x*co}:${den*co}。xは？`:ix===1?`x/${den} = ${x*co}/${den*co} のxは？`:`同じ比${x}:${den}を${co}倍にすると前項${x*co}です。元の前項xは？`);
}
case 'j1.algebra.word_equations':{
 const x=n(2,20),co=n(2,9),fix=n(3,13),total=x*co+fix;
 return num(x,ix===0?`${co}x+${fix}=${total} を解いてください。`:ix===1?`xを${co}倍して${fix}を足すと${total}。xは？`:`鉛筆1本${co}円をx本と袋代${fix}円で${total}円。何本買った？`);
}
case 'j1.geometry.basic_constructions':{
 const length=n(3,18),angle=n(2,15)*10;
 if(ix===0)return num(length,`長さ${2*length}cmの線分の垂直二等分線が線分と交わる点は、端から何cm？`);
 if(ix===1)return num(90,`長さ${length}cmの線分に垂直な直線を作図します。なす角は何度？`);
 return num(angle/2,`角${angle}度の二等分線を作図すると、片側の角は何度？`);
}
case 'j1.geometry.transformations':{
 const x=n(-8,8),y=n(-8,8),dx=n(2,9);if(ix===0)return num(x+dx,`点(${x},${y})をx方向へ${dx}平行移動した点のx座標は？`);
 if(ix===1)return num(-x,`点(${x},${y})をy軸に関して対称移動した点のx座標は？`);
 return num(-y,`点(${x},${y})を原点の周りに180度回転した点のy座標は？`);
}
case 'j1.geometry.spatial_lines_planes':{
 return ch(ix===0?`立方体の1つの頂点で交わる辺の本数は？（辺の長さ${a}cm）`:ix===1?`同一平面にある異なる2直線が平行なら？（平面上の点${a}を考える）`:`直方体で1つの面に垂直な辺の本数は？（横${a}cmの箱）`,ix===0?'3本':ix===1?'交わらない':'4本',ix===0?['2本','4本','6本']:ix===1?['1点で交わる','必ず重なる','必ず直角に交わる']:['2本','6本','8本']);
}
case 'j1.geometry.surface_area':{
 const side=n(2,9),length=n(2,9);if(ix===0)return num(6*side*side,`1辺${side}cmの立方体の表面積は何cm²？`);
 if(ix===1)return num(2*(side*side+2*side*length),`縦${side}cm、横${side}cm、高さ${length}cmの直方体の表面積は？`);
 return num(4*PI*side*side,`半径${side}cmの球の表面積は？（π=3.14）`);
}
case 'j1.geometry.solid_volumes':{
 const rad=n(2,7),h=n(2,8);if(ix===0)return num(PI*rad*rad*h,`半径${rad}cm、高さ${h}cmの円柱の体積は？（π=3.14）`);
 if(ix===1)return num(PI*rad*rad*h/3,`半径${rad}cm、高さ${h}cmの円錐の体積は？（π=3.14）`);
 return num(4*PI*rad**3/3,`半径${rad}cmの球の体積を求めてください。（π=3.14）`);
}
case 'j1.geometry.sector_arclength_area':{
 const radius=n(3,10),angle=p([30,45,60,90,120,180]);if(ix===0)return num(2*PI*radius*angle/360,`半径${radius}cm、中心角${angle}度のおうぎ形の弧の長さは？（π=3.14）`);
 if(ix===1)return num(PI*radius*radius*angle/360,`半径${radius}cm、中心角${angle}度のおうぎ形の面積は？（π=3.14）`);
 return num(PI*radius*radius*angle/360,`半径${radius}mの円形花壇の${angle}/360だけを使いました。面積は何m²？（π=3.14）`);
}
case 'j1.geometry.nets_projections':{
 const count=n(2,12);
 if(ix===0)return num(6*count,`${count}個の立方体を1個ずつ展開します。面の正方形は何枚？`);
 if(ix===1)return num(count*2,`${count}個の円柱をそれぞれ真上と真下から見ます。円形の底面は全部で何枚？`);
 return num(count*3,`円柱${count}個の展開図で、各円柱に長方形の側面1枚と円形の底面2枚を使います。合計何面？`);
}
case 'j1.functions.coordinate_plane':{
 const x=n(-8,9),y=n(-8,9);if(ix===0)return num(x,`点(${x},${y})のx座標は？`);
 if(ix===1)return num(-y,`点(${x},${y})をx軸対称にした点のy座標は？`);
 return num(x+3,`地図の地点(${x},${y})から東へ3進むと、x座標は？`);
}
case 'j1.functions.proportional_yax':{
 const rate=n(-7,8)||3,x=n(-8,8)||2;if(ix===0)return num(rate*x,`y=${rate}xでx=${x}ならyは？`);
 if(ix===1)return num(rate,`原点を通る比例グラフが点(${x},${rate*x})を通ります。aは？`);
 return num(rate*x,`x=${x}個の品物の合計がy=${rate}xでモデル化されます。yの値は？`);
}
case 'j1.functions.inverse_y_over_x':{
 const k=n(2,9)*n(2,8),x=n(2,9);if(ix===0)return rational(k,x,`y=${k}/x。x=${x}のときyは？`);
 if(ix===1)return num(k,`反比例でx=${x}, y=${fmt(k/x)}。比例定数xyは？`);
 return rational(k,x,`${k}本の苗を${x}人で同じ数ずつ担当します。1人あたり何本？`);
}
case 'j1.functions.functions_application':{
 const rate=n(2,15),x=n(3,10);if(ix===0)return num(rate*x,`比例でy=${rate}x、x=${x}。yは？`);
 if(ix===1)return num(rate*x,`一定積xy=${rate*x}でx=${x}ならyは？`);
 return num(rate*x,`毎分${rate}L入る水を${x}分ためます。総量は？`);
}
case 'j1.data.histogram_relative_freq':{
 const x=n(3,14),total=x*5;if(ix===0)return num(x/total,`度数${x}、合計${total}の相対度数は？`);
 if(ix===1)return num(x,`ヒストグラムのある階級の棒の高さが${x}人です。度数は？`);
 return num(100*x/total,`${total}人中${x}人の区分の割合は何%？`);
}
case 'j1.data.experimental_probability':{
 const x=n(2,9),trials=x*10;if(ix===0)return rational(x,trials,`サイコロなどを${trials}回試して${x}回当たり。相対度数は？`);
 if(ix===1)return rational(3*x,10*x,`${10*x}回中${3*x}回起きた事象の実験的な確率の推定値は？`);
 return num(x,`試行${trials}回で当たりが10%なら、当たりは何回？`);
}
// ---- Junior high 2: polynomials, systems, proofs, linear functions ----
case 'j2.algebra.polynomial_add_sub':{
 const x=n(2,9),co=n(2,9),co2=n(1,8);if(ix===0)return num((co+co2)*x,`x=${x}として、${co}x+${co2}x の値は？`);
 if(ix===1)return num((co-co2)*x+3,`x=${x}として(${co}x+3)−${co2}x は？`);
 return num((co+co2)*x,`辺が${co}x cmと${co2}x cmの合計をx=${x}で求めると？`);
}
case 'j2.algebra.polynomial_monomial':{
 const x=n(2,8),y=n(2,8),co=n(2,7);if(ix===0)return num(co*x*(x+y),`x=${x},y=${y}で、${co}x(x+y) の値は？`);
 if(ix===1)return num(co*x+co*y,`x=${x},y=${y}で、${co}(x+y) の値は？`);
 return num(co*x*y,`縦${co}x、横yの長方形でx=${x},y=${y}。面積は？`);
}
case 'j2.algebra.formula_transform':{
 const x=n(2,13),y=n(2,9),co=n(2,8),sum=co*x+y;return num(x,ix===0?`${co}x+y=${sum}、y=${y}。xを求めてください。`:ix===1?`${co}x=${sum}−y、y=${y}。xは？`:`${co}人のグループにx枚ずつと予備${y}枚で${sum}枚。xは？`);
}
case 'j2.algebra.simultaneous_meaning':{
 const x=n(2,11),y=n(2,9),sum=x+y,diff=x-y;if(ix===0)return num(x,`連立方程式 x+y=${sum}, x−y=${diff} のxは？`);
 if(ix===1)return num(y,`x+y=${sum}, x−y=${diff} のyは？`);
 return num(x,`赤と青を合わせて${sum}個、赤が青より${diff}個多いとき赤は何個？`);
}
case 'j2.algebra.solve_simultaneous':{
 const x=n(2,9),y=n(2,8),m=n(2,7);if(ix===0)return num(x,`x+y=${x+y}, ${m}x+y=${m*x+y} を解いたxは？`);
 if(ix===1)return num(y,`x+y=${x+y}, x−y=${x-y} を解いたyは？`);
 return num(x,`2つの値の和が${x+y}、差が${x-y}です。大きい小さいに関係なくxを連立で求めると？（x+y, x−y）`);
}
case 'j2.algebra.word_simultaneous':{
 const x=n(2,14),y=n(2,9);if(ix===0)return num(x,`りんごx個、みかんy個。x+y=${x+y}、2x+y=${2*x+y}。りんごは何個？`);
 if(ix===1)return num(y,`Aがx本、Bがy本でx+y=${x+y}, x−y=${x-y}。Bは何本？`);
 return num(x+y,`大きい箱${x}個と小さい箱${y}個。合計何個？（連立方程式の数量整理）`);
}
case 'j2.geometry.angles_parallel':{
 const angle=n(3,15)*10;if(ix===0)return num(angle,`平行な2直線を横切る直線が作る同位角の一つが${angle}度。他方は？`);
 if(ix===1)return num(180-angle,`平行線の同側内角の一つが${angle}度。もう一つは？`);
 return num(angle,`平行な道路を斜めの道が横断し、錯角が${angle}度です。対応する錯角は何度？`);
}
case 'j2.geometry.polygon_angle_sum':{
 const sides=n(4,10);if(ix===0)return num((sides-2)*180,`${sides}角形の内角の和を求めてください。`);
 if(ix===1)return num(360,`${sides}角形の外角の和は？（1頂点につき1つ）`);
 return num((sides-2)*180/sides,`正${sides}角形の1つの内角は何度？`);
}
case 'j2.geometry.congruence_conditions':{
 const x=n(3,12);return ch(ix===0?`長さ${x}cmの辺を持つ三角形の合同条件として成立するのは？`:ix===1?`三角形が合同だと判定できるのは？（辺の一つ${x}cm）`:`合同な三角形の対応する辺が${x}cmでした。正しい説明は？`,'3組の辺がそれぞれ等しい',['1組の辺だけが等しい','面積だけが等しい','周の長さだけが等しい']);
}
case 'j2.geometry.proof_logic':{
 const x=n(3,12);return ch(ix===0?`「AB=ACなら底角が等しい」（AB=${x}cm）という命題で仮定に当たるのは？`:ix===1?`二等辺三角形ABCでAB=AC=${x}cm。証明の結論に当たるのは？`:`仮定AB=AC=${x}cmから二等辺三角形の底角が等しいと示します。「示すこと」は？`,ix===0?'AB=AC':'∠ABC=∠BCA',ix===0?['∠ABC=∠BCA','ABとBCが垂直','BC=0']:['AB=ACだけ','辺の長さがすべて異なる','角の和が360度']);
}
case 'j2.geometry.triangle_properties_proofs':{
 const angle=n(35,75);if(ix===0)return num(180-2*angle,`二等辺三角形の底角がどちらも${angle}度です。頂角は？`);
 if(ix===1)return ch(`AB=AC=${n(3,14)}cmの三角形ABCで、等しい角は？`,'∠ABC と ∠BCA',['∠BAC と ∠BCA','∠BAC と ∠ABC','3つの角は必ずすべて等しい']);
 return num(angle,`二等辺三角形の底角の一方が${angle}度なら、もう一方は何度？`);
}
case 'j2.geometry.parallelogram_proofs':{
 const x=n(3,15);if(ix===0)return num(x,`平行四辺形ABCDでAB=${x}cm。対辺CDの長さは？`);
 if(ix===1)return ch(`辺AB=${x}cmの四角形で、平行四辺形と判定できる十分な条件は？`,'2組の向かい合う辺がそれぞれ平行',['1組の辺だけが等しい','対角線の片方が長い','1つの角が直角である']);
 return num(180-x*10,`平行四辺形の1つの内角は${x*10}度。隣の内角は？`);
}
case 'j2.functions.linear_function_yaxb':{
 const rate=ix===2?n(2,9):(n(-6,7)||2),base=ix===2?n(2,9):n(-9,9),x=n(2,10);if(ix===0)return num(rate*x+base,`y=${rate}x+(${base}), x=${x}。yは？`);
 if(ix===1)return num(base,`一次関数 y=${rate}x+(${base}) の切片は？`);
 return num(rate*x+base,`開始時に${base}、1日${rate}ずつ変化する量があります。${x}日後は？`);
}
case 'j2.functions.slope_intercept':{
 const rate=n(-6,8)||2,base=n(-5,9);if(ix===0)return num(rate,`直線 y=${rate}x+${base} の傾きは？`);
 if(ix===1)return num(base,`直線 y=${rate}x+${base} のy切片は？`);
 return num(rate*2,`y=${rate}x+${base}。xが2増えるとyはどれだけ増える？`);
}
case 'j2.functions.linear_table_graph':{
 const rate=n(2,9),base=n(1,8),x=n(2,9);if(ix===0)return num(rate*x+base,`表が y=${rate}x+${base} に従うとき、x=${x}でyは？`);
 if(ix===1)return num(rate,`表でx=0→1の間にyが${rate}増えます。直線の傾きは？`);
 return num(rate*x+base,`グラフが切片${base}、傾き${rate}の直線です。x=${x}でのy座標は？`);
}
case 'j2.functions.linear_application':{
 const rate=n(3,20),base=n(4,25),x=n(2,9);if(ix===0)return num(rate*x+base,`料金が y=${rate}x+${base}円。x=${x}なら？`);
 if(ix===1)return num(rate,`基本料金${base}円に1回${rate}円ずつ加わります。1回増えるといくら上昇？`);
 return num(rate*x+base,`タクシーの基本料金${base}円と距離1kmごと${rate}円、${x}kmなら何円？`);
}
case 'j2.functions.simultaneous_graph':{
 const x=n(2,12),rate=n(2,7),base=n(-9,9),y=rate*x+base;if(ix===0)return num(x,`直線 y=${rate}x+${base} と y=${y} が交わる点のx座標は？`);
 if(ix===1)return num(y,`直線 y=${rate}x+${base} と y=${y} が交わる点のy座標は？`);
 return num(x,`2つの料金が y=${rate}x+${base}, y=${y} で等しくなるのはxいくつ？`);
}
case 'j2.data.quartiles_boxplot':{
 const x=n(2,7),step=n(2,6),vals=[x,x+step,x+step*2,x+step*3,x+step*4];if(ix===0)return num(vals[2],`昇順データ${vals.join(',')}の中央値は？`);
 if(ix===1)return num((vals[1]+vals[0])/2,`4要素の昇順データ${vals[0]},${vals[1]},${vals[2]},${vals[3]}の下位2値の中央値（例示的な下側区間）は？`);
 return num(vals[4]-vals[0],`観測値${vals.join(',')}の範囲（最大−最小）は？`);
}
case 'j2.data.compare_distributions':{
 const mean=n(4,12),range=n(2,9);if(ix===0)return ch(`平均が${mean}と等しい2集団の散らばりについて正しいのは？`,'平均が同じでも散らばりは異なりうる',['平均だけで最大値まで決まる','必ず箱ひげ図が一致する','範囲も必ず一致する']);
 if(ix===1)return num(range,`データAの最小値${mean}、最大値${mean+range}。範囲は？`);
 return ch(`平均${mean}の2クラスを比較する際、散らばりを調べる指標は？`,'四分位範囲',['生徒番号','クラスの名称','教室の面積']);
}
case 'j2.data.count_based_probability':{
 const red=n(2,8),blue=n(2,8);if(ix===0)return rational(red,red+blue,`赤${red}個、青${blue}個の袋から1個取ると赤の確率は？`);
 if(ix===1)return rational(blue,red+blue,`赤${red}個、青${blue}個の袋から1個取ると青の確率は？`);
 return rational(red*blue,(red+blue)*(red+blue-1),`赤${red}個、青${blue}個から復元せず順に2個。1番目赤・2番目青の確率は？`);
}
// ---- Junior high 3: radicals, quadratics, similarity, data inference ----
case 'j3.number.square_root_meaning':{
 const x=n(2,19);if(ix===0)return num(x,`√${x*x} の値（正の平方根）は？`);
 if(ix===1)return num(x*x,`√□=${x} のとき□は？`);
 return num(x,`面積${x*x}cm²の正方形の1辺は何cm？`);
}
case 'j3.number.root_operations':{
 const x=n(2,12),y=n(2,7);if(ix===0)return num(x,`√${x*x} を根号のない形にすると？`);
 if(ix===1)return num(x+y,`√${x*x} ＋ √${y*y} は？`);
 return num(x*y,`長さ√${x*x}cmの棒を${y}倍します。長さは何cm？`);
}
case 'j3.number.significant_digits':{
 const x=n(2,9),exp=n(2,7);if(ix===0)return num(x*10**exp,`${x}×10^${exp} を整数で答えてください。`);
 if(ix===1)return num(exp,`${x}×10^${exp}の10の指数は？`);
 return num(x*10**exp,`科学的記数法で${x}×10^${exp}mと表された距離を、整数のmで答えると？`);
}
case 'j3.algebra.expand_polynomials':{
 const x=n(2,9),m=n(2,8),s=n(2,7);if(ix===0)return num((x+m)*(x+s),`x=${x}で(x+${m})(x+${s})を計算。`);
 if(ix===1)return num(x*x+(m+s)*x+m*s,`x=${x}で展開式x²+${m+s}x+${m*s}の値は？`);
 return num((x+m)*(x+s),`辺が(x+${m})cmと(x+${s})cmの長方形でx=${x}。面積は？`);
}
case 'j3.algebra.factorize_polynomials':{
 const x=n(2,9),m=n(2,8),s=n(2,7);if(ix===0)return num((x+m)*(x+s),`x=${x}として x²+${m+s}x+${m*s} の値を因数分解の形から求めると？`);
 if(ix===1)return num(m*s,`x²+${m+s}x+□=(x+${m})(x+${s})。□の値は？`);
 return num(m+s,`(x+${m})(x+${s})を展開したときのxの係数は？`);
}
case 'j3.algebra.quadratic_eq_meaning':{
 const x=n(2,10);if(ix===0)return num(x,`x²=${x*x} を満たす正の解xは？`);
 if(ix===1)return num(-x,`x²=${x*x}を満たす負の解xは？`);
 return num(x,`面積${x*x}cm²の正方形の一辺x（x>0）を求めてください。`);
}
case 'j3.algebra.solve_quadratic_factor':{
 const x=n(2,11),y=n(1,8);if(ix===0)return num(x,`(t−${x})(t+${y})=0 の正の解tは？`);
 if(ix===1)return num(-y,`(t−${x})(t+${y})=0 の負の解tは？`);
 return num(x,`t²+(${y-x})t−${x*y}=0 の正の解tは？`);
}
case 'j3.algebra.solve_quadratic_formula':{
 const x=n(2,10),y=n(2,9);if(ix===0)return num(x,`t²−${2*x}t+${x*x}=0 の解tは？`);
 if(ix===1)return num(x+y,`t²−${2*x}t+${x*x-y*y}=0 の大きい解は？`);
 return num(x,`(t−${x})²=0 の解は？`);
}
case 'j3.algebra.quadratic_word_problems':{
 const x=n(2,13),plus=n(2,8),area=x*(x+plus);if(ix===0)return num(x,`縦x、横x+${plus}の長方形の面積は${area}。x>0の解は？`);
 if(ix===1)return num(x+plus,`縦x、横x+${plus}、面積${area}。長い辺は？`);
 return num(x,`縦より${plus}cm長い横の長方形の面積が${area}cm²です。縦は何cm？`);
}
case 'j3.geometry.similarity_conditions':{
 const ratio=n(2,5),base=n(3,12);if(ix===0)return num(base*ratio,`相似比1:${ratio}の小さい三角形の辺${base}cmに対応する大きい辺は？`);
 if(ix===1)return ch(`1辺が${base}cmの2つの三角形を比べるとき、相似を確かめられる条件は？`,'2組の角がそれぞれ等しい',['辺1組だけが等しい','面積だけが等しい','周長だけが等しい']);
 return num(base*ratio,`小さな三角形の辺${base}cmを${ratio}倍にした相似図形では何cm？`);
}
case 'j3.geometry.parallel_ratios':{
 const x=n(2,10),mult=n(2,6);return num(x*mult,ix===0?`平行線が切る対応する線分の比1:${mult}で、小さい線分${x}cmに対応する大きい線分は？`:ix===1?`相似な三角形の対応する辺が${x}:${x*mult}です。倍率を求めてください。`:`図面の${x}cmが実物では${mult}倍。対応する線分の長さは何cm？`);
}
case 'j3.geometry.area_volume_ratio':{
 const x=n(2,6);if(ix===0)return num(x*x,`相似比が1:${x}。面積比の大きい方は小さい方の何倍？`);
 if(ix===1)return num(x*x*x,`相似比が1:${x}。体積比は何倍？`);
 return num(x*x,`相似なポスターの辺を${x}倍にすると面積は何倍？`);
}
case 'j3.geometry.inscribed_angle':{
 const central=n(2,8)*20;if(ix===0)return num(central/2,`同じ弧に対する中心角が${central}度のとき円周角は？`);
 if(ix===1)return num(central,`円周角${central/2}度に対する中心角は何度？`);
 return num(90,`直径に対する円周角は何度？（直径${n(4,22)}cm）`);
}
case 'j3.geometry.pythagorean_theorem':{
 const m=n(2,8),s=3*m,l=4*m,h=5*m;if(ix===0)return num(h,`直角三角形の直角をはさむ辺が${s}cmと${l}cm。斜辺は？`);
 if(ix===1)return num(s,`斜辺${h}cm、他の辺${l}cm。残りの辺は？`);
 return num(h*h,`直角三角形で辺${s},${l}を直角にはさむとき斜辺の2乗は？`);
}
case 'j3.geometry.pythagorean_applications':{
 const m=n(2,9);if(ix===0)return num(5*m,`縦${3*m}cm、横${4*m}cmの長方形の対角線は？`);
 if(ix===1)return num(4*m,`斜めのはしご${5*m}m、壁から離れた距離${3*m}m。上端の高さは？`);
 return num(5*m,`3:${4}の辺の比で直角三角形を作り、短い辺が${3*m}m。斜辺は何m？`);
}
case 'j3.functions.quadratic_function':{
 const coef=n(2,8),x=n(2,9);if(ix===0)return num(coef*x*x,`y=${coef}x², x=${x} のときyは？`);
 if(ix===1)return num(coef,`y=ax²が点(${x},${coef*x*x})を通ります。aは？`);
 return num(coef*x*x,`縦横の拡大率x=${x}に比例して面積が${coef}x²です。面積は？`);
}
case 'j3.functions.quadratic_table_graph':{
 const co=n(2,8),x=n(2,9);if(ix===0)return num(co*x*x,`関数y=${co}x²でx=${x}ならyは？`);
 if(ix===1)return num(co*x*x,`y=${co}x²でx=−${x}のときyは？`);
 return num(4,`y=${co}x²で、xを正の数のまま2倍するとyは何倍になる？`);
}
case 'j3.functions.quadratic_application':{
 const co=n(2,8),x=n(2,9);if(ix===0)return num(co*x*x,`二次関数y=${co}x²でx=${x}のときの値は？`);
 if(ix===1)return num(co*(x+1)**2-co*x*x,`y=${co}x²でx=${x}から${x+1}へ増加するとyはいくら増える？`);
 return num(co*x*x,`正方形の面積をy=${co}x²と表す模型でx=${x}。面積の値は？`);
}
case 'j3.data.sampling_population':{
 if(ix===0)return ch(`全体${a*100}人のうち一部を調べる統計調査で、全体を何という？`,'母集団',['標本','度数','偏差']);
 if(ix===1)return num(a*10,`全体${a*100}人の10%を標本にします。標本の人数は？`);
 return ch(`町の住民${a*100}人の傾向を一部の住民から推測する方法は？`,'標本調査',['全数調査','個別実験','証明による演繹']);
}
case 'j3.data.random_sampling':{
 if(ix===0)return ch(`名簿${a*100}人から無作為抽出するとき適切なのは？`,'乱数を使って全員が選ばれる機会をもつようにする',['知人だけを選ぶ','成績順の先頭だけを選ぶ','回答が気に入った人だけを選ぶ']);
 if(ix===1)return num(a*10,`${a*100}人の母集団から10%を単純無作為抽出します。標本は何人？`);
 return ch(`学校${a*100}人から標本を取る方法で偏りが少ないのは？`,'名簿から乱数で抽出する',['最前列の生徒だけ','自分の友人だけ','最初に登校した人だけ']);
}
case 'j3.data.infer_population':{
 const sampled=n(30,60),rate=p([20,25,40,50]);if(ix===0)return num(sampled*rate/100,`標本${sampled}人で賛成が${rate}%でした。標本内の賛成人数は？`);
 if(ix===1)return ch(`標本${sampled}人から母集団を推定するとき、正しい注意は？`,'標本の取り方と標本誤差を確認する',['全員の意見が完全にわかる','標本数と無関係に常に正しい','偏りは存在しない']);
 return num(rate*10,`標本調査の賛成率${rate}%を、1000人に当てはめた単純推定値は何人？`);
}
// ---- Mathematics I ----
case 'h-i.algebra.real_numbers':{
 const x=n(2,12);if(ix===0)return num(x,`|−${x}| の値は？`);
 if(ix===1)return ch(`√${x*x} はどの数の集合に含まれる？`,'有理数',['無理数だけ','純虚数だけ','自然数ではない負の実数']);
 return num(x,`面積${x*x}m²の正方形の1辺は何m？（正の実数）`);
}
case 'h-i.algebra.absolute_value':{
 const x=n(2,14),y=n(-12,12);if(ix===0)return num(x,`|−${x}| は？`);
 if(ix===1)return num(Math.abs(y-x),`|${y}−${x}| は？`);
 return num(x,`数直線で点−${x}から0までの距離は？`);
}
case 'h-i.algebra.polynomial_operations':{
 const x=n(2,9),m=n(2,8),y=n(2,8);if(ix===0)return num(x*x+(m+y)*x+m*y,`x=${x}として(x+${m})(x+${y})の値は？`);
 if(ix===1)return num((m+y)*x,`x=${x}として${m}x+${y}xの値は？`);
 return num((x+m)*(x+y),`2辺(x+${m}), (x+${y})の長方形の面積をx=${x}で求めると？`);
}
case 'h-i.algebra.factorization_advanced':{
 const x=n(2,9),m=n(2,9),b=n(2,8);if(ix===0)return num((x+m)*(x+b),`因数分解を利用してx=${x}で x²+${m+b}x+${m*b} を求めると？`);
 if(ix===1)return num(m*b,`x²+${m+b}x+□=(x+${m})(x+${b})。□は？`);
 return num((x+m)**2,`x=${x}で x²+${2*m}x+${m*m} の値は？`);
}
case 'h-i.algebra.linear_inequalities':{
 const x=n(2,9),m=n(2,8);if(ix===0)return num(x,`不等式 2x < ${2*x+1} を満たす最大の整数xは？`);
 if(ix===1)return num(x,`x > ${x-1}、x < ${x+1}を同時に満たす整数xは？`);
 return num(x,`定価${m}円の商品をx個買い予算${m*(x+1)}円未満にしたい。買える最大の整数個数は？`);
}
case 'h-i.algebra.propositional_logic':{
 return ch(ix===0?`整数x=${a}について「xは偶数ならx²は偶数」は？`:ix===1?`x=${a}を含む実数全体で「x>0ならx²>0」は？`:`整数n=${a}を例に「4の倍数なら2の倍数」は？`,'真',['偽','条件不足で必ず判定不能','どの整数でも真でも偽でもない']);
}
case 'h-i.geometry.trig_ratios':{
 const m=n(2,8);if(ix===0)return rational(3,5,`直角三角形の辺が${3*m},${4*m},${5*m}（斜辺${5*m}）、角θの向かい側が${3*m}。sinθは？`);
 if(ix===1)return rational(4,5,`辺${3*m},${4*m},${5*m}の直角三角形で、角θの隣辺${4*m}、斜辺${5*m}。cosθは？`);
 return rational(3,4,`高さ${3*m}m、底辺${4*m}mの坂の傾き角θ。tanθは？`);
}
case 'h-i.geometry.trig_obtuse':{
 const angle=p([0,30,45,60,90]),turns=n(1,12);
 const sn={0:0,30:0.5,45:Math.SQRT1_2,60:Math.sqrt(3)/2,90:1};
 const cs={0:-1,30:-Math.sqrt(3)/2,45:-Math.SQRT1_2,60:-0.5,90:0};
 if(ix===0)return num(sn[angle],`sin(${180-angle}+${turns*360}度)の値を小数で答えてください（6桁程度）。`);
 if(ix===1)return num(cs[angle],`cos(${180-angle}+${turns*360}度)の値は？（小数6桁程度）`);
 return num(-1,`cos(${180+turns*360}度)の値は？（周期と鈍角の関係）`);
}
case 'h-i.geometry.sine_cosine_rule':{
 const side=n(3,12),angle=p([60,90,120]);if(ix===0)return num(2*side*side,`余弦定理 c²=a²+b²−2ab cos90°。a=b=${side}のときc²は？`);
 if(ix===1)return num(3*side*side,`a=b=${side}, C=120°、cos120°=−1/2のときc²は？`);
 return num(side*side,`2辺${side},${side}、間の角60°の三角形。第3辺の長さの2乗は？`);
}
case 'h-i.geometry.triangle_area_trig':{
 const side=n(2,12),base=n(3,13);if(ix===0)return num(side*base/2,`2辺${side}cmと${base}cm、間の角90°の三角形の面積は？`);
 if(ix===1)return num(side*base/4,`2辺${side}cmと${base}cm、間の角30°。sin30°=1/2として面積は？`);
 return num(side*base/2,`直角に交わる2辺${side}m、${base}mの三角形の畑の面積は？`);
}
case 'h-i.functions.quadratic_general':{
 const m=n(2,8),x=n(2,9),v=n(1,9);if(ix===0)return num(m*x*x+v*x+3,`y=${m}x²+${v}x+3、x=${x}でyは？`);
 if(ix===1)return num(m,`二次関数y=${m}x²+${v}x+3の二次の係数は？`);
 return num(m*x*x,`高さy=${m}x²（モデル）でx=${x}のとき高さは？`);
}
case 'h-i.functions.completing_square':{
 const vertex=n(-8,8),a=n(1,5),shift=n(-8,8);if(ix===0)return num(vertex,`y=${a}(x−(${vertex}))²+(${shift}) の頂点のx座標は？`);
 if(ix===1)return num(shift,`y=${a}(x−(${vertex}))²+(${shift}) の頂点のy座標は？`);
 return num(a*(vertex+2-vertex)**2+shift,`平方完成形 y=${a}(x−${vertex})²+(${shift})でx=${vertex+2}の値は？`);
}
case 'h-i.functions.quadratic_max_min':{
 const x=n(-8,9),v=n(-10,10),co=n(1,5);if(ix===0)return num(v,`y=${co}(x−${x})²+(${v}) の最小値は？`);
 if(ix===1)return num(v,`y=−${co}(x−${x})²+(${v}) の最大値は？`);
 return num(x,`放物線y=${co}(x−${x})²+(${v})の最小値をとるxは？`);
}
case 'h-i.functions.quadratic_inequality':{
 const x=n(2,9);if(ix===0)return ch(`x² < ${x*x} の解の範囲は？`,`−${x}<x<${x}`,[`x<−${x} または x>${x}`,`x>${x}のみ`,`x<−${x}のみ`]);
 if(ix===1)return ch(`x² > ${x*x} の解の範囲は？`,`x<−${x} または x>${x}`,[`−${x}<x<${x}`,`−${x}≤x≤${x}`,`x=${x}のみ`]);
 return ch(`実数xで x²≤${x*x} となる区間は？`,`−${x}≤x≤${x}`,[`x≥${x}のみ`,`x≤−${x}のみ`,`x>${x}またはx<−${x}`]);
}
case 'h-i.data.variance_std':{
 const center=n(6,13),delta=n(2,8);if(ix===0)return num(delta*delta,`${center-delta}, ${center+delta} の2値の母分散は？`);
 if(ix===1)return num(delta,`${center-delta}, ${center+delta} の2値の母標準偏差は？`);
 return num(center,`2日の記録${center-delta}点と${center+delta}点の平均点は？`);
}
case 'h-i.data.scatter_correlation':{
 const x=n(2,12);if(ix===0)return ch(`x=${x}の周辺で「xが大きいほどyも大きくなる」散布図の相関の符号は？`,'正',['負','必ず0','相関係数は常に2を超える']);
 if(ix===1)return num(1,`点(${x},${2*x}),(${x+1},${2*x+2}),(${x+2},${2*x+4})のピアソン相関係数は？`);
 return ch(`学年が${x}年と${x+1}年で、身長と靴サイズに相関が見つかりました。正しい注意は？`,'相関があっても因果関係とは限らない',['必ず因果関係がある','散布図は不要','相関係数はいつも1']);
}
case 'h-i.data.hypothesis_testing_intro':{
 if(ix===0)return ch(`標本${a*10}人で検証するとき、帰無仮説とは？`,'検定で棄却を検討する基準の仮説',['常に真と証明された主張','調査対象者の氏名','有意差があるとの結論そのもの']);
 if(ix===1)return ch(`有意水準${a}%で検定するとき、p値が有意水準未満なら通常どうする？`,'帰無仮説を棄却する',['帰無仮説が絶対に偽と証明できる','何もしないことが義務','対立仮説が必ず100%真となる']);
 return ch(`ある効果が有意水準${a}%で有意でした。この事実だけから言えるのは？`,'効果の実用的重要性は別途評価が必要',['効果は必ず大きい','再現率は100%','p値が原因の強さを示す']);
}
// ---- Mathematics A ----
case 'h-a.geometry.triangle_centers':{
 const side=n(3,12),median=n(6,18);
 if(ix===0)return ch(`一辺${side}cmの三角形の中線3本が交わる点は？`,'重心',['内心','外心','いずれの中線上にもない点']);
 if(ix===1)return num(median*2/3,`頂点から底辺の中点へ引いた中線の長さが${median}cm。頂点から重心までの長さは？`);
 return ch(`辺長${side}cmの三角形で、3辺から等距離にある中心は？`,'内心',['重心','外心','辺の中点だけ']);
}
case 'h-a.geometry.circle_lines':{
 const r=n(3,12),dis=n(2,18);if(ix===0)return num(r,`円の中心から接線までの距離は半径${r}cmと等しい。距離は？`);
 if(ix===1)return ch(`半径${r}cmの円と直線の距離が${r}cmなら交点数は？`,'1個',['0個','2個','無限個']);
 return ch(`半径${r}cmの円の中心から${r+2}cm離れた直線は円と？`,'交わらない',['2点で交わる','接する','円の内部に完全に含まれる']);
}
case 'h-a.geometry.spatial_geometry_props':{
 const sides=n(3,9),faces=sides+2,verts=sides*2;if(ix===0)return num(3*sides,`${sides}角柱の頂点${verts}個、面${faces}枚。オイラーの公式 V−E+F=2 から辺の数は？`);
 if(ix===1)return num(12,`立方体の辺の本数はいくつ？（辺長${a}cm）`);
 return num(6,`正六面体（立方体）の面の数は？（一辺${a}cm）`);
}
case 'h-a.probability.counting_principles':{
 const x=n(3,9),y=n(2,8);if(ix===0)return num(x+y,`互いに重ならない選び方A${x}通り、B${y}通り。どちらかを選ぶ方法は？`);
 if(ix===1)return num(x*y,`手順Aが${x}通り、各手順にBが${y}通りあるとき全部で何通り？`);
 return num(x*y,`帽子${x}種類とシャツ${y}種類。両方1つずつ選ぶ組合せは？`);
}
case 'h-a.probability.permutations':{
 const x=n(4,10),r=p([2,3,4]),product=Array.from({length:r},(_,i)=>x-i).reduce((u,v)=>u*v,1);if(ix===0)return num(product,`${x}人から${r}人を順序を区別して選ぶ順列の数は？`);
 if(ix===1)return num(x*(x-1),`${x}人から会長と副会長を決める方法は何通り？`);
 return num(product,`${x}冊から${r}冊を選んで順に並べる方法は？`);
}
case 'h-a.probability.combinations':{
 const x=n(5,13),r=p([2,3]),comb=r===2?x*(x-1)/2:x*(x-1)*(x-2)/6;if(ix===0)return num(comb,`${x}人から順序を区別せず${r}人選ぶ組合せは？`);
 if(ix===1)return num(x*(x-1)/2,`${x}人から2人組を作る方法は？`);
 return num(comb,`${x}種類の本から異なる${r}冊を買う選び方は？`);
}
case 'h-a.probability.probability_formal':{
 const red=n(1,8),blue=n(1,8);if(ix===0)return rational(red,red+blue,`赤${red}個、青${blue}個。1個無作為に取ると赤の確率は？`);
 if(ix===1)return rational(blue,red+blue,`赤${red}個、青${blue}個。1個取ると青の確率は？`);
 return rational(red,red+blue,`全${red+blue}通りの同様に確からしい場合のうち、当たりが${red}通り。確率は？`);
}
case 'h-a.probability.independent_events':{
 const p1=n(1,5),q1=n(2,7);if(ix===0)return rational(p1*q1,100,`独立な事象A(${p1}/10), B(${q1}/10)が同時に起きる確率は？`);
 if(ix===1)return rational(p1*(10-q1),100,`独立なAの確率${p1}/10、Bの確率${q1}/10。Aが起きBが起きない確率は？`);
 return rational(p1*q1,100,`独立な2つの抽選で当選確率${p1}/10と${q1}/10。両方当選する確率は？`);
}
case 'h-a.probability.conditional_probability':{
 const red=n(2,8),blue=n(2,8);if(ix===0)return rational(red-1,red+blue-1,`赤${red}個、青${blue}個から戻さず2個。最初が赤とわかったとき2番目も赤である条件付き確率は？`);
 if(ix===1)return rational(blue,red+blue-1,`赤${red}個、青${blue}個、1個目が赤。戻さないなら2個目が青の確率は？`);
 return rational(red,red+blue-1,`赤${red}個、青${blue}個、1個目が青だった条件の下で2個目が赤の確率は？`);
}
case 'h-a.probability.expectation':{
 const prize=n(3,15),prob=n(1,8);if(ix===0)return rational(prize*prob,10,`確率${prob}/10で${prize}点、他は0点。期待値は？`);
 if(ix===1)return rational(prize*prob,10,`${prize}円を確率${prob}/10でもらう抽選の期待受取額は？`);
 return rational(prize*prob,10,`当選確率${prob}/10で${prize}ポイントを得るゲームの平均獲得ポイントは？`);
}
case 'h-a.discrete.integer_algorithms':{
 const x=n(2,12),y=n(2,9);if(ix===0)return num(gcd(x*6,x*9),`${x*6} と ${x*9} の最大公約数は？`);
 if(ix===1)return num((x*2)*(x*3)/gcd(x*2,x*3),`${x*2}と${x*3}の最小公倍数は？`);
 return num(x,`ユークリッド互除法で${x*6}と${x*7}の最大公約数を求めると？`);
}
case 'h-a.discrete.n_base_numbers':{
 const base=n(2,8),digit=n(1,base-1),digit2=n(0,base-1);if(ix===0)return num(digit*base+digit2,`${base}進法の2桁 (${digit}${digit2})_${base} は10進法で？`);
 if(ix===1)return num(base*base,`${base}進法で100と書く数は10進法で？`);
 return num(digit*base+digit2,`(${digit}${digit2})_${base}の場所の値を計算するといくつ？`);
}
case 'h-a.discrete.math_history_activity':{
 const x=n(3,11),y=n(2,9);if(ix===0)return num(x*y,`古代の長方形畑：縦${x}歩、横${y}歩なら面積は何平方歩？`);
 if(ix===1)return ch(`古代の交易で${x}個の品物を比べるとき、問題を数学化する最初の段階は？`,'数量と条件を明確にする',['答えを先に決める','条件を消す','計算を無関係に増やす']);
 return num(x*y,`古い算術書風の問題：1列${x}人で${y}列、合計何人？`);
}
// ---- Mathematics II: powers, trig, differentiation, integration ----
case 'h-ii.algebra.binomial_theorem':{
 const pwr=n(3,7),co=n(2,8);if(ix===0)return num(pwr,`(x+${co})^${pwr} のx^${pwr-1}の係数を${co}で割った値は？`);
 if(ix===1)return num(pwr*(pwr-1)/2,`(x+1)^${pwr} のx^${pwr-2}の係数は？`);
 return num(2**pwr,`二項定理より (1+1)^${pwr} は？`);
}
case 'h-ii.algebra.polynomial_remainder':{
 const x=n(2,7),m=n(2,9),b=n(2,8);if(ix===0)return num(x*x+m*x+b,`P(x)=x²+${m}x+${b} を(x−${x})で割った余りは？`);
 if(ix===1)return num(b,`P(x)=x²+${m}x+${b} をxで割った余りは？`);
 return num(x*x+m*x+b,`因数定理の準備：P(x)=x²+${m}x+${b}のP(${x})は？`);
}
case 'h-ii.algebra.high_degree_eq':{
 const x=n(2,9),m=n(2,8);if(ix===0)return num(x,`(t−${x})(t²+${m})=0 の実数解tは？`);
 if(ix===1)return num(x,`(t−${x})³=0 の実数解tは？`);
 return num(x,`高次方程式 (t−${x})(t²+${m*m})=0 の実数解は？`);
}
case 'h-ii.algebra.complex_numbers':{
 const x=n(2,12);if(ix===0)return num(-x*x,`i²=−1とすると(${x}i)²の実数値は？`);
 if(ix===1)return num(x*x,`(${x}i)(−${x}i) の値は？`);
 return ch(`方程式 z²=−${x*x} の解として正しいものは？`,`z=±${x}i`,[`z=±${x}`,`z=${x*x}のみ`,`実数解が必ず2つ存在する`]);
}
case 'h-ii.geometry.coordinate_line_circle':{
 const x=n(-8,9),y=n(-8,9),r=n(2,8);if(ix===0)return num(r*r,`円(x−(${x}))²+(y−(${y}))²=${r*r} の半径の2乗は？`);
 if(ix===1)return num(x,`円(x−(${x}))²+(y−(${y}))²=${r*r} の中心のx座標は？`);
 return num(r,`中心(${x},${y})、半径${r}の円の方程式で右辺r²の平方根は？`);
}
case 'h-ii.geometry.locus_region':{
 const center=n(2,12),radius=n(2,8);if(ix===0)return ch(`|x−${center}|≤${radius}が表す数直線上の領域は？`,`[${center-radius}, ${center+radius}]`,[`x<${center-radius}だけ`,`x>${center+radius}だけ`,`x=${center}以外`]);
 if(ix===1)return num(center-radius,`|x−${center}|≤${radius} の左端（最小値）は？`);
 return num(center+radius,`中心${center}、半径${radius}の区間の右端は？`);
}
case 'h-ii.functions.powers_extended':{
 const x=n(2,10);if(ix===0)return num(x,`(${x*x})^(1/2)の正の値は？`);
 if(ix===1)return num(x*x*x,`(${x*x})^(3/2)は？`);
 return num(x,`面積${x*x}の正方形の辺長は (面積)^(1/2) で何cm？`);
}
case 'h-ii.functions.exponential_function':{
 const base=n(2,6),x=n(1,6);if(ix===0)return num(base**x,`y=${base}^xでx=${x}の値は？`);
 if(ix===1)return num(base,`f(x)=${base}^x の f(x+1)/f(x) は？`);
 return num(base**x,`最初1匹の細胞が毎回${base}倍。${x}回後は何匹？`);
}
case 'h-ii.functions.logarithm':{
 const base=n(2,7),x=n(2,5);if(ix===0)return num(x,`log_${base}(${base**x}) は？`);
 if(ix===1)return num(base**x,`log_${base}(□)=${x} の□は？`);
 return num(x,`量が毎回${base}倍に増えます。1から${base**x}になるのに何回？`);
}
case 'h-ii.functions.log_function':{
 const base=n(2,6),x=n(2,5);if(ix===0)return num(x,`f(x)=log_${base}(x), x=${base**x}のときf(x)は？`);
 if(ix===1)return num(0,`底${base}（1より大きい）の対数関数 log_${base}(1)は？`);
 return num(x,`初期値1が毎回${base}倍になるとき、${base**x}倍になる回数を対数で表した値は？`);
}
case 'h-ii.functions.unit_circle_radian':{
 const count=n(1,6);if(ix===0)return num(count*180,`${count}π ラジアンは何度？`);
 if(ix===1)return rational(count,2,`${count*90}度をπで割ったラジアン係数は？（例：90度→1/2）`);
 return num(count*180,`時計の針を${count}πラジアンだけ回転すると、角度の大きさは何度？`);
}
case 'h-ii.functions.trigonometric_functions':{
 const nturn=n(1,8);if(ix===0)return num(0,`sin(${nturn*180}度) の値は？`);
 if(ix===1)return num(1,`sin(90度+${nturn*360}度) の値は？`);
 return num(360,`sinθの基本周期は何度？（θが${nturn}回転の近くでも同じ）`);
}
case 'h-ii.functions.trigonometric_identities':{
 const angle=n(1,12)*15;
 if(ix===0)return num(1,`sin²${angle}°+cos²${angle}° の値は？`);
 if(ix===1)return num(1,`cos(${angle}°−${angle}°) = cos0° は？`);
 return num(0,`sin(${180*n(1,9)}°) の値は？（周期性を利用）`);
}
case 'h-ii.calculus.derivative_polynomial':{
 const degree=n(2,5),co=n(2,8),x=n(1,5);if(ix===0)return num(co*degree*x**(degree-1),`f(x)=${co}x^${degree} の導関数をx=${x}で評価すると？`);
 if(ix===1)return num(co*degree,`f(x)=${co}x^${degree} の導関数の最高次項の係数は？`);
 return num(2*co*x,`位置s(t)=${co}t²、t=${x}での瞬間速度（微分係数）は？`);
}
case 'h-ii.calculus.increasing_decreasing':{
 const vertex=n(-7,8),co=n(1,5);if(ix===0)return num(vertex,`f(x)=${co}(x−${vertex})²+3 の極小となるxは？`);
 if(ix===1)return num(vertex,`f(x)=−${co}(x−${vertex})²+3 の極大となるxは？`);
 return num(2*co*3,`f(x)=${co}x²のx=3での傾き（導関数）は？`);
}
case 'h-ii.calculus.integration_polynomial':{
 const power=n(1,5),co=n(2,8),x=n(2,6);if(ix===0)return num(co*x**(power+1)/(power+1),`定積分 ∫[0,${x}] ${co}t^${power} dt の値は？`);
 if(ix===1)return num(co/(power+1),`不定積分 ∫${co}x^${power} dx の x^${power+1} の係数は？（積分定数は除く）`);
 return num(co*x**2/2,`速度v(t)=${co}t を0から${x}秒まで積分した移動距離は？`);
}
case 'h-ii.calculus.area_integral':{
 const x=n(2,9),co=n(2,9);if(ix===0)return num(co*x*x/2,`y=${co}xとx軸に囲まれるx=0から${x}までの面積は？`);
 if(ix===1)return num(co*x**3/3,`y=${co}x²とx軸に囲まれるx=0から${x}までの面積は？`);
 return num(co*x*x/2,`底辺${x}、高さ${co*x}の三角形の面積を定積分で求めると？`);
}
// ---- Mathematics B: sequences, inference and modeling ----
case 'h-b.algebra.sequence_basics':{
 const start=n(2,12),step=n(2,8),at=n(3,12);if(ix===0)return num(start+(at-1)*step,`初項${start}、公差${step}の数列の第${at}項は？`);
 if(ix===1)return num(at,`数列a_n=${start}+${step}(n−1)の第${at}項の項番号は？`);
 return num(start+(at-1)*step,`1日目${start}個、毎日${step}個ずつ増やすと${at}日目には何個？`);
}
case 'h-b.algebra.arith_geom_seq':{
 const start=n(2,7),ratio=n(2,5),at=n(3,7);if(ix===0)return num(start*ratio**(at-1),`初項${start}、公比${ratio}の等比数列の第${at}項は？`);
 if(ix===1)return num(start*((ratio**at-1)/(ratio-1)),`初項${start}、公比${ratio}の等比数列の初めから${at}項の和は？`);
 return num(start*ratio**(at-1),`初日に${start}個、毎日${ratio}倍になる数は${at}日目に何個？`);
}
case 'h-b.algebra.sum_notation':{
 const at=n(3,15),co=n(2,8);if(ix===0)return num(at*(at+1)/2,`Σ[k=1..${at}] k は？`);
 if(ix===1)return num(co*at,`Σ[k=1..${at}] ${co} は？`);
 return num(at*(at+1)/2,`1日目1個、2日目2個、…${at}日目までの合計は？`);
}
case 'h-b.algebra.recurrence':{
 const start=n(2,13),step=n(2,8),at=n(3,12);if(ix===0)return num(start+(at-1)*step,`a₁=${start}, a_(n+1)=a_n+${step}。a_${at}は？`);
 if(ix===1)return num(start*2**(at-1),`a₁=${start}, a_(n+1)=2a_n。a_${at}は？`);
 return num(start+(at-1)*step,`初日${start}個から毎日${step}個増える漸化式。${at}日目は？`);
}
case 'h-b.algebra.mathematical_induction':{
 const at=n(3,15);if(ix===0)return num(at*(at+1)/2,`数学的帰納法で示す公式 1+…+n=n(n+1)/2 にn=${at}を代入した値は？`);
 if(ix===1)return ch(`n=${at}まで命題を確認した後、数学的帰納法の帰納段階に必要なのは？`,'n=kが真ならn=k+1も真を示す',['n=1だけ確認する','n=k+2を無関係に仮定する','最初に結論を無条件で仮定する']);
 return ch(`すべての自然数についての命題（例：n=${at}）を数学的帰納法で証明する2段階は？`,'最初の値の確認と帰納段階',['いくつかの値を見て推測するだけ','証明せずすべて真と言う','計算機の表示を読むだけ']);
}
case 'h-b.data.random_variables':{
 const red=n(2,9),blue=n(2,9),value=n(2,14);if(ix===0)return rational(red*value,red+blue,`確率${red}/${red+blue}で${value}点、それ以外0点を取る確率変数の期待値は？`);
 if(ix===1)return rational(blue,red+blue,`確率変数Xが1をとる確率は${red}/${red+blue}。X=0となる確率は？`);
 return rational(red*value,red+blue,`当たり${red}本、外れ${blue}本で当選は${value}円。1回の期待受取額は？`);
}
case 'h-b.data.binomial_distribution':{
 const at=n(2,8),pr=n(1,8);if(ix===0)return rational(at*pr,10,`二項分布B(${at}, ${pr}/10) の期待値npは？`);
 if(ix===1)return rational(at*pr*(10-pr),100,`二項分布B(${at},${pr}/10) の分散np(1−p)は？`);
 return rational(at*pr,10,`独立な${at}回の抽選（成功確率${pr}/10）の成功回数の期待値は？`);
}
case 'h-b.data.normal_distribution':{
 const mean=n(10,80),sd=n(2,12),val=mean+2*sd;if(ix===0)return num(2,`正規分布N(${mean},${sd*sd})でx=${val}の標準化得点zは？`);
 if(ix===1)return num(0,`N(${mean},${sd*sd})の平均${mean}の標準化得点zは？`);
 return num(mean,`平均${mean}、標準偏差${sd}の正規分布の中央値は？`);
}
case 'h-b.data.estimate_intervals':{
 const mean=n(30,70),margin=n(2,10);if(ix===0)return num(mean-margin,`推定平均${mean}、誤差幅±${margin}の区間推定。下限は？`);
 if(ix===1)return num(mean+margin,`推定平均${mean}、誤差幅±${margin}の区間推定。上限は？`);
 return ch(`母平均の95%信頼区間 [${mean-margin},${mean+margin}] の解釈として正しいのは？`,'同じ方法を繰り返すと約95%の区間が真の母平均を含む',['母平均自体が毎回ランダムに移動する','この1区間に母平均が入る確率が厳密に95%と断言できる','標本の95%が必ずこの区間に含まれる']);
}
case 'h-b.data.hypothesis_testing':{
 const lvl=n(1,10),pval=n(1,99);
 if(ix===0)return ch(`有意水準${lvl}%、p値0.0001で帰無仮説を検定します。通常の結論は？`,'帰無仮説を棄却する',['帰無仮説を真と証明できる','p値が効果量を示す','必ず追試不要となる']);
 if(ix===1)return ch(`有意水準${lvl}%、p値0.${String(n(40,99)).padStart(2,'0')}のときは？`,'帰無仮説を棄却できない',['帰無仮説が真と確定する','必ず棄却する','標本の偏りが消える']);
 return ch(`実験${n(30,120)}回で統計的有意差が得られたとき、重要な注意は？`,'有意差と実用的効果の大きさは別の評価が必要',['必ず十分大きな効果である','p値は効果量の単位をもつ','次の研究は不要である']);
}
case 'h-b.modeling.mathematical_modeling':{
 const fixed=n(8,50),rate=n(2,12),x=n(3,14);if(ix===0)return num(fixed+rate*x,`費用モデルC(x)=${fixed}+${rate}x。x=${x}の費用は？`);
 if(ix===1)return num(rate,`線形モデルC(x)=${fixed}+${rate}xの限界費用（1単位追加分）は？`);
 return ch(`売上予測モデルを${x}年間に延長するとき適切な判断は？`,'モデルの仮定と適用範囲を検証する',['得られた式を無期限に正しいとする','外れ値を必ず隠す','観測データの確認をやめる']);
}
// ---- Mathematics III: limits and advanced calculus ----
case 'h-iii.calculus.sequence_limits':{
 const x=n(2,12);if(ix===0)return num(0,`数列a_n=${x}/n の n→∞ の極限は？`);
 if(ix===1)return num(x,`数列a_n=(${x}n+1)/n の n→∞ の極限は？`);
 return num(x,`第n期の指標 ${x}+1/n は長期的にどの値に近づく？`);
}
case 'h-iii.calculus.infinite_series':{
 const start=n(2,12),ratio=p([2,3,4,5]);if(ix===0)return rational(start*ratio,ratio-1,`初項${start}、公比1/${ratio}の無限等比級数の和は？`);
 if(ix===1)return ch(`初項${start}、公比${ratio}の無限等比級数は？`,'発散する',['有限な値に収束する','必ず和が0になる','項数に関係なく和は初項と等しい']);
 return rational(start*ratio,ratio-1,`はじめ${start}m進み、次は1/${ratio}ずつ短く進む無限距離の合計は？`);
}
case 'h-iii.calculus.function_limits':{
 const x=n(2,12),coef=n(2,9);if(ix===0)return num(coef*x,`lim[t→${x}] ${coef}t の値は？`);
 if(ix===1)return num(2*x,`lim[t→${x}] (t²−${x*x})/(t−${x}) の値は？`);
 return num(x*x,`x=${x}へ近づくとき、連続関数f(x)=x²の値は何へ近づく？`);
}
case 'h-iii.calculus.advanced_derivatives':{
 const coef=n(2,9),x=n(2,7);if(ix===0)return num(coef,`f(x)=${coef}e^x の導関数のx=0での値は？`);
 if(ix===1)return num(coef,`f(x)=${coef}ln x の導関数のx=1での値は？`);
 return num(coef*x**2,`f(x)=${coef}x³/3 のx=${x}での導関数の値は？`);
}
case 'h-iii.calculus.product_quotient_chain':{
 const co=n(2,8),x=n(2,7);if(ix===0)return num(2*co*co*x,`f(x)=(${co}x)²の導関数をx=${x}で求めると？`);
 if(ix===1)return num(2*x,`f(x)=x·x の導関数をx=${x}で求めると？`);
 return num(co*co,`f(x)=(${co}x)²/2の導関数をx=1で求めると？`);
}
case 'h-iii.calculus.curve_analysis':{
 const vertex=n(-7,9),co=n(1,5),shift=n(-10,10);if(ix===0)return num(vertex,`f(x)=${co}(x−${vertex})²+${shift} の極小をとるxは？`);
 if(ix===1)return num(2*co,`f(x)=${co}x²+${shift}の2階導関数f''(x)は？`);
 return num(shift,`曲線y=${co}(x−${vertex})²+${shift} の最小値は？`);
}
case 'h-iii.calculus.advanced_indef_integrals':{
 const x=n(2,9),coef=n(2,7);if(ix===0)return num(coef/2,`∫${coef}x dx の原始関数におけるx²の係数は？（積分定数を除く）`);
 if(ix===1)return num(coef,`∫${coef}e^x dx の原始関数でe^xの係数は？（積分定数を除く）`);
 return num(coef*1.5,`定積分 ∫[0,1] ${coef}(x+1) dx の値は？`);
}
case 'h-iii.calculus.advanced_def_integrals':{
 const coef=n(2,10),upper=n(2,8);if(ix===0)return num(coef*(upper-1),`∫[1,${upper}] ${coef} dx は？`);
 if(ix===1)return num(coef*upper**2/2,`∫[0,${upper}] ${coef}x dx は？`);
 return num(coef*(upper-1),`速度v(t)=${coef}m/sがt=1から${upper}秒まで続くと移動距離は？（定積分）`);
}
case 'h-iii.calculus.area_volume_advanced':{
 const radius=n(2,7),height=n(2,9);if(ix===0)return num(PI*radius*radius*height,`半径${radius}、高さ${height}の円柱を回転体として考えた体積は？（π=3.14）`);
 if(ix===1)return num(PI*radius*radius*height/3,`底面半径${radius}、高さ${height}の円錐の体積は？（π=3.14）`);
 return num(PI*radius*radius*height,`回転体の積分 π∫[0,${height}] ${radius*radius} dt の値は？（π=3.14）`);
}
// ---- Mathematics C: vectors, complex plane, curves, representations ----
case 'h-c.geometry.vectors_components':{
 const x=n(-7,9),y=n(-7,9),dx=n(-7,9),dy=n(-7,9);if(ix===0)return num(x+dx,`ベクトル(${x},${y})+(${dx},${dy}) のx成分は？`);
 if(ix===1)return num(y+dy,`ベクトル(${x},${y})+(${dx},${dy}) のy成分は？`);
 return num(x+dx,`東西方向の移動ベクトル${x}と${dx}を足すとx成分は？`);
}
case 'h-c.geometry.vector_dot_product':{
 const x=n(-7,9),y=n(-7,9),u=n(-7,9),v=n(-7,9);if(ix===0)return num(x*u+y*v,`a=(${x},${y}),b=(${u},${v}) の内積a·bは？`);
 if(ix===1)return num(x*x+y*y,`ベクトル(${x},${y})の自分自身との内積は？`);
 return num(0,`ベクトル(${x},${y})と(${-y},${x})の内積は？（直交するベクトル）`);
}
case 'h-c.geometry.space_vectors':{
 const x=n(-7,9),y=n(-7,9),z=n(-7,9),u=n(-7,9);if(ix===0)return num(x*x+y*y+z*z,`空間ベクトル(${x},${y},${z})の長さの2乗は？`);
 if(ix===1)return num(x*u+y*u+z*u,`a=(${x},${y},${z}),b=(${u},${u},${u})の内積は？`);
 return num(z+u,`空間ベクトル(${x},${y},${z})+(${u},0,${u})のz成分は？`);
}
case 'h-c.geometry.vector_applications':{
 const x=n(-8,9),y=n(-8,9),dx=n(2,7),dy=n(2,7);if(ix===0)return num(dx,`点A(${x},${y}),B(${x+dx},${y+dy})のABベクトルのx成分は？`);
 if(ix===1)return num(dy,`A(${x},${y}),B(${x+dx},${y+dy})のABベクトルのy成分は？`);
 return num(dx*dx+dy*dy,`A(${x},${y}),B(${x+dx},${y+dy})の距離の2乗は？`);
}
case 'h-c.geometry.conic_sections':{
 const rad=n(2,9),w=n(2,8);if(ix===0)return num(rad,`楕円x²/${rad*rad}+y²/${w*w}=1 のx軸方向の半径の長さは？`);
 if(ix===1)return num(4*rad,`放物線y²=4pxでp=${rad}とするとxの係数4pは？`);
 return ch(`x²/${rad*rad}−y²/${w*w}=1 が表す曲線は？`,'双曲線',['楕円','円','放物線']);
}
case 'h-c.geometry.parametric_polar':{
 const r=n(2,14),degree=p([0,90,180,270]);if(ix===0)return num(degree===0?r:degree===90?0:degree===180?-r:0,`極座標(r,θ)=(${r},${degree}°) のx座標は？`);
 if(ix===1)return num(degree===0?0:degree===90?r:degree===180?0:-r,`極座標(${r},${degree}°) のy座標は？`);
 return num(r*r,`極座標で原点からの距離r=${r}の点について、x²+y²の値は？`);
}
case 'h-c.geometry.complex_plane':{
 const x=n(-8,9),y=n(-8,9);if(ix===0)return num(x,`複素数z=${x}+(${y})iの複素数平面でのx座標は？`);
 if(ix===1)return num(y,`z=${x}+(${y})iの虚部は？`);
 return num(x*x+y*y,`z=${x}+(${y})iの絶対値の2乗|z|²は？`);
}
case 'h-c.geometry.complex_geometry':{
 const x=n(2,10),y=n(2,10);if(ix===0)return num(x*x+y*y,`z=${x}+${y}iの z×共役(z) は？`);
 if(ix===1)return num(-y,`z=${x}+${y}iの共役複素数の虚部は？`);
 return num(x*x+y*y,`複素平面で点(${x},${y})と原点の距離の2乗は？`);
}
case 'h-c.modeling.mathematical_representations':{
 const r=n(2,8),co=n(2,7);if(ix===0)return num(r*co,`2×2行列 [[${r},0],[0,${co}]] の行列式は？`);
 if(ix===1)return num(r+co,`2×2行列 [[${r},0],[0,${co}]] のトレースは？`);
 return ch(`都市${r}個を道路で結ぶネットワークを表すのに向いた数学的表現は？`,'頂点と辺からなるグラフ',['色だけのリスト','一つの定数だけ','曜日の名前だけ']);
}
 default:throw Error('Unimplemented advanced skill '+id);
 }
}
return {makeQuestion};
});
