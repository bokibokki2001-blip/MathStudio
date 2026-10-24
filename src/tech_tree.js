/* MathStudio v0.1.3: compact grade-based technology graph, sticky era strip and fit-to-viewport. */
(function(root,factory){const v=factory();if(typeof module==='object'&&module.exports)module.exports=v;else root.MathTechTree=v;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const FIRST_GRADE=1,LAST_GRADE=6,COL=246,MARGIN=44,NODE_W=208,NODE_H=80,STEP=94,TOP=68;
const HEADER_H=61;
let zoom=1,manualZoom=false,lastPosition=null,observer=null;
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const statusText={master:'MASTER',pending:'認定待ち',licensed:'仮免',open:'学習可能',locked:'未解放'};
const trackColor={add:'#5a7de0',mul:'#9b65d0',div:'#e49b40',frac:'#1ba286'};
function makeLayout(skills,tracks){
 const grades=Array.from({length:LAST_GRADE-FIRST_GRADE+1},(_,i)=>i+FIRST_GRADE);
 const order=new Map(tracks.map((t,i)=>[t.id,i]));
 const positions={};let largest=1;
 for(const grade of grades){
  const group=skills.filter(s=>s.grade===grade).sort((a,b)=>(order.get(a.track)??99)-(order.get(b.track)??99)||((a.month+8)%12)-((b.month+8)%12)||a.id.localeCompare(b.id));
  largest=Math.max(largest,group.length);
  group.forEach((s,row)=>{positions[s.id]={x:MARGIN+(grade-FIRST_GRADE)*COL+17,y:TOP+12+row*STEP,width:NODE_W,height:NODE_H,grade,track:s.track,row};});
 }
 const links=[];
 for(const s of skills)for(const p of s.prereq){if(positions[p]&&positions[s.id])links.push({from:p,to:s.id,crossTrack:positions[p].track!==positions[s.id].track});}
 return {width:MARGIN+grades.length*COL,height:TOP+22+largest*STEP,grades,positions,links,colWidth:COL,leftMargin:MARGIN,nodeWidth:NODE_W,nodeHeight:NODE_H,headerHeight:HEADER_H};
}
function gem(m,key,color){let v=Number.isFinite(m?.[key])?m[key]:0;return `<span class="tech-gem ${v>=100?'bright':v===0?'empty':''}" style="--stone:${color}" title="${safe({basic:'基礎力',speed:'速度',application:'応用力',word:'文章題'}[key])} ${v}%"></span>`;}
function bezier(a,b){
 if(a.x===b.x){const x=a.x+a.width*.5,y1=a.y+a.height+2,y2=b.y-2;return `M ${x} ${y1} C ${x+18} ${y1+10}, ${x+18} ${y2-10}, ${x} ${y2}`;}
 const x1=a.x+a.width+1,y1=a.y+a.height/2,x2=b.x-1,y2=b.y+b.height/2;
 const bend=Math.max(24,(x2-x1)*.42);
 return `M ${x1} ${y1} C ${x1+bend} ${y1}, ${x2-bend} ${y2}, ${x2} ${y2}`;
}
function render({skills,tracks,statusOf,records,selectedId,recommendations=[]}){
 const l=makeLayout(skills,tracks),selected=skills.find(s=>s.id===selectedId),focusSet=new Set([selectedId,...(selected?.prereq||[]),...skills.filter(s=>s.prereq.includes(selectedId)).map(s=>s.id)]);
 const bands=l.grades.map((g,i)=>`<div class="era-band ${i%2?'era-even':'era-odd'} ${g>4?'era-future':''}" style="left:${MARGIN+i*COL}px;width:${COL}px;height:${l.height}px"></div>`).join('');
 const years=l.grades.map((g,i)=>`<div class="grade-fixed ${g>4?'grade-future':''}" style="left:${(MARGIN+i*COL)*zoom}px;width:${COL*zoom}px"><span>GRADE ${g}</span><strong>小学${g}年</strong>${g>4?'<small>準備中</small>':''}</div>`).join('');
 const tracksLegend=tracks.map(t=>`<span class="tech-track-legend"><i style="background:${trackColor[t.id]||'#789'}"></i>${safe(t.title)}</span>`).join('');
 const links=l.links.map(edge=>{const a=l.positions[edge.from],b=l.positions[edge.to],selectedEdge=edge.from===selectedId||edge.to===selectedId,done=statusOf(edge.from)==='master';return `<path class="tech-link ${edge.crossTrack?'cross-lane':''} ${done?'complete':''} ${selectedEdge?'highlight':''}" d="${bezier(a,b)}" data-source="${safe(edge.from)}" data-target="${safe(edge.to)}"/>`;}).join('');
 const nodes=skills.map(s=>{const p=l.positions[s.id],st=statusOf(s.id),record=records[s.id],isFocus=s.id===selectedId,near=focusSet.has(s.id),reason=s.prereq.length?`前提 ${s.prereq.length} 件`:'基礎技能',track=tracks.find(t=>t.id===s.track);return `<button class="tech-node ${st} ${isFocus?'selected':''} ${near?'related':''}" style="left:${p.x}px;top:${p.y}px;width:${NODE_W}px;height:${NODE_H}px;--track-color:${trackColor[s.track]||'#7395ca'}" data-id="${safe(s.id)}" data-act="select" aria-pressed="${isFocus}" aria-haspopup="dialog" aria-label="小学${s.grade}年・${safe(s.title)}・${statusText[st]||st}"><div class="tech-node-top"><span class="tech-node-meta">${safe(track?.icon||'◇')} ${safe(track?.title||s.track)}</span><span class="tech-status ${st}">${statusText[st]||safe(st)}</span></div><span class="tech-node-name">${safe(s.title)}</span><span class="tech-node-bottom"><span class="tech-gems">${gem(record?.metrics,'basic','#e15f6b')}${gem(record?.metrics,'speed','#5383df')}${gem(record?.metrics,'application','#21a57d')}${gem(record?.metrics,'word','#dca33f')}</span><span class="tech-reason">${safe(reason)} ${recommendations.includes(s.id)?'◎':''}</span></span></button>`;}).join('');
 const selCount=selected?.prereq.length||0;
 return `<section class="tech-wrap" aria-label="学年別スキル技術ツリー"><div class="tech-toolbar"><div class="tech-tooltitle"><strong>技術ツリー</strong><span>技能をクリックして宝石・問題を表示</span></div><div class="tech-controls"><button class="btn secondary small" data-act="map-fit" title="学年全体が見える倍率に調整">全体表示</button><button class="btn secondary small" data-act="map-focus" title="選択した技能へ移動">◎</button><button class="btn secondary small" data-act="map-zoom-out" aria-label="縮小">−</button><span class="map-zoom-value">${Math.round(zoom*100)}%</span><button class="btn secondary small" data-act="map-zoom-in" aria-label="拡大">＋</button></div></div><div class="tech-legend">${tracksLegend}<span><i class="legend-dot master"></i>MASTER</span><span><i class="legend-dot licensed"></i>仮免</span><span><i class="legend-dot locked"></i>未解放</span><span><i class="legend-line"></i>前提</span></div><div class="tech-map-viewport" id="tech-map-viewport"><div class="tech-map-scroll" id="tech-map-scroll" tabindex="0" aria-label="学年見出しは固定、技能ツリーは必要な場合のみ左右・上下にスクロール"><div class="tech-canvas" style="width:${l.width}px;height:${l.height}px;zoom:${zoom}">${bands}<svg class="tech-edges" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${l.width} ${l.height}" aria-hidden="true" preserveAspectRatio="none">${links}</svg>${nodes}</div></div><div class="tech-grade-overlay" aria-hidden="true"><div class="tech-grade-strip" style="width:${l.width*zoom}px;height:${HEADER_H}px">${years}</div></div></div><div class="tech-map-foot"><span>15技能は試作教材・小5〜6は準備中 / 前提線 ${l.links.length}本</span><span>選択中：${safe(selected?.title||'なし')}　前提 ${selCount}件</span></div></section>`;
}
function scrollEl(){return typeof document!=='undefined'?document.getElementById('tech-map-scroll'):null;}
function memorize(){const el=scrollEl();if(el)lastPosition={left:el.scrollLeft,top:el.scrollTop};}
function syncGrades(){const el=scrollEl(),strip=document.querySelector('.tech-grade-strip');if(el&&strip)strip.style.transform=`translate3d(${-el.scrollLeft}px,0,0)`;}
function setZoom(z){zoom=z;const canvas=document.querySelector('.tech-canvas'),strip=document.querySelector('.tech-grade-strip');if(canvas)canvas.style.zoom=zoom;if(strip){strip.style.width=`${(MARGIN+6*COL)*zoom}px`;strip.querySelectorAll('.grade-fixed').forEach((e,i)=>{e.style.left=`${(MARGIN+i*COL)*zoom}px`;e.style.width=`${COL*zoom}px`;});}const value=document.querySelector('.map-zoom-value');if(value)value.textContent=`${Math.round(zoom*100)}%`;syncGrades();}
function fit(){const el=scrollEl(),canvas=document.querySelector('.tech-canvas');if(!el||!canvas)return;const w=Number.parseFloat(canvas.style.width),h=Number.parseFloat(canvas.style.height);if(!w||!h)return;const ideal=Math.min((el.clientWidth-3)/w,(el.clientHeight-8)/h);const best=Math.max(.68,Math.min(1.18,Math.floor(ideal*100)/100));setZoom(best);el.scrollLeft=0;el.scrollTop=0;syncGrades();}
function restore(selectedId){const el=scrollEl();if(!el)return;if(observer)observer.disconnect();el.addEventListener('scroll',syncGrades,{passive:true});if(!manualZoom)fit();if(lastPosition){el.scrollLeft=lastPosition.left;el.scrollTop=lastPosition.top;}else if(manualZoom)focus(selectedId,'center');syncGrades();if(typeof ResizeObserver!=='undefined'){observer=new ResizeObserver(()=>{if(!manualZoom)fit();else syncGrades();});observer.observe(document.getElementById('tech-map-viewport'));}}
function focus(id,mode='center'){const container=scrollEl(),node=[...document.querySelectorAll('.tech-node')].find(n=>n.dataset.id===id);if(!container||!node)return;const left=node.offsetLeft*zoom,top=node.offsetTop*zoom;container.scrollLeft=Math.max(0,left-container.clientWidth*(mode==='center'?.36:.14));container.scrollTop=Math.max(0,top-container.clientHeight*.36-HEADER_H);memorize();syncGrades();}
function adjustZoom(delta,selectedId){memorize();manualZoom=true;setZoom(Math.round(Math.min(1.5,Math.max(.65,zoom+delta))*100)/100);focus(selectedId);}
function resetFit(){manualZoom=false;lastPosition=null;fit();}
return{makeLayout,render,memorize,restore,focus,adjustZoom,resetFit,syncGrades};
});
