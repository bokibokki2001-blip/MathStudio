"""Legacy grading correction regression in Chromium."""
import asyncio,pathlib
from playwright.async_api import async_playwright
R=pathlib.Path(__file__).resolve().parents[1]
async def main():
 async with async_playwright() as pw:
  b=await pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  p=await b.new_page()
  await p.set_content('<html><head><meta charset="utf-8"></head><body><div id="app"></div></body></html>')
  await p.evaluate("""() => {let db={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>db[k]||null,setItem:(k,v)=>db[k]=v}})}""")
  await p.add_style_tag(content=(R/'src/style.css').read_text(encoding='utf-8'))
  for f in ['skills.js','expression_grader.js','engine.js']:await p.add_script_tag(content=(R/'src'/f).read_text(encoding='utf-8'))
  await p.evaluate("""() => {const s=MathSkills.skills[0],t=MathEngine.buildTest(s),a=t.questions.map(q=>q.inputMode==='formula'?q.formula:q.displayAnswer),i=t.questions.findIndex(q=>q.category==='word');Object.assign(t.questions[i],{params:{a:1,b:1},formula:'a+b',answer:2,displayAnswer:'2',prompt:'赤1枚・青1枚で全部何枚'});a[i]='1+1=2';const h={at:'2026-10-23T12:00:00Z',skillId:s.id,test:t,answers:a,results:[],metrics:{basic:100,speed:94,application:100,word:83},elapsedSeconds:t.targetSeconds-10,perfect:false,provisional:true,correct:a.length-1,count:a.length};const x={schema_version:1,profile:{grade:4,month:10},records:{},recommendations:[],diagnosis:null,active:null,practice:null,lastResult:{...h},attemptsHistory:[h],practiceHistory:[],nav:'tree',selectedId:s.id,createdAt:h.at};localStorage.setItem('MathStudio.v0.1.local',JSON.stringify(x));}""")
  for f in ['catalog.js','tech_tree.js','app.js']:await p.add_script_tag(content=(R/'src'/f).read_text(encoding='utf-8'))
  x=await p.evaluate("JSON.parse(localStorage.getItem('MathStudio.v0.1.local'))")
  r=x['lastResult']
  assert r['perfect'] and r['metrics']==dict(basic=100,speed=100,application=100,word=100)
  assert x['records'][r['skillId']]['master'] is True
  assert '1+1=2' in r['answers'] and x['gradingRevision']==2
  print('PASS saved old ambiguous 1+1=2 => correct, speed 100, MASTER, answers retained')
  await b.close()
asyncio.run(main())
