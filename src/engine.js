/* Offline MathStudio v0.1 core, no eval/new Function/network. UMD for Node and file://. */
(function(root,factory){let deps=typeof module==='object'&&module.exports?{skills:require('./skills.js'),grader:require('./expression_grader.js'),expanded:require('./extended_questions.js')}:{skills:root.MathSkills,grader:root.MathStudioGrader,expanded:root.MathExtendedQuestions};const v=factory(deps);if(typeof module==='object'&&module.exports)module.exports=v;else root.MathEngine=v;})(typeof globalThis==='object'?globalThis:this,function({skills:catalog,grader,expanded}){
const rand=(a,b,r=Math.random)=>Math.floor(r()*(b-a+1))+a,choose=(a,r=Math.random)=>a[rand(0,a.length-1,r)];
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),lcm=(a,b)=>a*b/gcd(a,b);
const fstr=(n,d)=>{const g=gcd(n,d);return d/g===1?String(n/g):`${n/g}/${d/g}`;};
const val=(text)=>{if(typeof text!=='string'||text.trim().length>240)return NaN;let ast;try{ast=grader.parse(text.replace(/＝/g,'=').split('=')[0]);}catch{return NaN;}
  const walk=n=>n.kind==='number'?Number(n.value):n.kind==='neg'?-walk(n.a):n.kind==='op'?({'+':(a,b)=>a+b,'-':(a,b)=>a-b,'*':(a,b)=>a*b,'/':(a,b)=>a/b}[n.op])(walk(n.a),walk(n.b)):NaN;
  try{const x=walk(ast);return Number.isFinite(x)?x:NaN;}catch{return NaN;}};
let seq=0;
function makeQuestion(skill,category='basic',r=Math.random){
 const item=typeof skill==='string'?catalog.byId[skill]:skill;
 if(!item)throw Error('Unknown skill: '+skill);
 const k=item.kind;
 if(k==='extended')return expanded.makeQuestion(item,category,r);
 const a=rand(2,9,r),b=rand(2,9,r),c=rand(2,8,r),mode=category;
 let x,y,z,answer,prompt,unit='',formula=null,params=null,allowed_constants=[],hint='数量の関係を確認しよう。';
 // Generated question uses independent source quantities for symbolic word grading wherever possible.
 function finish(answer_,prompt_,extra={}){answer=answer_;prompt=prompt_;Object.assign(extra,{answer,prompt});return extra;}
 let obj={};
 if(['add1','addcarry','add2'].includes(k)){
  if(k==='add1'){x=rand(1,8,r);y=rand(1,9-x,r);}
  if(k==='addcarry'){x=rand(6,9,r);y=rand(11-x,9,r);}
  if(k==='add2'){x=rand(23,68,r);y=rand(13,29,r);if(x===y)y++;}
  z=x+y;
  if(mode==='basic')obj=finish(z,`${x} ＋ ${y} ＝ □`);
  else if(mode==='application')obj=finish(y,`${x} ＋ □ ＝ ${z}。□ はいくつ？`);
  else {obj=finish(z,`赤いシールが${x}枚、青いシールが${y}枚あります。全部で何枚？`,{inputMode:'formula',unit:'枚',params:{a:x,b:y},formula:'a+b'});}
 }else if(['groups','table','mul2simple','mul21','mul22'].includes(k)){
  x=k==='groups'?rand(2,6,r):k==='table'?rand(2,9,r):k==='mul2simple'?rand(11,19,r):k==='mul21'?rand(23,87,r):rand(21,89,r);
  y=k==='mul22'?rand(12,39,r):rand(2,9,r);if(x===y)y=(y===9?2:y+1);
  z=x*y;
  if(mode==='basic')obj=finish(z,`${x} × ${y} ＝ □`);
  else if(mode==='application'){const d=(k==='groups'||k==='table')?2:10;obj=finish(z+x*d,`${x} × (${y} ＋ ${d}) ＝ □`,{allowed_constants:[d]});}
  else obj=finish(z,`1箱に${x}個入ったビー玉が${y}箱あります。全部で何個？`,{inputMode:'formula',params:{a:x,b:y},formula:'a*b',unit:'個'});
 }else if(['divMeaning','div21','longdiv'].includes(k)){
  y=k==='longdiv'?rand(11,19,r):rand(2,9,r);x=k==='divMeaning'?rand(2,9,r):k==='div21'?rand(3,9,r):rand(12,29,r);
  z=x*y;
  if(mode==='basic')obj=finish(x,`${z} ÷ ${y} ＝ □`);
  else if(mode==='application')obj=finish(y,`${z} ÷ □ ＝ ${x}。□ はいくつ？`);
  else obj=finish(x,`${z}個のお菓子を${y}人で同じ数ずつ分けます。1人何個？`,{inputMode:'formula',params:{a:z,b:y},formula:'a/b',unit:'個'});
 }else if(['fracConcept','fracUnit','fracAdd','fracEqual'].includes(k)){
  let d=choose([3,4,5,6,7,8,9,10,12],r),n=rand(1,d-1,r),q=rand(1,d-1,r);
  if(n===q)q=q<d-1?q+1:q-1;
  if(k==='fracConcept'||k==='fracUnit'){
   if(mode==='basic')obj=finish(n/d,`1つを${d}等分したうちの${n}つ分。分数で表すと？`,{displayAnswer:fstr(n,d)});
   else if(mode==='application')obj=finish(n,`${n}/${d} は、1/${d} が何個集まった数？`);
   else obj=finish(n/d,`テープを${d}等分し、そのうち${n}つ分を使いました。全体の何分のいくつ？`,{displayAnswer:fstr(n,d),inputMode:'value',unit:''});
  }else if(k==='fracAdd'){
   if(mode==='basic')obj=finish((n+q)/d,`${n}/${d} ＋ ${q}/${d} ＝ □`,{displayAnswer:fstr(n+q,d)});
   else if(mode==='application')obj=finish(q/d,`${n}/${d} ＋ □ ＝ ${n+q}/${d}。□ は？`,{displayAnswer:fstr(q,d)});
   else obj=finish((n+q)/d,`水を${n}/${d} Lと${q}/${d} L用意しました。合わせて何L？`,{displayAnswer:fstr(n+q,d),inputMode:'value',unit:'L'});
  }else{
   const t=rand(2,4,r);
   if(mode==='basic')obj=finish(n*t,`${n}/${d} ＝ □/${d*t}。□ はいくつ？`);
   else if(mode==='application')obj=finish(d*t,`${n}/${d} ＝ ${n*t}/□。□ はいくつ？`);
   else obj=finish(n/d,`ピザ${n*t}切れを${d*t}等分した全体から食べました。食べた割合を分数で答えてください。`,{displayAnswer:fstr(n,d),inputMode:'value'});
  }
 }else{throw Error('未対応の技能 '+k);}
 const out={id:`q_${Date.now().toString(36)}_${seq++}`,skillId:typeof skill==='string'?skill:skill.id,category,prompt:obj.prompt,answer:obj.answer,displayAnswer:obj.displayAnswer||String(obj.answer),inputMode:obj.inputMode||'value',params:obj.params,formula:obj.formula,allowed_constants:obj.allowed_constants||[],unit:obj.unit||'',hint};
 return out;
}
function scoreAnswer(q,input){const t=String(input||'').trim();if(!t)return{status:'incorrect',detail:'未回答'};
 if(q.inputMode==='formula'){
    if(!grader||!grader.grade)return{status:'needs_review',detail:'数式判定が利用できません'};
    const res=grader.grade({params:q.params,formula:q.formula,allowed_constants:q.allowed_constants},t);
    return res;
 }
 const n=val(t);if(!Number.isFinite(n))return{status:'incorrect',detail:'数値・分数として読み取れません'};
 return Math.abs(n-q.answer)<=1e-9*Math.max(1,Math.abs(q.answer))?{status:'correct',detail:'正解'}:{status:'incorrect',detail:'答えが違います'};
}
// Estimated seconds, only prototype heuristics, NOT measured or empirically calibrated.
function secFor(skill,cat){const g=typeof skill==='string'?catalog.byId[skill].grade:skill.grade;const base={basic:[35,45,55,70],application:[70,85,100,120],word:[110,130,150,180]};return base[cat][Math.min(3,g-1)];}
function buildTest(skill,seed=Math.random){skill=typeof skill==='string'?catalog.byId[skill]:skill;
 const cats=['basic','application','word'];const n={basic:5,application:4,word:4};const budget=25*60,spare=120;
 const time=()=>cats.reduce((t,c)=>t+n[c]*secFor(skill,c),spare);
 let loops=0;while(time()<22*60&&loops++<30){const c=cats[loops%3];if(time()+secFor(skill,c)>30*60)break;n[c]++;}
 let questions=[],seen=new Set();
 for(const cat of cats)for(let i=0;i<n[cat];i++){
  let q,tries=0;do{q=makeQuestion(skill,cat,seed);}while(seen.has(cat+q.prompt)&&++tries<30);
  seen.add(cat+q.prompt);questions.push(q);
 }
 // Shuffle deterministic for injected pseudo-random testing.
 for(let i=questions.length-1;i>0;i--){const j=rand(0,i,seed);[questions[i],questions[j]]=[questions[j],questions[i]];}
 return {mode:'master',skillId:skill.id,questions,targetSeconds:time(),estimatedSeconds:time()-spare,createdAt:Date.now()};
}
function gradeTest(test,answers,elapsedSeconds){const results=test.questions.map((q,i)=>scoreAnswer(q,answers[i]||''));
 const n={basic:0,application:0,word:0},ok={basic:0,application:0,word:0};
 test.questions.forEach((q,i)=>{n[q.category]++;if(results[i].status==='correct')ok[q.category]++;});
 const percent=c=>Math.round(100*ok[c]/Math.max(1,n[c]));
 const base=percent('basic'),app=percent('application'),word=percent('word');
 const timeScore=elapsedSeconds<=0?100:Math.min(100,Math.floor(100*test.targetSeconds/elapsedSeconds));
 const totalCorrect=results.filter(r=>r.status==='correct').length;
 // Speed jewel measures elapsed time only. Accuracy is assessed by the other three jewels.
 // A perfect/master result STILL requires every question correct and elapsed <= target.
 const speed=timeScore;
 const metrics={basic:base,speed,application:app,word};
 const provisional=Object.values(metrics).every(v=>v>=75),perfect=results.every(r=>r.status==='correct')&&elapsedSeconds<=test.targetSeconds;
 return {results,metrics,provisional,perfect,elapsedSeconds,correct:totalCorrect,count:results.length,needsReview:results.some(r=>r.status==='needs_review')};
}
function masteryStatus(id,records,diagnosticAccess=[]){const s=catalog.byId[id];const own=!!records[id]?.selfMaster;const inherited=s.prereq.every(p=>!!records[p]?.master);
 if(own&&inherited)return'master';if(own)return'pending';if(records[id]?.license)return'licensed';
 if(s.prereq.every(p=>!!records[p]?.license||!!records[p]?.master))return'open';
 if(s.prereq.length===0||diagnosticAccess.includes(id))return'open';return'locked';}
function recalc(records){let changed=true,i=0;while(changed&&i++<catalog.skills.length){changed=false;for(const s of catalog.skills){const rec=records[s.id]||(records[s.id]={});const m=!!rec.selfMaster&&s.prereq.every(p=>records[p]?.master);if(!!rec.master!==m){rec.master=m;changed=true;}}}return records;}
function applyResult(records,id,result,elapsed,testMeta){const rec=records[id]||(records[id]={});rec.metrics=result.metrics;rec.attempts=(rec.attempts||0)+1;
 if(result.provisional)rec.license=true;
 if(result.perfect)rec.selfMaster=true;
 rec.lastAttempt=new Date().toISOString();rec.lastScore=result.correct+'/'+result.count;rec.bestPercent=Math.max(rec.bestPercent||0,Math.floor(result.correct/result.count*100));
 rec.history=Array.isArray(rec.history)?rec.history:[];
 rec.history.push({at:rec.lastAttempt,metrics:result.metrics,provisional:result.provisional,perfect:result.perfect,elapsedSeconds:elapsed,correct:result.correct,count:result.count,testId:testMeta||null});
 recalc(records);return rec;
}
// Upgrade records created with the earlier ambiguous-number grading and the
// incorrect speed=min(time,accuracy) rule. No test is re-taken; saved questions,
// answers, and elapsed time are rescored in place. Preserve previously earned
// achievements; a fix can grant a deserved achievement, not take one away.
function repairStoredGrades(state){
 if(!state||!Array.isArray(state.attemptsHistory))return {rescored:0,upgraded:0};
 const latest=new Map();let rescored=0,upgraded=0;
 for(const h of state.attemptsHistory){
  if(!h||!catalog.byId[h.skillId]||!h.test||!Array.isArray(h.test.questions)||!h.test.questions.length||!Array.isArray(h.answers)||!Number.isFinite(h.elapsedSeconds))continue;
  try{
   const r=gradeTest(h.test,h.answers,h.elapsedSeconds);
   const prevPerfect=!!h.perfect,prevProvisional=!!h.provisional;
   Object.assign(h,{results:r.results,metrics:r.metrics,perfect:r.perfect,provisional:r.provisional,correct:r.correct,count:r.count});
   if((!prevPerfect&&r.perfect)||(!prevProvisional&&r.provisional))upgraded++;
   latest.set(h.skillId,h);rescored++;
   const rec=state.records[h.skillId]||(state.records[h.skillId]={});
   if(r.provisional)rec.license=true;
   if(r.perfect){rec.selfMaster=true;rec.license=true;}
   rec.bestPercent=Math.max(rec.bestPercent||0,Math.floor(r.correct/r.count*100));
   if(Array.isArray(rec.history)){
    const prior=rec.history.find(x=>x.testId===h.test.createdAt&&x.at===h.at);
    if(prior)Object.assign(prior,{metrics:r.metrics,provisional:r.provisional,perfect:r.perfect,elapsedSeconds:h.elapsedSeconds,correct:r.correct,count:r.count});
   }
  }catch{ /* skip malformed legacy record without deleting the user's data */ }
 }
 for(const [id,h]of latest){
  const rec=state.records[id];rec.metrics=h.metrics;rec.lastScore=h.correct+'/'+h.count;
 }
 recalc(state.records);
 if(state.lastResult){
  const h=state.attemptsHistory.find(x=>x.skillId===state.lastResult.skillId&&x.at===state.lastResult.at);
  if(h)state.lastResult={...h,recMaster:!!state.records[h.skillId]?.master};
 }
 return {rescored,upgraded};
}
function makeDiagnosis(profile,r=Math.random){const steps=catalog.tracks.map(t=>({track:t.id,index:catalog.startingIndex(t.id,Number(profile.grade),Number(profile.month)),attempts:0,probes:0,done:false,status:'pending',last:null}));return {steps,index:0,question:null,logs:[],startedAt:new Date().toISOString()};}
function currentDiagnosticSkill(d){let step=d.steps[d.index];if(!step)return null;let list=catalog.skills.filter(s=>s.track===step.track);return list[step.index];}
function nextDiagnosticQuestion(d,r=Math.random){let step=d.steps[d.index];if(!step)return null;const skill=currentDiagnosticSkill(d);d.question=makeQuestion(skill,'basic',r);return d.question;}
function diagnoseAnswer(d,input){const step=d.steps[d.index];const q=d.question;const r=scoreAnswer(q,input);d.logs.push({skillId:q.skillId,prompt:q.prompt,answer:input,status:r.status});
 step.probes++;step.attempts+=r.status==='correct'?1:0;
 if(step.probes<3){d.question=null;return {result:r,done:false,advance:false};}
 const list=catalog.skills.filter(s=>s.track===step.track),passed=step.attempts>=2;
 step.last={skillId:list[step.index].id,passed,score:step.attempts};
 // bounded upward/downward exploration, at most 3 sampled levels per track.
 step.levelsChecked=(step.levelsChecked||0)+1;
 if(step.levelsChecked<3 && passed && step.index<list.length-1){step.index++;step.probes=0;step.attempts=0;d.question=null;return {result:r,done:false,advance:true};}
 if(step.levelsChecked<3 && !passed && step.index>0){step.index--;step.probes=0;step.attempts=0;d.question=null;return {result:r,done:false,advance:true};}
 step.done=true;step.status=passed?'passed':'needs_learning';step.recommendSkillId=passed&&step.index<list.length-1?list[step.index+1].id:list[step.index].id;
 d.index++;d.question=null;return {result:r,done:d.index>=d.steps.length,advance:true};
}
return {makeQuestion,scoreAnswer,buildTest,gradeTest,masteryStatus,recalc,applyResult,repairStoredGrades,makeDiagnosis,nextDiagnosticQuestion,diagnoseAnswer,currentDiagnosticSkill,secFor,val,catalog};
});
