/* MathStudio v0.1.7: fantasy journey map with ancestor highlighting. */
(function(root,factory){const v=factory();if(typeof module==='object'&&module.exports)module.exports=v;else root.MathTechTree=v;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const C=typeof window!=='undefined'?window.MathCatalog:require('./catalog.js');
const J=typeof window!=='undefined'?window.MathJourney:require('./dependency_path.js');
const COLUMN_W=324,MARGIN=12,NODE_W=242,NODE_H=78,ROW=108,TOP=22,HEADER_H=43,STAGE_PAD=19;
// Domain lanes stay at roughly the same Y coordinate across grades. Grade width
// grows only when its prerequisites have genuine within-grade depth.
const LANE_ORDER=['number','measure','geometry','algebra','functions','calculus','data','probability','discrete','modeling'];
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colors={number:'#597adc',algebra:'#9d64d0',geometry:'#d8884c',functions:'#288d93',data:'#4b958d',measure:'#9279be',probability:'#bc7ba7',calculus:'#bf685f',discrete:'#798c58',modeling:'#8f8180'};
const stageWorlds={E1:'はじまりの森',E2:'計算の丘',E3:'知恵の草原',E4:'学びの湖',E5:'挑戦の山',E6:'未来の塔',J1:'探究の谷',J2:'数式の城',J3:'発見の頂', 'H-I':'数学の書庫','H-A':'論理の庭','H-II':'関数の空','H-B':'探究の星','H-III':'極限の塔','H-C':'冒険の彼方'};
const statusText={master:'MASTER',pending:'認定待ち',licensed:'仮免',open:'学習可能',locked:'未解放',planned:'教材準備中'};
let zoom=1,manualZoom=false,lastPosition=null,observer=null,canvasLayout=null,mode='e1-3';
function makeLayout(skills,tracks=C.strands){
 const present=new Set(skills.map(s=>s.stage));
 const stages=C.stages.filter(s=>present.has(s.id)), visible=new Map(skills.map(s=>[s.id,s]));
 const positions={},links=[], stageGeometry=[],groups=new Map(),depthOf=new Map();
 const catalogIndex=new Map(C.skills.map((s,i)=>[s.id,i]));
 let colIndex=0,xStart=MARGIN;
 // All within-grade prerequisite chains run from left to right rather than
 // looping around a single column. This is a proper topological layering.
 for(const stage of stages){
  const nodes=skills.filter(s=>s.stage===stage.id),memo=new Map(),visiting=new Set();
  function localDepth(s){
   if(memo.has(s.id))return memo.get(s.id);
   if(visiting.has(s.id))throw Error('Cyclic prerequisite graph: '+s.id);
   visiting.add(s.id);
   const v=Math.max(0,...s.prereq.filter(id=>visible.has(id)&&visible.get(id).stage===stage.id).map(id=>localDepth(visible.get(id))+1));
   visiting.delete(s.id);memo.set(s.id,v);return v;
  }
  for(const s of nodes)localDepth(s);
  const nLayers=1+Math.max(...memo.values(),0),stageWidth=nLayers*COLUMN_W+STAGE_PAD*2;
  stageGeometry.push({id:stage.id,title:stage.title,group:stage.group,x:xStart,width:stageWidth,columns:nLayers});
  for(const s of nodes){
   const depth=memo.get(s.id),col=colIndex+depth;
   positions[s.id]={x:xStart+STAGE_PAD+depth*COLUMN_W,y:0,width:NODE_W,height:NODE_H,stage:s.stage,strand:s.strand,row:0,column:col};
   const key=col+':'+s.strand;
   if(!groups.has(key))groups.set(key,[]);
   groups.get(key).push(s);
  }
  xStart+=stageWidth;colIndex+=nLayers;
 }
 const columns=colIndex,laneBase=new Map(),laneSize=new Map();
 let slotCursor=0;
 for(const strand of LANE_ORDER){
  const peak=Math.max(0,...Array.from({length:columns},(_,col)=>(groups.get(col+':'+strand)||[]).length));
  if(!peak)continue;
  // Spare slots let different stages share a path without forcing a dense grid.
  const width=peak+Math.max(1,Math.ceil(peak*.25));
  laneBase.set(strand,slotCursor);laneSize.set(strand,width);
  slotCursor+=width+2;
 }
 const totalSlots=slotCursor;
 const columnGroups=[];
 for(let col=0;col<columns;col++)for(const strand of LANE_ORDER){
  const group=groups.get(col+':'+strand);
  if(group?.length)columnGroups.push({col,strand,nodes:group,base:laneBase.get(strand),width:laneSize.get(strand)});
 }
 const children=new Map(skills.map(s=>[s.id,[]]));
 for(const s of skills)for(const p of s.prereq)if(visible.has(p)){
  children.get(p).push(s.id);
  links.push({from:p,to:s.id,crossTrack:visible.get(p).strand!==s.strand});
 }
 function slotY(slot){return TOP+slot*ROW;}
 // Stable initial order followed by alternating upstream/downstream sweeps.
 // Unlike an independent list per grade, each pass aligns nodes with the
 // prerequisite/successor lanes on BOTH sides of the grade boundary.
 for(const g of columnGroups){
  g.nodes.sort((a,b)=>catalogIndex.get(a.id)-catalogIndex.get(b.id));
  g.nodes.forEach((s,i)=>{
   const slot=g.base+Math.round((i+1)*(g.width+1)/(g.nodes.length+1))-1;
   const pos=positions[s.id];pos.row=slot;pos.y=slotY(slot);
  });
 }
 function desired(s){
  const target=[],current=positions[s.id];
  for(const p of s.prereq){const pred=visible.get(p);if(!pred)continue;
   const weight=pred.strand===s.strand?4:0.65;
   target.push([positions[p].row,weight]);
  }
  for(const c of children.get(s.id)){const ch=visible.get(c);
   const weight=ch.strand===s.strand?3:0.5;
   target.push([positions[c].row,weight]);
  }
  target.push([current.row,1.25]);
  return target.reduce((a,[v,w])=>a+v*w,0)/target.reduce((a,[,w])=>a+w,0);
 }
 function arrange(g){
  const sorted=g.nodes.map(s=>({s,target:desired(s)})).sort((a,b)=>a.target-b.target||catalogIndex.get(a.s.id)-catalogIndex.get(b.s.id));
  const m=sorted.length,n=g.width;
  // Increasing-slot DP gives the minimum total displacement with no overlaps.
  const dp=Array.from({length:m+1},()=>Array(n+1).fill(Infinity)),pick=Array.from({length:m+1},()=>Array(n+1).fill(false));
  for(let j=0;j<=n;j++)dp[0][j]=0;
  for(let i=1;i<=m;i++)for(let j=i;j<=n;j++){
   const slot=g.base+j-1,diff=sorted[i-1].target-slot;
   const use=dp[i-1][j-1]+diff*diff;
   if(use<=dp[i][j-1]){dp[i][j]=use;pick[i][j]=true;}else dp[i][j]=dp[i][j-1];
  }
  let j=n;for(let i=m;i>0;i--){while(!pick[i][j])j--;
   const pos=positions[sorted[i-1].s.id];pos.row=g.base+j-1;pos.y=slotY(pos.row);j--;
  }
 }
 for(let pass=0;pass<12;pass++){
  const ordered=pass%2?columnGroups.slice().reverse():columnGroups;
  for(const g of ordered)arrange(g);
 }
 const height=TOP+totalSlots*ROW+18;
 const width=xStart+8;
 return{width,height,stages,stageGeometry,positions,links,nodeWidth:NODE_W,nodeHeight:NODE_H,headerHeight:HEADER_H,stageWidth:null,totalColumns:columns};
}
// Line-of-sight connections are truly straight. Only links blocked by an
// unrelated card use a two-gutter detour through the nearest empty row gap.
function segmentHitsRect(a,b,r){
 const eps=2.2,x0=r.x+eps,x1=r.x+r.width-eps,y0=r.y+eps,y1=r.y+r.height-eps;
 let t0=0,t1=1;const dx=b[0]-a[0],dy=b[1]-a[1];
 for(const [p,q] of [[-dx,a[0]-x0],[dx,x1-a[0]],[-dy,a[1]-y0],[dy,y1-a[1]]]){
  if(Math.abs(p)<1e-8){if(q<0)return false;continue;}
  const t=q/p;if(p<0){t0=Math.max(t0,t);}else t1=Math.min(t1,t);
  if(t0>t1)return false;
 }
 return true;
}
function routePoints(a,b,edgeNumber=0,obstacles=null){
 const source=[a.x+a.width,a.y+a.height/2],target=[b.x,b.y+b.height/2];
 if(!obstacles||!obstacles.some(r=>r!==a&&r!==b&&segmentHitsRect(source,target,r)))return[source,target];
 const left=source[0]+Math.min(39,(target[0]-source[0])*.34);
 const right=target[0]-Math.min(39,(target[0]-source[0])*.34);
 // Every node is aligned to ROW; between rows there is a continuous corridor.
 const ideal=(source[1]+target[1])/2;
 const channelSlot=Math.max(0,Math.round((ideal-TOP-NODE_H-(ROW-NODE_H)/2)/ROW));
 const y=TOP+channelSlot*ROW+NODE_H+(ROW-NODE_H)/2;
 return[source,[left,source[1]],[left,y],[right,y],[right,target[1]],target];
}
function path(a,b,edgeNumber=0,obstacles=null){return routePoints(a,b,edgeNumber,obstacles).map((v,i)=>`${i?'L':'M'} ${v[0].toFixed(1)} ${v[1].toFixed(1)}`).join(' ');}
function nodeBloom(metrics){
 const petals=[['basic','#2f81fa'],['speed','#f05b6b'],['word','#9144dc'],['application','#29b873']];
 return `<span class="node-bloom" aria-hidden="true">${petals.map(([key,color],i)=>{const v=Math.max(0,Math.min(100,Number(metrics?.[key])||0));return `<i class="bloom-petal bp${i} ${v===100?'full':v===0?'empty':''}" style="--petal:${color};--amount:${v/100}"></i>`;}).join('')}<i class="bloom-heart">✦</i></span>`;
}

function render({skills,tracks=C.strands,statusOf,records={},selectedId,recommendations=[],activeRange='e1-3',routeMode=false}){
 mode=activeRange;
 const l=makeLayout(skills,tracks);canvasLayout=l;
 const journey=selectedId&&C.byId[selectedId]?J.analyze(selectedId,{catalog:C,statusOf}):null;
 const routeNodes=routeMode&&journey?journey.all:new Set();
 const routeEdges=new Set(routeMode&&journey?journey.edges.map(e=>e.from+'>'+e.to):[]);
 const selected=C.byId[selectedId];const related=new Set([selectedId,...(selected?.prereq||[]),...C.skills.filter(s=>s.prereq.includes(selectedId)).map(s=>s.id)]);
 const bands=l.stageGeometry.map((s,i)=>`<div class="era-band ${i%2?'era-even':'era-odd'}" style="left:${s.x}px;width:${s.width}px;height:${l.height}px"></div>`).join('');
 const years=l.stageGeometry.map((s,i)=>`<div class="grade-fixed" style="left:${s.x*zoom}px;width:${s.width*zoom}px"><span>${s.id.startsWith('E')?'🏝 ADVENTURE':s.id.startsWith('J')?'🏰 QUEST':'✨ MASTER QUEST'}</span><strong>${safe(s.title)}</strong><small>${safe(stageWorlds[s.id]||'数学の世界')} · ${skills.filter(sk=>sk.stage===s.id).length}技能</small></div>`).join('');
 const obstacles=Object.values(l.positions);
 const links=l.links.map((e,i)=>{const a=l.positions[e.from],b=l.positions[e.to],highlight=e.from===selectedId||e.to===selectedId,isJourney=routeEdges.has(e.from+'>'+e.to),complete=J.met(statusOf(e.from));return `<path class="tech-link ${e.crossTrack?'cross-lane':''} ${highlight?'highlight':''} ${isJourney?'journey-edge '+(complete?'journey-done':'journey-todo'):''}" data-source="${safe(e.from)}" data-target="${safe(e.to)}" marker-end="url(#${isJourney?'tech-arrow-route':highlight?'tech-arrow-active':'tech-arrow'})" d="${path(a,b,i,obstacles)}"/>`;}).join('');
 const nodes=skills.map(s=>{
  const p=l.positions[s.id],st=statusOf(s.id),isFocus=s.id===selectedId,near=related.has(s.id),onJourney=routeNodes.has(s.id),firstStep=journey?.firstSteps.includes(s.id),track=tracks.find(t=>t.id===s.strand),record=records[s.id],playable=st!=='planned';
  return `<button class="tech-node ${st} ${isFocus?'selected':''} ${near?'related':''} ${onJourney?'journey-node':''} ${firstStep&&routeMode?'journey-start':''}" style="left:${p.x}px;top:${p.y}px;width:${NODE_W}px;height:${NODE_H}px;--track-color:${colors[s.strand]||'#7395ca'}" data-id="${safe(s.id)}" data-act="select" aria-pressed="${isFocus}" aria-haspopup="dialog" aria-label="${safe(C.stageById[s.stage]?.title)}・${safe(s.title)}・${statusText[st]||st}" title="${safe(s.title)}"><div class="tech-node-top"><span class="tech-node-meta">${safe(track?.icon||'◇')} ${safe(track?.title||s.strand)}</span><span class="tech-status ${st}">${st==='master'?'👑 MASTER':st==='planned'?'📜 予定':statusText[st]||safe(st)}</span></div><span class="tech-node-name">${safe(s.title)}</span><span class="tech-node-bottom">${playable?`${nodeBloom(record?.metrics)}<span class="tech-score">${st==='master'?'💫 クリア':st==='locked'?'🔒':st==='open'?'✦ 冒険可能':'💎 宝石を集めよう'}</span>`:'<span class="tech-plan-note">📜 教材準備中</span>'}<span class="tech-reason">${firstStep&&routeMode?'★ スタート地点':`前提${s.prereq.length}件`}</span></span></button>`;
 }).join('');
 const rangeOptions=C.ranges.map(r=>`<option value="${r.id}" ${r.id===activeRange?'selected':''}>${r.label}（${C.visibleSkills(r.id).length}）</option>`).join('');
 const currentEdges=l.links.length,allEdges=C.skills.reduce((n,s)=>n+s.prereq.length,0),implemented=skills.filter(s=>statusOf(s.id)!=='planned').length;
 return `<section class="tech-wrap" aria-label="学年別スキル技術ツリー"><div class="tech-toolbar"><strong class="tech-tooltitle">技能マップ</strong><label class="tech-range-label" for="tech-range">範囲</label><select id="tech-range" class="tech-range-select" aria-label="スキルツリーの表示範囲">${rangeOptions}</select><div class="tech-search"><input id="tech-search" type="search" placeholder="技能を検索" autocomplete="off" aria-label="全技能を検索"><button class="btn secondary small" data-act="map-search">検索</button><div id="tech-search-results" class="tech-search-results" hidden></div></div><div class="tech-controls"><button class="btn route-toggle ${routeMode?'route-on':''}" data-act="map-route" aria-pressed="${routeMode}" title="選択中の技能まで、前の技能も全部たどる">🧭 ${routeMode?'全経路 ON':'全経路'}</button><button class="btn secondary small" data-act="map-focus" title="選択した技能へ移動" aria-label="選択した技能へ移動">◎</button><button class="btn secondary small" data-act="map-zoom-out" aria-label="縮小">−</button><span class="map-zoom-value">${Math.round(zoom*100)}%</span><button class="btn secondary small" data-act="map-zoom-in" aria-label="拡大">＋</button><button class="btn secondary small" data-act="map-fit" title="カードを読みやすい標準倍率に戻す">標準倍率</button></div><details class="tech-legend"><summary>凡例</summary><div class="tech-legend-content"><span><i class="legend-dot master"></i>MASTER</span><span><i class="legend-dot licensed"></i>仮免</span><span><i class="legend-dot locked"></i>未解放</span><span><i class="legend-dot planned"></i>教材準備中</span><span><i class="legend-line"></i>前提線</span><span>🧭 金色の線＝目標までの全経路</span><span>✨ 緑の線＝条件達成済み</span></div></details></div><div class="tech-map-viewport" id="tech-map-viewport"><div class="map-help-badge" aria-hidden="true">🧭 技能を押すと、最初まで戻る道がわかるよ！</div><div class="tech-grade-overlay" aria-hidden="true"><div class="tech-grade-strip" style="width:${l.width*zoom}px;height:${HEADER_H}px">${years}</div></div><div class="tech-map-scroll" id="tech-map-scroll" tabindex="0" aria-label="技能ツリー。学年見出しを固定し、横方向・縦方向にスクロール可能"><div class="tech-canvas" style="width:${l.width}px;height:${l.height}px;zoom:${zoom}">${bands}<svg class="tech-edges" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${l.width} ${l.height}" aria-hidden="true" preserveAspectRatio="none"><defs><marker id="tech-arrow" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L5 2.5 L0 5 Z" fill="#95a7bf"/></marker><marker id="tech-arrow-route" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L7 3.5 L0 7 Z" fill="#e89a1a"/></marker><marker id="tech-arrow-active" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L7 3.5 L0 7 Z" fill="#d18426"/></marker></defs>${links}</svg>${nodes}</div></div></div></section>`;
}
function scrollEl(){return typeof document!=='undefined'?document.getElementById('tech-map-scroll'):null;}
function memorize(){const el=scrollEl();if(el)lastPosition={left:el.scrollLeft,top:el.scrollTop,mode};}
function syncGrades(){const el=scrollEl(),strip=document.querySelector('.tech-grade-strip');if(el&&strip)strip.style.transform=`translate3d(${-el.scrollLeft}px,0,0)`;}
function setZoom(v){zoom=v;const canvas=document.querySelector('.tech-canvas'),strip=document.querySelector('.tech-grade-strip');if(canvas)canvas.style.zoom=zoom;if(strip&&canvasLayout){strip.style.width=`${canvasLayout.width*zoom}px`;strip.querySelectorAll('.grade-fixed').forEach((e,i)=>{e.style.left=`${canvasLayout.stageGeometry[i].x*zoom}px`;e.style.width=`${canvasLayout.stageGeometry[i].width*zoom}px`;});}const span=document.querySelector('.map-zoom-value');if(span)span.textContent=`${Math.round(zoom*100)}%`;syncGrades();}
function fit({resetPosition=true}={}){
 const el=scrollEl();if(!el||!canvasLayout)return;
 // Do not shrink all 285 nodes to fit the full height or width: this is a scrollable map.
 const stageCount=canvasLayout.stages.length;
 const best=stageCount<=3?Math.max(.86,Math.min(1.4,Math.floor(((el.clientWidth-16)/canvasLayout.width)*100)/100)):(el.clientWidth<700?.88:1);
 const previous={left:el.scrollLeft,top:el.scrollTop};setZoom(best);
 if(resetPosition){el.scrollLeft=0;el.scrollTop=0;}else{el.scrollLeft=previous.left;el.scrollTop=previous.top;}
 syncGrades();
}
function previewEdges(id){
 const journey=id?J.analyze(id,{catalog:C,statusOf:()=> 'open'}):null;
 const edgeSet=new Set(journey?journey.edges.map(e=>e.from+'>'+e.to):[]);
 document.querySelectorAll('.tech-link').forEach(link=>link.classList.toggle('hover',!!id&&edgeSet.has(link.dataset.source+'>'+link.dataset.target)));
}
function restore(selectedId){const el=scrollEl();if(!el)return;if(observer)observer.disconnect();el.addEventListener('scroll',syncGrades,{passive:true});
 el.addEventListener('pointerover',event=>{const button=event.target.closest?.('.tech-node');if(button)previewEdges(button.dataset.id);});
 el.addEventListener('pointerout',event=>{const button=event.target.closest?.('.tech-node');if(button&&!button.contains(event.relatedTarget))previewEdges(null);});if(!manualZoom)fit();if(lastPosition&&lastPosition.mode===mode){el.scrollLeft=lastPosition.left;el.scrollTop=lastPosition.top;}else if(selectedId&&selectedId!==C.visibleSkills(mode)[0]?.id)focus(selectedId);syncGrades();if(typeof ResizeObserver!=='undefined'){observer=new ResizeObserver(()=>{if(!manualZoom)fit({resetPosition:false});else syncGrades();});observer.observe(document.getElementById('tech-map-viewport'));}}
function focus(id){const el=scrollEl(),node=[...document.querySelectorAll('.tech-node')].find(n=>n.dataset.id===id);if(!el||!node)return;el.scrollLeft=Math.max(0,node.offsetLeft*zoom-el.clientWidth*.32);el.scrollTop=Math.max(0,node.offsetTop*zoom-el.clientHeight*.32);memorize();syncGrades();}
function adjustZoom(delta,selectedId){memorize();manualZoom=true;setZoom(Math.round(Math.min(1.5,Math.max(.72,zoom+delta))*100)/100);focus(selectedId);}
function resetFit(){manualZoom=false;lastPosition=null;fit();}
function resetRange(){manualZoom=false;lastPosition=null;}
return{makeLayout,routePoints,render,memorize,restore,focus,adjustZoom,resetFit,resetRange,syncGrades};
});
