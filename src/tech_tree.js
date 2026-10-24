/* MathStudio v0.1.4: complete curriculum technology tree; 15 playable skills, 270 planned. */
(function(root,factory){const v=factory();if(typeof module==='object'&&module.exports)module.exports=v;else root.MathTechTree=v;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const C=typeof window!=='undefined'?window.MathCatalog:require('./catalog.js');
const STAGE_W=486,MARGIN=12,NODE_W=148,NODE_H=61,COLS=3,ROW=69,TOP=16,HEADER_H=57;
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colors={number:'#597adc',algebra:'#9d64d0',geometry:'#d8884c',functions:'#288d93',data:'#4b958d',measure:'#9279be',probability:'#bc7ba7',calculus:'#bf685f',discrete:'#798c58',modeling:'#8f8180'};
const statusText={master:'MASTER',pending:'認定待ち',licensed:'仮免',open:'学習可能',locked:'未解放',planned:'教材準備中'};
let zoom=1,manualZoom=false,lastPosition=null,observer=null,canvasLayout=null,mode='e1-3';
function makeLayout(skills,tracks=C.strands){
 const present=new Set(skills.map(s=>s.stage));const stages=C.stages.filter(s=>present.has(s.id));
 const positions={},links=[];let maxRows=0;
 const strandIndex=new Map(tracks.map((x,i)=>[x.id,i]));
 for(let si=0;si<stages.length;si++){
  const stage=stages[si];
  const group=skills.filter(s=>s.stage===stage.id).sort((a,b)=>(strandIndex.get(a.strand)??99)-(strandIndex.get(b.strand)??99)||a.title.localeCompare(b.title,'ja'));
  maxRows=Math.max(maxRows,Math.ceil(group.length/COLS));
  group.forEach((s,i)=>{const col=i%COLS,row=Math.floor(i/COLS);positions[s.id]={x:MARGIN+si*STAGE_W+12+col*155,y:TOP+row*ROW,width:NODE_W,height:NODE_H,stage:s.stage,strand:s.strand,row};});
 }
 for(const s of skills)for(const p of s.prereq)if(positions[p]&&positions[s.id])links.push({from:p,to:s.id,crossTrack:positions[p].strand!==positions[s.id].strand});
 return{width:MARGIN+stages.length*STAGE_W+8,height:TOP+maxRows*ROW+8,stages,positions,links,stageWidth:STAGE_W,nodeWidth:NODE_W,nodeHeight:NODE_H,headerHeight:HEADER_H};
}
function gem(m,key,color){let n=Number.isFinite(m?.[key])?m[key]:0;return `<span class="tech-gem ${n>=100?'bright':n===0?'empty':''}" style="--stone:${color}" title="${safe({basic:'基礎力',speed:'速度',application:'応用力',word:'文章題'}[key])} ${n}%"></span>`;}
function path(a,b){
 const right=a.x+a.width, midy=a.y+a.height/2, endY=b.y+b.height/2;
 if(right<b.x-2){const diff=b.x-right,bend=Math.min(95,Math.max(22,diff*.35));return `M ${right} ${midy} C ${right+bend} ${midy},${b.x-bend} ${endY},${b.x} ${endY}`;}
 const x1=right,y1=midy,x2=b.x+b.width,y2=endY;
 const routeX=Math.max(x1,x2)+17+(Math.abs(y2-y1)<ROW?10:0);
 return `M ${x1} ${y1} C ${routeX} ${y1},${routeX} ${y2},${x2} ${y2}`;
}
function render({skills,tracks=C.strands,statusOf,records={},selectedId,recommendations=[],activeRange='e1-3'}){
 mode=activeRange;
 const l=makeLayout(skills,tracks);canvasLayout=l;
 const selected=C.byId[selectedId];const related=new Set([selectedId,...(selected?.prereq||[]),...C.skills.filter(s=>s.prereq.includes(selectedId)).map(s=>s.id)]);
 const bands=l.stages.map((s,i)=>`<div class="era-band ${i%2?'era-even':'era-odd'}" style="left:${MARGIN+i*STAGE_W}px;width:${STAGE_W}px;height:${l.height}px"></div>`).join('');
 const years=l.stages.map((s,i)=>`<div class="grade-fixed" style="left:${(MARGIN+i*STAGE_W)*zoom}px;width:${STAGE_W*zoom}px"><span>${s.id.startsWith('E')?'ELEMENTARY':s.id.startsWith('J')?'JUNIOR HIGH':'HIGH SCHOOL'}</span><strong>${safe(s.title)}</strong><small>${skills.filter(sk=>sk.stage===s.id).length}技能</small></div>`).join('');
 const links=l.links.map(e=>{const a=l.positions[e.from],b=l.positions[e.to],highlight=e.from===selectedId||e.to===selectedId;return `<path class="tech-link ${e.crossTrack?'cross-lane':''} ${highlight?'highlight':''}" data-source="${safe(e.from)}" data-target="${safe(e.to)}" d="${path(a,b)}"/>`;}).join('');
 const nodes=skills.map(s=>{
  const p=l.positions[s.id],st=statusOf(s.id),isFocus=s.id===selectedId,near=related.has(s.id),track=tracks.find(t=>t.id===s.strand),record=records[s.id],playable=st!=='planned';
  return `<button class="tech-node ${st} ${isFocus?'selected':''} ${near?'related':''}" style="left:${p.x}px;top:${p.y}px;width:${NODE_W}px;height:${NODE_H}px;--track-color:${colors[s.strand]||'#7395ca'}" data-id="${safe(s.id)}" data-act="select" aria-pressed="${isFocus}" aria-haspopup="dialog" aria-label="${safe(C.stageById[s.stage]?.title)}・${safe(s.title)}・${statusText[st]||st}" title="${safe(s.title)}"><div class="tech-node-top"><span class="tech-node-meta">${safe(track?.icon||'◇')} ${safe(track?.title||s.strand)}</span><span class="tech-status ${st}">${statusText[st]||safe(st)}</span></div><span class="tech-node-name">${safe(s.title)}</span><span class="tech-node-bottom">${playable?`<span class="tech-gems">${gem(record?.metrics,'basic','#e15f6b')}${gem(record?.metrics,'speed','#5383df')}${gem(record?.metrics,'application','#21a57d')}${gem(record?.metrics,'word','#dca33f')}</span>`:'<span class="tech-plan-note">出題未実装</span>'}<span class="tech-reason">前提${s.prereq.length}件 ${recommendations.includes(s.id)?'◎':''}</span></span></button>`;
 }).join('');
 const rangeOptions=C.ranges.map(r=>`<option value="${r.id}" ${r.id===activeRange?'selected':''}>${r.label}（${C.visibleSkills(r.id).length}）</option>`).join('');
 const currentEdges=l.links.length,allEdges=C.skills.reduce((n,s)=>n+s.prereq.length,0),implemented=skills.filter(s=>statusOf(s.id)!=='planned').length;
 return `<section class="tech-wrap" aria-label="学年別スキル技術ツリー"><div class="tech-toolbar"><div class="tech-tooltitle"><strong>技術ツリー</strong><span>全285技能／問題あり15技能</span></div><div class="tech-controls"><label class="tech-range-label" for="tech-range">表示範囲</label><select id="tech-range" class="tech-range-select" aria-label="スキルツリーの表示範囲">${rangeOptions}</select><button class="btn secondary small" data-act="map-fit" title="表示範囲を画面に収める">全体表示</button><button class="btn secondary small" data-act="map-focus" title="選択した技能へ移動">◎</button><button class="btn secondary small" data-act="map-zoom-out" aria-label="縮小">−</button><span class="map-zoom-value">${Math.round(zoom*100)}%</span><button class="btn secondary small" data-act="map-zoom-in" aria-label="拡大">＋</button></div></div><div class="tech-legend"><div class="tech-search"><input id="tech-search" type="search" placeholder="285技能から検索" autocomplete="off" aria-label="全技能を検索"><button class="btn secondary small" data-act="map-search">検索</button><div id="tech-search-results" class="tech-search-results" hidden></div></div><span><i class="legend-dot master"></i>MASTER</span><span><i class="legend-dot licensed"></i>仮免</span><span><i class="legend-dot locked"></i>未解放</span><span><i class="legend-dot planned"></i>教材準備中</span><span><i class="legend-line"></i>前提</span></div><div class="tech-map-viewport" id="tech-map-viewport"><div class="tech-grade-overlay" aria-hidden="true"><div class="tech-grade-strip" style="width:${l.width*zoom}px;height:${HEADER_H}px">${years}</div></div><div class="tech-map-scroll" id="tech-map-scroll" tabindex="0" aria-label="技能ツリー。学年見出しは固定。内部だけをスクロール"><div class="tech-canvas" style="width:${l.width}px;height:${l.height}px;zoom:${zoom}">${bands}<svg class="tech-edges" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${l.width} ${l.height}" aria-hidden="true" preserveAspectRatio="none">${links}</svg>${nodes}</div></div></div><div class="tech-map-foot"><span>表示 ${skills.length}/285技能（教材あり${implemented}）・前提線 ${currentEdges}/${allEdges}本</span><span>カードをクリックすると技能の詳細を表示</span></div></section>`;
}
function scrollEl(){return typeof document!=='undefined'?document.getElementById('tech-map-scroll'):null;}
function memorize(){const el=scrollEl();if(el)lastPosition={left:el.scrollLeft,top:el.scrollTop,mode};}
function syncGrades(){const el=scrollEl(),strip=document.querySelector('.tech-grade-strip');if(el&&strip)strip.style.transform=`translate3d(${-el.scrollLeft}px,0,0)`;}
function setZoom(v){zoom=v;const canvas=document.querySelector('.tech-canvas'),strip=document.querySelector('.tech-grade-strip');if(canvas)canvas.style.zoom=zoom;if(strip&&canvasLayout){strip.style.width=`${canvasLayout.width*zoom}px`;strip.querySelectorAll('.grade-fixed').forEach((e,i)=>{e.style.left=`${(MARGIN+i*STAGE_W)*zoom}px`;e.style.width=`${STAGE_W*zoom}px`;});}const span=document.querySelector('.map-zoom-value');if(span)span.textContent=`${Math.round(zoom*100)}%`;syncGrades();}
function fit(){const el=scrollEl();if(!el||!canvasLayout)return;const ideal=Math.min((el.clientWidth-8)/canvasLayout.width,(el.clientHeight-8)/canvasLayout.height);const best=Math.max(.52,Math.min(1.12,Math.floor(ideal*100)/100));setZoom(best);el.scrollLeft=0;el.scrollTop=0;syncGrades();}
function restore(selectedId){const el=scrollEl();if(!el)return;if(observer)observer.disconnect();el.addEventListener('scroll',syncGrades,{passive:true});if(!manualZoom)fit();if(lastPosition&&lastPosition.mode===mode){el.scrollLeft=lastPosition.left;el.scrollTop=lastPosition.top;}else if(manualZoom)focus(selectedId);syncGrades();if(typeof ResizeObserver!=='undefined'){observer=new ResizeObserver(()=>{if(!manualZoom)fit();else syncGrades();});observer.observe(document.getElementById('tech-map-viewport'));}}
function focus(id){const el=scrollEl(),node=[...document.querySelectorAll('.tech-node')].find(n=>n.dataset.id===id);if(!el||!node)return;el.scrollLeft=Math.max(0,node.offsetLeft*zoom-el.clientWidth*.32);el.scrollTop=Math.max(0,node.offsetTop*zoom-el.clientHeight*.32);memorize();syncGrades();}
function adjustZoom(delta,selectedId){memorize();manualZoom=true;setZoom(Math.round(Math.min(1.5,Math.max(.52,zoom+delta))*100)/100);focus(selectedId);}
function resetFit(){manualZoom=false;lastPosition=null;fit();}
function resetRange(){manualZoom=false;lastPosition=null;}
return{makeLayout,render,memorize,restore,focus,adjustZoom,resetFit,resetRange,syncGrades};
});
