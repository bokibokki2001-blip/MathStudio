'use strict';
const assert=require('node:assert/strict');
const C=require('../src/catalog.js'),S=require('../src/skills.js'),E=require('../src/engine.js'),G=require('../src/expression_grader.js');
function rng(seed){return()=>{seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296}}
function calc(n,p){switch(n.kind){case'number':return Number(n.value);case'id':return p[n.value];case'neg':return -calc(n.a,p);case'op':return {'+':(a,b)=>a+b,'-':(a,b)=>a-b,'*':(a,b)=>a*b,'/':(a,b)=>a/b}[n.op](calc(n.a,p),calc(n.b,p));}throw Error(n.kind)}
const old=new Set(S.skills.filter(x=>x.kind==='extended'||x.kind==='advanced').map(x=>x.id));
assert.equal(C.skills.length,285);assert.equal(S.skills.length,285);assert.equal(new Set(S.skills.map(x=>x.id)).size,285);assert.equal(old.size,270);
let count=0,choices=0,formulas=0,issues=[],duplicates=[],timing=[];
for(let j=0;j<S.skills.length;j++){
 const sk=S.skills[j];assert(C.byId[sk.id]);if(sk.kind==='advanced')assert.deepEqual(sk.prereq,C.byId[sk.id].prereq,sk.id);
 for(const p of sk.prereq)assert(S.byId[p],sk.id+'->'+p);
 for(const cat of ['basic','application','word']){
   for(let i=0;i<80;i++){
    try{
     const q=E.makeQuestion(sk,cat,rng(j*100003+cat.length*757+i*47387));
     if(!Number.isFinite(q.answer))throw Error('Nonfinite answer '+JSON.stringify(q));
     if(!q.prompt||q.prompt.length<3)throw Error('Empty prompt');
     if(!['choice','formula','value'].includes(q.inputMode))throw Error('Missing input mode');
     let ans=q.inputMode==='formula'?q.formula:q.inputMode==='choice'?String(q.answer):q.displayAnswer;
     const result=E.scoreAnswer(q,ans);
     if(result.status!=='correct')throw Error('Own solution marked '+result.status+' '+JSON.stringify({q,ans,result}));
     if(E.scoreAnswer(q,'i am wrong').status==='correct')throw Error('Garbage accepted '+q.prompt);
     if(q.inputMode==='choice'){
       choices++;
       if(!q.options||q.options.length<3||q.options.length>6||q.answer<1||q.answer>q.options.length)throw Error('Bad choice '+JSON.stringify(q));
       if(new Set(q.options).size!==q.options.length)throw Error('Duplicate options');
       let other=q.answer===1?'2':'1';if(E.scoreAnswer(q,other).status==='correct')throw Error('Wrong option accepted');
     }
     if(q.inputMode==='formula'){const value=calc(G.parse(q.formula),q.params);if(Math.abs(value-q.answer)>1e-8)throw Error('Incorrect semantic formula '+JSON.stringify(q));formulas++;}
     count++;
    }catch(e){issues.push({skill:sk.id,category:cat,seed:i,error:String(e).slice(0,1200)});if(issues.length>45)break}
   }
 }
 for(let seed=0;seed<3;seed++){
  try{
   const test=E.buildTest(sk,rng(j*197+seed*731));
   const answer=test.questions.map(q=>q.inputMode==='choice'?String(q.answer):q.inputMode==='formula'?q.formula:q.displayAnswer);
   const score=E.gradeTest(test,answer,test.targetSeconds);
   if(!score.perfect||!score.provisional)throw Error('Perfect test not granted: '+JSON.stringify(score));
   if(test.targetSeconds<90||test.targetSeconds>1800)throw Error('time '+test.targetSeconds);
   for(const cat of ['basic','application','word']){
    const arr=test.questions.filter(q=>q.category===cat);if(arr.length<1)throw Error('category lacks mandatory questions');
    if(new Set(arr.map(q=>q.prompt)).size<arr.length)throw Error('duplicate prompts in test '+cat+': '+JSON.stringify(arr.map(q=>q.prompt)));
   }
   const wrong=answer.slice();wrong[0]='wrong';if(E.gradeTest(test,wrong,test.targetSeconds).perfect)throw Error('bad perfect');
   timing.push(test.questions.length);
  }catch(e){duplicates.push({skill:sk.id,seed,error:String(e).slice(0,520)});}
 }
}
console.log(JSON.stringify({skills:S.skills.length,count,choices,formulas,issues:issues.slice(0,35),issueCount:issues.length,duplicateCount:duplicates.length,duplicates:duplicates.slice(0,60),testRuns:timing.length},null,2));
if(issues.length||duplicates.length)process.exitCode=1;
