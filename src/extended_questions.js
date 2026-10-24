/* MathStudio v0.1.8 — hand-authored families for the new curriculum skills.
   A template is NOT considered reliable without the dedicated test battery.
   All numbers and answers remain generated locally, with no network/API calls. */
(function(root,factory){const v=factory();if(typeof module==='object'&&module.exports)module.exports=v;else root.MathExtendedQuestions=v;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const rnd=(a,b,r)=>Math.floor(r()*(b-a+1))+a;
const pick=(a,r)=>a[rnd(0,a.length-1,r)];
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),frac=(a,b)=>{let g=gcd(a,b);return b/g===1?String(a/g):`${a/g}/${b/g}`;};
const fmt=n=>Number.isInteger(n)?String(n):String(Math.round(n*10000)/10000);
function makeQuestion(skill,category='basic',r=Math.random){
 const id=skill.id,k=id.split('.').slice(2).join('.');
 const A=category==='basic',B=category==='application',W=category==='word';
 const u=(a,b)=>rnd(a,b,r),p=(arr)=>pick(arr,r);
 const n=u(2,9),m=u(2,8),t=u(3,9);
 // Each return comprises exact expected value and the visible target. For word
 // tasks with semantic source quantities, include a symbolic formula contract.
 const out=(answer,prompt,meta={})=>({
  id:`x_${Date.now().toString(36)}_${Math.floor(r()*1e9).toString(36)}`,
  skillId:id,category,prompt,answer,displayAnswer:meta.displayAnswer||fmt(answer),
  inputMode:meta.formula?'formula':'value',params:meta.params||undefined,
  formula:meta.formula||undefined,allowed_constants:meta.allowed_constants||[],
  unit:meta.unit||'',hint:meta.hint||'単位や数量の関係を落ち着いて確認しよう。',
  archetype:meta.archetype||k
 });
 const story=(answer,prompt,params,formula,unit='')=>out(answer,prompt,{params,formula,unit});
 const choice=(answer,prompt)=>out(answer,prompt,{hint:'選択肢の番号を入力してください。'});
 switch(id){
 // ---- Grade 1: number sense, arithmetic, shapes, position and measures ----
 case 'e1.number.count_objects':{
   let total=u(3,13),sy=p(['★','●','▲']);
   if(A)return out(total,`${Array(total).fill(sy).join(' ')}\n${sy} は何個ある？`);
   if(B)return out(total,`次の並びにある●だけを数えてね。\n${Array(total).fill('●').join('  ')}`);
   return out(total,`かごの中にりんごが${total}個あります。1つずつ数えると、全部で何個？`);
 }
 case 'e1.number.read_write_100':{
   let tens=u(1,9),ones=u(0,9),v=tens*10+ones;
   if(A)return out(v,`十の位が${tens}、一の位が${ones}の数は？`);
   if(B)return out(v,`10のまとまりが${tens}こ、ばらが${ones}こ。この数を数字で書いてください。`);
   return out(v,`10円玉が${tens}まい、1円玉が${ones}まいです。全部で何円？`);
 }
 case 'e1.number.compare_100':{
   let x=u(15,87),y=u(15,87);if(x===y)y++;
   if(A)return out(Math.max(x,y),`${x} と ${y}。大きい数はどちら？ 数字で答えてください。`);
   if(B)return out(Math.min(x,y),`${x} と ${y}。小さい数はどちら？ 数字で答えてください。`);
   return out(Math.max(x,y),`赤い箱には${x}個、青い箱には${y}個あります。多いほうの箱には何個？`);
 }
 case 'e1.number.number_line':{
   let start=u(3,56),step=A?1:B?2:5,advance=u(2,6);
   if(A)return out(start+advance,`数直線を${start}から右へ${advance}目盛り進みます。目盛りは1ずつ。どの数？`);
   if(B)return out(start+step*advance,`${start}から右へ${advance}目盛り。1目盛りは${step}です。どの数？`);
   return out(start+5*advance,`数直線で${start}の次から、5ずつ右に${advance}回進みます。止まる数は？`);
 }
 case 'e1.number.compose_decompose':{
   let part=u(1,9);
   if(A)return out(10-part,`${part} といくつで 10？`);
   if(B)return out(part,`10 ＝ □ ＋ ${10-part}。□ に入る数は？`);
   return out(10-part,`色紙が${part}枚あります。10枚のセットにするには、あと何枚？`);
 }
 case 'e1.number.place_value':{
   let d=u(2,9),one=u(0,9),num=d*10+one;
   if(A)return out(d,`${num} の十の位の数字は？`);
   if(B)return out(one,`${num} の一の位の数字は？`);
   return out(num,`10本ずつ束ねた鉛筆が${d}束と、ばらが${one}本。全部で何本？`);
 }
 case 'e1.number.add_meaning':{
   let x=u(1,7),y=u(1,8),z=x+y;
   if(A)return out(z,`${x}個あるところへ${y}個ふやします。合計はいくつ？`);
   if(B)return out(y,`${x} ＋ □ ＝ ${z}。あと何個ふやす？`);
   return story(z,`花が${x}本咲いています。さらに${y}本咲きました。全部で何本？ 式を入力してください。`,{a:x,b:y},'a+b','本');
 }
 case 'e1.number.subtract_meaning':{
   let start=u(5,15),take=u(1,Math.min(8,start-1));
   if(A)return out(start-take,`${start} こから ${take} こ取ると、残りは？`);
   if(B)return out(take,`${start} − □ ＝ ${start-take}。□ はいくつ？`);
   return story(start-take,`風船が${start}個あります。${take}個飛んでいきました。何個残りますか？ 式を入力してください。`,{a:start,b:take},'a-b','個');
 }
 case 'e1.number.subtract_single':{
   let start=u(4,9),sub=u(1,start-1);
   if(A)return out(start-sub,`${start} − ${sub} ＝ □`);
   if(B)return out(sub,`${start} − □ ＝ ${start-sub}`);
   return story(start-sub,`クッキー${start}枚のうち${sub}枚食べました。残りは何枚？ 式を入力してください。`,{a:start,b:sub},'a-b','枚');
 }
 case 'e1.number.subtract_borrow':{
   let start=u(11,18),sub=u(start-9,9);
   if(A)return out(start-sub,`${start} − ${sub} ＝ □`);
   if(B)return out(sub,`${start} − □ ＝ ${start-sub}`);
   return story(start-sub,`シールが${start}枚あり、友達に${sub}枚あげました。残りは何枚？ 式を入力してください。`,{a:start,b:sub},'a-b','枚');
 }
 case 'e1.number.simple_two_digit':{
   let x=u(12,38),y=u(5,16);if(B&&x-y<0)x+=20;
   if(A)return out(x+y,`${x} ＋ ${y} ＝ □`);
   if(B)return out(x-y,`${x} − ${y} ＝ □`);
   return story(x+y,`折り紙が${x}枚、あとから${y}枚ふえました。全部で何枚？ 式を入力してください。`,{a:x,b:y},'a+b','枚');
 }
 case 'e1.number.story_add_sub':{
   let x=u(8,19),y=u(2,7);
   if(A)return story(x+y,`公園に${x}人いました。${y}人来ました。今は何人？ 式を入力してください。`,{a:x,b:y},'a+b','人');
   if(B)return story(x-y,`鉛筆が${x}本ありました。${y}本使いました。残りは何本？ 式を入力してください。`,{a:x,b:y},'a-b','本');
   return story(x-y,`赤いボールが${x}個、青いボールが${y}個です。赤は青より何個多い？ 式を入力してください。`,{a:x,b:y},'a-b','個');
 }
 case 'e1.number.numbers_to_120':{
   let x=u(90,118);
   if(A)return out(x+1,`${x} の1つ次の数は？`);
   if(B)return out(x-1,`${x} の1つ前の数は？`);
   return out(x+2,`番号が${x}の札から、順番に2つ進みました。札の番号は？`);
 }
 case 'e1.geometry.shape_recognize':{
   let sides=u(3,12),count=u(2,9);
   if(A)return out(sides,`まっすぐな辺が${sides}本ある多角形。角（頂点）は何個ある？`);
   if(B)return out(sides*count,`辺が${sides}本の多角形が${count}個、別々にあります。辺は全部で何本？`);
   return out(sides*count,`紙で辺が${sides}本の形を${count}枚作りました。頂点を全部数えると何個？`);
 }
 case 'e1.geometry.solid_recognize':{
   let count=u(1,18),type=p(['立方体','直方体']);
   if(A)return out(count*6,`${type}が${count}個、別々にあります。平らな面は全部で何枚？（1個につき6枚）`);
   if(B)return out(count*8,`${type}が${count}個あります。頂点は全部で何個？（1個につき8個）`);
   return out(count*12,`積み木の${type}が${count}個あります。辺（ふち）をすべて数えると何本？（1個につき12本）`);
 }
 case 'e1.geometry.compose_shapes':{
   let count=u(2,18),rows=u(2,10),cols=u(2,10);
   if(A)return out(count*2,`正方形${count}枚を、それぞれ対角線で2つに切りました。三角形は何個？`);
   if(B)return out(rows*cols,`縦${rows}個、横${cols}個の小さな正方形を並べました。小さな正方形は何個？`);
   return out(count*2,`長方形のカード${count}枚を、それぞれ対角線で切りました。三角形のカードは合計何枚？`);
 }
 case 'e1.geometry.position_directions':{
   let size=u(6,12),rank=u(2,size-1);
   if(A)return out(size-rank+1,`横一列に${size}人います。左から${rank}番目は、右から何番目？`);
   if(B)return out(rank+2,`マス目で左から${rank}列目にいる人が、右へ2列進みました。左から何列目？`);
   return out(size-rank+1,`${size}冊の本が横に並んでいます。左から${rank}冊目の本は、右から何冊目？`);
 }
 case 'e1.measure.compare_length':{
   let x=u(5,18),y=u(1,7);
   if(A)return out(x+y,`リボンAは${x}cm、リボンBは${x+y}cmです。長い方は何cm？`);
   if(B)return out(y,`${x}cmと${x+y}cmの棒があります。長さの違いは何cm？`);
   return out(x+y,`長さ${x}cmの棒より${y}cm長い棒があります。長い棒は何cm？`);
 }
 case 'e1.measure.compare_area_capacity':{
   let x=u(2,7),y=u(1,4);
   if(A)return out(x+y,`コップAに${x}杯分、コップBに${x+y}杯分の水。多い方は何杯分？`);
   if(B)return out(y,`同じコップで量った水が${x+y}杯と${x}杯。違いは何杯分？`);
   return out(x+y,`四角い紙Aは${x}枚の小さなマス、BはAより${y}マス分広いです。Bの広さは何マス分？`);
 }
 case 'e1.measure.read_clock':{
   let hour=u(1,11),minute=u(0,11)*5;
   if(A)return out(minute,`時計の長い針が${minute===0?12:minute/5}を指しています。何分？`);
   if(B)return out(hour,`短い針が${hour}と${hour+1}の間、長い針が${p([1,2,3,4,5,6,7,8,9,10,11])}を指しています。何時台？（数字のみ）`);
   return out(hour*100+minute,`デジタル時計は${hour}時${String(minute).padStart(2,'0')}分です。「3時05分→305」のように数字で表してね。`);
 }
 case 'e1.data.picture_count':{
   let apples=u(3,9),pears=u(2,7);
   if(A)return out(apples,`絵の表：りんご ${'● '.repeat(apples).trim()}／なし ${'▲ '.repeat(pears).trim()}。りんごの印はいくつ？`);
   if(B)return out(apples+pears,`絵の表：●が${apples}こ、▲が${pears}こ。印は全部で何個？`);
   return out(Math.abs(apples-pears),`絵の表の●は${apples}個、▲は${pears}個。印の数の違いはいくつ？`);
 }
 // ---- Grade 2: multi-digit, geometry, units, tabulation ----
 case 'e2.number.numbers_to_10000':{
   let thousands=u(1,9),hundreds=u(0,9),tens=u(0,9),ones=u(0,9),v=thousands*1000+hundreds*100+tens*10+ones;
   if(A)return out(thousands,`${v} の千の位の数字は？`);
   if(B)return out(hundreds,`${v} の百の位の数字は？`);
   return out(v,`千が${thousands}、百が${hundreds}、十が${tens}、一が${ones}あります。できる数は？`);
 }
 case 'e2.number.subtract_column':{
   let x=u(42,98),y=u(13,39);if(y>x)y=Math.floor(x/2);
   if(A)return out(x-y,`${x} − ${y} ＝ □`);
   if(B)return out(y,`${x} − □ ＝ ${x-y}。□ は？`);
   return story(x-y,`ノートが${x}冊あり、${y}冊配りました。残りは何冊？ 式を入力してください。`,{a:x,b:y},'a-b','冊');
 }
 case 'e2.number.add_sub_3digit_simple':{
   let x=u(140,680),y=u(30,109);
   if(A)return out(x+y,`${x} ＋ ${y} ＝ □`);
   if(B)return out(x-y,`${x} − ${y} ＝ □`);
   return story(x+y,`図書室に本が${x}冊あり、${y}冊ふえました。全部で何冊？ 式を入力してください。`,{a:x,b:y},'a+b','冊');
 }
 case 'e2.number.add_sub_inverse':{
   let x=u(20,75),y=u(10,24),sum=x+y;
   if(A)return out(y,`${x} ＋ □ ＝ ${sum}。□ は？`);
   if(B)return out(x,`${sum} − ${y} ＝ □`);
   return story(y,`みかんが全部で${sum}個あります。はじめに${x}個ありました。あとから何個ふえた？ 式を入力してください。`,{a:sum,b:x},'a-b','個');
 }
 case 'e2.number.mul_word_problems':{
   let x=u(2,9),y=u(2,8),z=x*y;
   if(A)return story(z,`1皿に${x}個ずつのお団子が${y}皿あります。全部で何個？ 式を入力してください。`,{a:x,b:y},'a*b','個');
   if(B)return story(z,`1列に${x}人ずつ、${y}列並んでいます。全部で何人？ 式を入力してください。`,{a:x,b:y},'a*b','人');
   return story(z,`1袋に${x}個のアメが入っています。${y}袋買うと何個？ 式を入力してください。`,{a:x,b:y},'a*b','個');
 }
 case 'e2.number.commutative_property':{
   let x=u(2,9),y=u(3,8);
   if(A)return out(x,`${x} × ${y} と ${y} × □ は同じ答えです。□ は？`);
   if(B)return out(x,`${x} ＋ ${y} ＝ ${y} ＋ □。□ は？`);
   return out(x*y,`花を1列${x}本で${y}列並べても、1列${y}本で${x}列並べても、全部の本数は同じです。何本？`);
 }
 case 'e2.number.associative_add':{
   let x=u(12,29),y=u(11,24),z=u(11,24);
   if(A)return out(x+y+z,`(${x} ＋ ${y}) ＋ ${z} ＝ □`);
   if(B)return out(x+y+z,`${x} ＋ (${y} ＋ ${z}) ＝ □`);
   return out(x+y+z,`3つの箱に${x}枚、${y}枚、${z}枚ずつカードがあります。まとめて数えると何枚？`);
 }
 case 'e2.geometry.triangles_quads':{
   let count=u(2,17),more=u(2,9);
   if(A)return out(count*3,`三角形が${count}個、別々にあります。辺は全部で何本？`);
   if(B)return out(count*4,`四角形が${count}個、別々にあります。角（頂点）は全部で何個？`);
   return out(count*3+more*4,`三角形${count}枚と四角形${more}枚があります。それぞれの辺を全部数えると何本？`);
 }
 case 'e2.geometry.square_rectangle':{
   let count=u(2,18),x=u(3,16),y=u(3,16);if(x===y)y++;
   if(A)return out(count*4,`正方形が${count}枚あります。等しい長さの辺は全部で何本？`);
   if(B)return out(count*4,`長方形が${count}枚あります。直角は全部で何個？`);
   return out(x*2+y*2,`縦${x}cm、横${y}cmの長方形の周りの長さは何cm？`);
 }
 case 'e2.geometry.right_triangle':{
   let count=u(2,18);
   if(A)return out(count,`直角三角形が${count}個あります。直角は全部で何個？`);
   if(B)return out(count*2,`長方形${count}枚を、1枚ずつ対角線で切りました。直角三角形は何個？`);
   return out(count*2,`ノートの長方形のページを${count}枚、それぞれ対角線で2つに切りました。直角三角形は全部で何個？`);
 }
 case 'e2.geometry.box_shape':{
   let count=u(1,24),shape=p(['直方体','立方体']);
   if(A)return out(count*6,`${shape}の箱${count}個には、面が全部で何枚ある？（1箱につき6面）`);
   if(B)return out(count*8,`${shape}の箱${count}個には、頂点が全部で何個ある？（1箱につき8個）`);
   return out(count*12,`${shape}の箱${count}個の辺を数えます。全部で何本？（1箱につき12本）`);
 }
 case 'e2.measure.standard_length':{
   let cm=u(2,9),mm=u(1,9);
   if(A)return out(cm*10,`${cm} cm は何 mm？`);
   if(B)return out(cm*10+mm,`${cm} cm ${mm} mm は、全部で何 mm？`);
   return out(cm*100,`長さ${cm}mのひもがあります。何cm？`);
 }
 case 'e2.measure.capacity_units':{
   let liters=u(1,6),dl=u(1,9),ml=u(1,9);
   if(A)return out(liters*10,`${liters}L は何dL？`);
   if(B)return out(dl*100,`${dl}dL は何mL？`);
   return out(liters*1000+dl*100,`水が${liters}Lと${dl}dLあります。合わせて何mL？`);
 }
 case 'e2.measure.minutes_hours':{
   let hours=u(1,12),mins=u(5,50);
   if(A)return out(hours*60,`${hours}時間は何分？`);
   if(B)return out(hours*60+mins,`${hours}時間${mins}分は何分？`);
   return out(50+mins,`午前10時10分から11時${mins}分まで作業しました。何分間作業しましたか？`);
 }
 case 'e2.data.simple_tables':{
   let x=u(4,19),y=u(3,14),z=u(1,11);
   if(A)return out(x,`表：赤 ${x}個／青 ${y}個／黄 ${z}個。赤は何個？`);
   if(B)return out(x+y,`表：赤 ${x}個／青 ${y}個／黄 ${z}個。赤と青で何個？`);
   return out(x+y+z,`集めた貝が赤${x}個、青${y}個、黄${z}個でした。合計何個？`);
 }
 case 'e2.data.simple_graphs':{
   let red=u(3,11),blue=u(3,11);if(red===blue)blue++;
   if(A)return out(red,`棒グラフの値：赤${red}・青${blue}。赤の棒の高さはいくつ？`);
   if(B)return out(Math.abs(red-blue),`棒グラフ：赤${red}・青${blue}。棒の高さの差はいくつ？`);
   return out(Math.max(red,blue),`好きな果物の人数を棒グラフにしました。りんご${red}人、みかん${blue}人。人気の高い方は何人？`);
 }
 // ---- Grade 3: place value, decimals, remainders, units, charts ----
 case 'e3.number.large_numbers_100m':{
   let tenmillions=u(1,8),millions=u(1,9),x=tenmillions*10000000+millions*1000000+u(1000,999999);
   if(A)return out(tenmillions,`${x.toLocaleString('ja-JP')} の千万の位の数字は？`);
   if(B)return out(Math.floor(x/1000000)%10,`${x.toLocaleString('ja-JP')} の百万の位の数字は？`);
   return out(x+1000000,`人口を表す数 ${x.toLocaleString('ja-JP')} に 100万を足すと、どんな数？（数字で答えてください）`);
 }
 case 'e3.number.multi_digit_add':{
   let x=u(1204,6789),y=u(1023,2799);
   if(A)return out(x+y,`${x} ＋ ${y} ＝ □`);
   if(B)return out(y,`${x} ＋ □ ＝ ${x+y}。□ は？`);
   return story(x+y,`学校に本が${x}冊あり、${y}冊追加されました。全部で何冊？ 式を入力してください。`,{a:x,b:y},'a+b','冊');
 }
 case 'e3.number.multi_digit_subtract':{
   let x=u(5000,9000),y=u(1300,3000);
   if(A)return out(x-y,`${x} − ${y} ＝ □`);
   if(B)return out(y,`${x} − □ ＝ ${x-y}。□ は？`);
   return story(x-y,`紙が${x}枚あり、${y}枚配りました。残りは何枚？ 式を入力してください。`,{a:x,b:y},'a-b','枚');
 }
 case 'e3.number.multiply_3by1':{
   let x=u(112,458),y=u(2,8);
   if(A)return out(x*y,`${x} × ${y} ＝ □`);
   if(B)return out((x+10)*y,`(${x} ＋ 10) × ${y} ＝ □`);
   return story(x*y,`1箱に${x}個入りの部品が${y}箱あります。全部で何個？ 式を入力してください。`,{a:x,b:y},'a*b','個');
 }
 case 'e3.number.multiplication_properties':{
   let x=u(11,36),y=u(2,7),z=u(2,7);
   if(A)return out(x*(y+z),`${x} × (${y} ＋ ${z}) ＝ □`);
   if(B)return out(x*y+x*z,`${x} × ${y} ＋ ${x} × ${z} ＝ □`);
   return out(x*(y+z),`1組${x}人のグループが${y}組と、さらに${z}組あります。全員で何人？`);
 }
 case 'e3.number.remainder':{
   let y=u(3,9),x=u(3,8),rem=u(1,y-1),total=x*y+rem;
   if(A)return out(rem,`${total} ÷ ${y} の余りはいくつ？`);
   if(B)return out(x,`${total} ÷ ${y} の商（整数の部分）はいくつ？`);
   return out(rem,`お菓子${total}個を1人${y}個ずつ配ります。配り終えて残るお菓子は何個？`);
 }
 case 'e3.number.decimal_tenths':{
   let whole=u(1,12),tenth=u(1,9),v=whole+tenth/10;
   if(A)return out(tenth,`${fmt(v)} の小数第1位の数字は？`);
   if(B)return out(v,`${whole} と 0.${tenth} を合わせると？`);
   return out(v,`長さ${whole}mの帯と、${tenth}dmの帯があります。合わせて何m？（1dm＝0.1m）`);
 }
 case 'e3.number.decimal_add_sub':{
   let x=u(11,37)/10,y=u(2,9)/10;
   if(A)return out(x+y,`${fmt(x)} ＋ ${fmt(y)} ＝ □`);
   if(B)return out(x-y,`${fmt(x)} − ${fmt(y)} ＝ □`);
   return out(x+y,`リボンが${fmt(x)}mあり、${fmt(y)}mつなぎました。合計何m？`);
 }
 case 'e3.number.unknown_box_equation':{
   let x=u(12,41),y=u(3,17);
   if(A)return out(y,`${x} ＋ □ ＝ ${x+y}。□ は？`);
   if(B)return out(x,`□ − ${y} ＝ ${x-y}。□ は？`);
   return out(y,`何個かあったビー玉に${x}個加えたら${x+y}個になりました。もとは何個？`);
 }
 case 'e3.geometry.circles':{
   let radius=u(2,15);
   if(A)return out(radius*2,`半径が${radius}cmの円。直径は何cm？`);
   if(B)return out(radius,`直径${radius*2}cmの円。半径は何cm？`);
   return out(radius*2,`丸いシールの中心から端まで${radius}mmです。中心を通る端から端の長さ（直径）は何mm？`);
 }
 case 'e3.geometry.angles_compare':{
   let a=u(20,65),b=u(70,120);
   if(A)return out(b,`角Aは${a}度、角Bは${b}度。大きい角は何度？`);
   if(B)return out(b-a,`${a}度と${b}度の角では、大きさは何度違う？`);
   return out(b-a,`折り紙の角を${a}度から${b}度に広げました。何度広がった？`);
 }
 case 'e3.measure.km':{
   let km=u(1,9),m=u(1,9)*100;
   if(A)return out(km*1000,`${km}km は何m？`);
   if(B)return out(km*1000+m,`${km}km ${m}m は何m？`);
   return out(km*1000+m,`公園まで${km}km、さらに${m}m歩きました。合計何m？`);
 }
 case 'e3.measure.mass':{
   let kg=u(1,8),g=u(1,9)*100;
   if(A)return out(kg*1000,`${kg}kg は何g？`);
   if(B)return out(kg*1000+g,`${kg}kg ${g}g は何g？`);
   return out(kg*1000+g,`お米が${kg}kgと${g}gあります。全部で何g？`);
 }
 case 'e3.measure.seconds':{
   let minute=u(1,8),seconds=u(3,50);
   if(A)return out(minute*60,`${minute}分は何秒？`);
   if(B)return out(minute*60+seconds,`${minute}分${seconds}秒は何秒？`);
   return out(minute*60+seconds,`動画の長さは${minute}分${seconds}秒です。合計何秒？`);
 }
 case 'e3.measure.elapsed_time':{
   let start=u(8,14),minutes=u(10,45);
   if(A)return out(minutes,`午前${start}時00分から、同じ日の${start}時${minutes}分まで。何分？`);
   if(B)return out(60-minutes,`${start}時${minutes}分から${start+1}時00分まで。何分？`);
   return out(60+minutes,`${start}時00分から${start+1}時${minutes}分まで遊びました。合計何分？`);
 }
 case 'e3.data.bar_graph':{
   let a=u(15,35),b=u(6,14);
   if(A)return out(a,`棒グラフの値：4月 ${a}冊、5月 ${b}冊。4月は何冊？`);
   if(B)return out(a-b,`棒グラフ：4月 ${a}冊、5月 ${b}冊。4月は何冊多い？`);
   return out(a+b,`月ごとの読書記録を棒グラフにしました。4月${a}冊、5月${b}冊。合計何冊？`);
 }
 case 'e3.number.fraction_same_denominator_simple':{
   let d=p([5,6,7,8,9,10]),x=u(1,d-2),y=u(1,d-x-1);
   if(A)return out((x+y)/d,`${x}/${d} ＋ ${y}/${d} ＝ □`,{displayAnswer:frac(x+y,d)});
   if(B)return out(x/d,`${x+y}/${d} − ${y}/${d} ＝ □`,{displayAnswer:frac(x,d)});
   return out((x+y)/d,`リボンを全体の${x}/${d}と${y}/${d}使いました。合わせて全体の何分のいくつ？`,{displayAnswer:frac(x+y,d)});
 }
 // ---- Grade 4: rounding, formulas, decimal place value, area and angles ----
 case 'e4.number.rounding':{
   let x=u(105,989),mode=A?10:100;
   if(A)return out(Math.round(x/10)*10,`${x} を十の位までの概数に四捨五入すると？`);
   if(B)return out(Math.round(x/100)*100,`${x} を百の位までの概数に四捨五入すると？`);
   return out(Math.round(x/100)*100,`参加者${x}人を百の位までの概数で表すと約何人？`);
 }
 case 'e4.number.estimation':{
   let x=u(105,175),y=u(215,285);const nearest=v=>Math.round(v/10)*10;
   if(A)return out(nearest(x)+nearest(y),`${x}と${y}をそれぞれ十の位まで四捨五入してから足した概算は？`);
   if(B)return out(nearest(x)*2,`${x}を十の位まで四捨五入し、2倍した概算は？`);
   return out(nearest(x)+nearest(y),`本が${x}冊と${y}冊あります。両方を十の位まで四捨五入して合計した概算は約何冊？`);
 }
 case 'e4.number.mixed_operations':{
   let x=u(12,29),y=u(3,8),z=u(2,7);
   if(A)return out(x+y*z,`${x} ＋ ${y} × ${z} ＝ □`);
   if(B)return out((x+y)*z,`(${x} ＋ ${y}) × ${z} ＝ □`);
   return out((x+y)*z,`1組に男子${x}人と女子${y}人。そんな組が${z}組あります。全員で何人？`);
 }
 case 'e4.number.decimal_place_value':{
   let x=u(1,9),y=u(1,9),z=u(1,9),v=x+y/10+z/100;
   if(A)return out(z,`${fmt(v)} の小数第2位の数字は？`);
   if(B)return out(v,`${x} ＋ ${y}/10 ＋ ${z}/100 ＝ □`);
   return out(v,`長さを1mと${y}dmと${z}cm足すと何m？（1dm=0.1m、1cm=0.01m）`);
 }
 case 'e4.number.decimal_add_sub':{
   let x=u(230,780)/100,y=u(15,180)/100;
   if(A)return out(x+y,`${fmt(x)} ＋ ${fmt(y)} ＝ □`);
   if(B)return out(x-y,`${fmt(x)} − ${fmt(y)} ＝ □`);
   return out(x+y,`テープが${fmt(x)}mと${fmt(y)}mあります。つなぐと何m？`);
 }
 case 'e4.number.decimal_times_integer':{
   let x=u(13,87)/10,y=u(2,9);
   if(A)return out(x*y,`${fmt(x)} × ${y} ＝ □`);
   if(B)return out((x+.2)*y,`(${fmt(x)} ＋ 0.2) × ${y} ＝ □`);
   return out(x*y,`1本${fmt(x)}mのリボンが${y}本あります。全部で何m？`);
 }
 case 'e4.geometry.rectangle_area':{
   let x=u(3,18),y=u(3,12);
   if(A)return out(x*y,`縦${x}cm、横${y}cmの長方形の面積は何cm²？`);
   if(B)return out(x*x,`一辺${x}cmの正方形の面積は何cm²？`);
   return out(x*y,`縦${x}m、横${y}mの長方形の畑があります。広さは何m²？`);
 }
 case 'e4.geometry.angle_degrees':{
   let x=u(2,12),y=u(25,70),z=u(15,60);
   if(A)return out(x*90,`直角が${x}個分集まると、合わせて何度？（1個は90度）`);
   if(B)return out(180-y,`一直線の角（180度）から${y}度を取り去ると、残りは何度？`);
   return out(y+z,`角を${y}度開き、さらに${z}度開きました。合計何度？`);
 }
 case 'e4.geometry.area_unit':{
   let x=u(2,40),y=u(2,20);
   if(A)return out(x*10000,`${x}m² は何cm²？（1m²＝10000cm²）`);
   if(B)return out(y*100,`${y}cm² は何mm²？（1cm²＝100mm²）`);
   return out(x*y,`縦${x}cm・横${y}cmの長方形の面積は何cm²？`);
 }
 case 'e4.number.fraction_over_one':{
   let d=p([2,3,4,5,6,8]),whole=u(1,3),rem=u(1,d-1),num=whole*d+rem;
   if(A)return out(num,`帯分数 ${whole}と${rem}/${d} を仮分数 □/${d} に直すと、分子 □ はいくつ？`);
   if(B)return out(num,`${whole} と ${rem}/${d} を仮分数 □/${d} にします。□ は？`);
   return out(num/d,`ピザ${whole}枚と、もう1枚の${rem}/${d}を食べました。合わせて何枚分？ 分数で答えてください。`,{displayAnswer:frac(num,d)});
 }
 }
 throw Error('No manually designed question template for '+id);
}
return {makeQuestion};
});
