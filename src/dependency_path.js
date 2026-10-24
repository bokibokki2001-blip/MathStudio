/* MathStudio v0.1.7: proposed-curriculum transitive prerequisite journey.
   This module displays learning routes; MathEngine remains the sole authority
   on actual assessment, test availability, and mastery. */
(function(root,factory){const v=factory();if(typeof module==='object'&&module.exports)module.exports=v;else root.MathJourney=v;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const met=status=>status==='master'||status==='licensed'||status==='pending';
function analyze(targetId,{catalog,statusOf,playableIds}={}){
 if(!catalog||!catalog.byId||!catalog.byId[targetId])throw Error('Unknown skill: '+targetId);
 if(typeof statusOf!=='function')throw Error('statusOf is required');
 const active=new Set(),finished=new Set(),ancestors=new Set(),order=[];
 function walk(id){
  if(active.has(id))throw Error('Curriculum has a prerequisite cycle at '+id);
  if(finished.has(id))return;
  const s=catalog.byId[id];if(!s)throw Error('Unknown prerequisite: '+id);
  active.add(id);
  for(const p of s.prereq){walk(p);ancestors.add(p);}
  active.delete(id);finished.add(id);order.push(id);
 }
 walk(targetId);ancestors.delete(targetId);
 const all=new Set([...ancestors,targetId]);
 const edges=[];const depth=new Map();
 for(const id of order){
  const s=catalog.byId[id];let d=0;
  for(const p of s.prereq){if(all.has(p)){edges.push({from:p,to:id});d=Math.max(d,(depth.get(p)||0)+1);}}
  depth.set(id,d);
 }
 const status=id=>statusOf(id);
 const completed=order.filter(id=>id!==targetId&&met(status(id)));
 const remaining=order.filter(id=>id!==targetId&&!met(status(id)));
 const firstSteps=remaining.filter(id=>catalog.byId[id].prereq.every(p=>met(status(p))));
 const immediateMissing=catalog.byId[targetId].prereq.filter(id=>!met(status(id)));
 const readyActual=firstSteps.filter(id=>playableIds ? playableIds.has(id) : status(id)!=='planned').filter(id=>status(id)!=='locked');
 const availableActual=remaining.filter(id=>playableIds?.has(id)&&status(id)!=='locked');
 const blockedPlanned=remaining.filter(id=>status(id)==='planned');
 const layers=[];
 for(const id of order.filter(x=>x!==targetId)){
  const d=depth.get(id);
  if(!layers[d])layers[d]=[];
  layers[d].push(id);
 }
 const canAttemptByCatalog=immediateMissing.length===0;
 return {targetId,ancestors,all,edges,order,depth,layers:layers.filter(Boolean),
  completed,remaining,firstSteps,readyActual,availableActual,blockedPlanned,immediateMissing,canAttemptByCatalog,
  hasUnfinished:remaining.length>0, pathCount:ancestors.size, edgeCount:edges.length};
}
return{analyze,met};
});
