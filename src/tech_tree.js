/* Technology-tree-inspired visualisation. Model relations come ONLY from MathSkills.skills.prereq. */
(function(root,factory){const v=factory();if(typeof module==='object'&&module.exports)module.exports=v;else root.MathTechTree=v;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const FIRST_GRADE=1,LAST_GRADE=6,COL=266,MARGIN=112,NODE_W=216,NODE_H=128,STEP=151,TOP=91,LANE_GAP=51;
let zoom=1,lastPosition=null;
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const statusText={master:'MASTER',pending:'認定待ち',licensed:'仮免',open:'学習可能',locked:'未解放'};
function makeLayout(skills,tracks){
 const grades=Array.from({length:LAST_GRADE-FIRST_GRADE+1},(_,i)=>i+FIRST_GRADE);
 const positions={};const lanes=[];let y=TOP;
 for(const track of tracks){
  const count=Math.max(1,...grades.map(g=>skills.filter(s=>s.track===track.id&&s.grade===g).length));
  const height=count*STEP+LANE_GAP;
  lanes.push({id:track.id,title:track.title,icon:track.icon,y,height,count});
  for(const grade of grades){
   const group=skills.filter(s=>s.track===track.id&&s.grade===grade).sort((a,b)=>((a.month+8)%12)-((b.month+8)%12)||a.id.localeCompare(b.id));
   // The entire same-grade cohort is visible as a vertical stack, independently of grade chronology.
   group.forEach((s,j)=>{positions[s.id]={x:MARGIN+(grade-FIRST_GRADE)*COL+26,y:y+18+j*STEP,width:NODE_W,height:NODE_H,grade,track:s.track};});
  }
  y+=height;
 }
 const links=[];
 for(const s of skills)for(const p of s.prereq){if(positions[p]&&positions[s.id])links.push({from:p,to:s.id,crossTrack:positions[p].track!==positions[s.id].track});}
 return {width:MARGIN+grades.length*COL,height:y+12,grades,positions,lanes,links,colWidth:COL,leftMargin:MARGIN,nodeWidth:NODE_W,nodeHeight:NODE_H};
}
function gem(m,key,color){let v=Number.isFinite(m?.[key])?m[key]:0;return `<span class="tech-gem ${v>=100?'bright':v===0?'empty':''}" style="--stone:${color}" title="${safe({basic:'基礎力',speed:'速度',application:'応用力',word:'文章題'}[key])} ${v}%"></span>`;}
function bezier(a,b){
 const x1=a.x+a.width+1, y1=a.y+a.height/2,x2=b.x-1,y2=b.y+b.height/2;
 if(b.x===a.x){const rail=x1+20;return `M ${x1} ${y1} L ${rail} ${y1} L ${rail} ${y2} L ${x1} ${y2}`;}
 const bend=Math.max(28,Math.abs(x2-x1)*.38);
 return `M ${x1} ${y1} C ${x1+bend} ${y1}, ${x2-bend} ${y2}, ${x2} ${y2}`;
}
function render({skills,tracks,statusOf,records,selectedId,recommendations=[]}){
 const l=makeLayout(skills,tracks),selected=skills.find(s=>s.id===selectedId),focusSet=new Set([selectedId,...(selected?.prereq||[]),...skills.filter(s=>s.prereq.includes(selectedId)).map(s=>s.id)]);
 const bands=l.grades.map((g,i)=>`<div class="era-band ${i%2?'era-even':'era-odd'} ${g>4?'era-future':''}" style="left:${MARGIN+i*COL}px;width:${COL}px;height:${l.height}px"><div class="era-head"><span class="era-index">GRADE ${g}</span><strong>小学${g}年</strong>${g>4?'<small>教材準備中</small>':'<small>技術をつなぐ</small>'}</div></div>`).join('');
 const lanes=l.lanes.map(x=>`<div class="tech-lane" style="top:${x.y}px;height:${x.height}px;width:${l.width}px"><div class="lane-label"><strong>${safe(x.icon)}</strong><span>${safe(x.title)}</span></div></div>`).join('');
 const links=l.links.map(edge=>{const a=l.positions[edge.from],b=l.positions[edge.to],isFocus=edge.from===selectedId||edge.to===selectedId,done=statusOf(edge.from)==='master';return `<path class="tech-link ${edge.crossTrack?'cross-lane':''} ${done?'complete':''} ${isFocus?'highlight':''}" d="${bezier(a,b)}" data-source="${safe(edge.from)}" data-target="${safe(edge.to)}"/>`;}).join('');
 const nodes=skills.map(s=>{const p=l.positions[s.id],st=statusOf(s.id),record=records[s.id],isFocus=s.id===selectedId,near=focusSet.has(s.id),reason=s.prereq.length?`前提 ${s.prereq.length} 件`:'基礎技能';return `<button class="tech-node ${st} ${isFocus?'selected':''} ${near?'related':''}" style="left:${p.x}px;top:${p.y}px;width:${NODE_W}px;height:${NODE_H}px" data-id="${safe(s.id)}" data-act="select" aria-pressed="${isFocus}" aria-label="${safe(s.title)}・${statusText[st]||st}"><div class="tech-node-top"><span class="tech-node-meta">${safe(s.month)}月の目安</span><span class="tech-status ${st}">${statusText[st]||safe(st)}</span></div><span class="tech-node-name">${safe(s.title)}</span><span class="tech-node-bottom"><span class="tech-gems">${gem(record?.metrics,'basic','#e15f6b')}${gem(record?.metrics,'speed','#5383df')}${gem(record?.metrics,'application','#21a57d')}${gem(record?.metrics,'word','#dca33f')}</span><span class="tech-reason">${safe(reason)} ${recommendations.includes(s.id)?'◎':''}</span></span></button>`;}).join('');
 const selCount=selected?.prereq.length||0;
 return `<section class="tech-wrap" aria-label="学年別スキル技術ツリー"><div class="tech-toolbar"><div class="tech-tooltitle"><strong>学年をまたぐ技術ツリー</strong><span>左から右へ成長。線は実際の前提技能を表します。</span></div><div class="tech-controls"><button class="btn secondary small" data-act="map-focus" title="選択技能が見える位置に移動">◎ 選択技能へ</button><button class="btn secondary small" data-act="map-zoom-out" aria-label="縮小">−</button><span class="map-zoom-value">${Math.round(zoom*100)}%</span><button class="btn secondary small" data-act="map-zoom-in" aria-label="拡大">＋</button></div></div><div class="tech-legend"><span><i class="legend-dot master"></i>MASTER</span><span><i class="legend-dot licensed"></i>仮免</span><span><i class="legend-dot open"></i>学習可能</span><span><i class="legend-dot locked"></i>未解放</span><span><i class="legend-line"></i>前提関係（分岐・合流あり）</span></div><div class="tech-map-scroll" id="tech-map-scroll" tabindex="0" aria-label="左右・上下にスクロールできる学年別技術ツリー"><div class="tech-canvas" style="width:${l.width}px;height:${l.height}px;zoom:${zoom}">${bands}${lanes}<svg class="tech-edges" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${l.width} ${l.height}" aria-hidden="true" preserveAspectRatio="none">${links}</svg>${nodes}</div></div><div class="tech-map-foot"><span>表示中：${skills.length}技能／前提線 ${l.links.length}本（教材実装済みの範囲）</span><span>選択中：${safe(selected?.title||'なし')}　前提${selCount}件</span></div></section>`;
}
function memorize(){const el=typeof document!=='undefined'?document.getElementById('tech-map-scroll'):null;if(el)lastPosition={left:el.scrollLeft,top:el.scrollTop};}
function restore(selectedId){const el=typeof document!=='undefined'?document.getElementById('tech-map-scroll'):null;if(!el)return; if(lastPosition){el.scrollLeft=lastPosition.left;el.scrollTop=lastPosition.top;}else focus(selectedId,'center');}
function focus(id,mode='center'){const container=document.getElementById('tech-map-scroll');const node=[...document.querySelectorAll('.tech-node')].find(n=>n.dataset.id===id);if(!container||!node)return;const left=node.offsetLeft*zoom,top=node.offsetTop*zoom;container.scrollLeft=Math.max(0,left-container.clientWidth*(mode==='center'?.4:.18));container.scrollTop=Math.max(0,top-container.clientHeight*.28);memorize();}
function adjustZoom(delta,selectedId){memorize();zoom=Math.round(Math.min(1.35,Math.max(.7,zoom+delta))*100)/100;const canvas=document.querySelector('.tech-canvas');if(canvas){canvas.style.zoom=zoom;const value=document.querySelector('.map-zoom-value');if(value)value.textContent=`${Math.round(zoom*100)}%`;focus(selectedId);}}
return{makeLayout,render,memorize,restore,focus,adjustZoom};
});
