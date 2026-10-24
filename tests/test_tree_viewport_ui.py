"""MathStudio v0.1.3: browser viewport, sticky grades, skill dialog regression."""
import asyncio, json, pathlib
from playwright.async_api import async_playwright
R = pathlib.Path(__file__).resolve().parents[1]
STATE = {
 'schema_version':1,'profile':{'grade':4,'month':10},'records':{},
 'recommendations':[],'diagnosis':None,'active':None,'practice':None,
 'lastResult':None,'attemptsHistory':[],'practiceHistory':[],
 'nav':'tree','selectedId':'e1.number.add_single','gradingRevision':2
}
async def main():
 async with async_playwright() as pw:
  b=await pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',
       args=['--no-sandbox','--disable-dev-shm-usage'])
  page=await b.new_page(viewport={'width':1440,'height':900})
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  await page.set_content('<html><head><meta charset="utf-8"></head><body><div id="app"></div></body></html>')
  await page.add_style_tag(content=(R/'src/style.css').read_text(encoding='utf-8'))
  await page.evaluate("""data=>{const m={'MathStudio.v0.1.local':JSON.stringify(data)};
    Object.defineProperty(window,'localStorage',{configurable:true,value:{
    getItem:k=>m[k]||null,setItem:(k,v)=>m[k]=v,removeItem:k=>delete m[k]}})}""", STATE)
  for name in ('skills.js','expression_grader.js','engine.js','tech_tree.js','app.js'):
   await page.add_script_tag(content=(R/'src'/name).read_text(encoding='utf-8'))
  for width,height in ((1920,1080),(1440,900),(1280,720),(1024,768),(800,600)):
   await page.set_viewport_size({'width':width,'height':height})
   await page.wait_for_timeout(100)
   measures=await page.evaluate("""()=>{let s=document.querySelector('#tech-map-scroll');
     return {body:document.body.scrollHeight,html:document.documentElement.scrollHeight,
       map:s.scrollHeight,visible:s.clientHeight,nodes:document.querySelectorAll('.tech-node').length,
       grades:document.querySelectorAll('.grade-fixed').length}}""")
   assert measures['body']<=height+1 and measures['html']<=height+1, measures
   assert measures['map']<=measures['visible']+2, measures
   assert measures['nodes']==15 and measures['grades']==6, measures
  await page.set_viewport_size({'width':1440,'height':900})
  await page.locator('[data-act=map-fit]').click()
  assert await page.locator('#detail-pane').count()==0
  await page.locator('.tech-node[data-id="e1.number.add_single"]').click()
  assert await page.locator('#skill-dialog').is_visible()
  assert await page.locator('#skill-dialog .gem').count()==4
  assert await page.locator('#skill-dialog [data-act=test]').count()==1
  await page.keyboard.press('Escape')
  assert not await page.locator('#skill-dialog').is_visible()
  await page.locator('[data-act=map-zoom-in]').click()
  await page.locator('[data-act=map-zoom-in]').click()
  before=await page.evaluate("""()=>{let s=document.querySelector('#tech-map-scroll');
    s.scrollLeft=65;s.scrollTop=90;return document.querySelector('.tech-grade-overlay').getBoundingClientRect().top}""")
  await page.wait_for_timeout(80)
  after=await page.evaluate("document.querySelector('.tech-grade-overlay').getBoundingClientRect().top")
  assert abs(before-after)<1
  await page.locator('[data-act=map-fit]').click()
  await page.locator('.tech-node[data-id="e1.number.add_single"]').click()
  await page.locator('#skill-dialog [data-act=practice]').click()
  assert await page.locator('#practice-answer').count()==1
  await page.locator('[data-act=stop-practice]').click()
  await page.locator('.tech-node[data-id="e1.number.add_single"]').click()
  await page.locator('#skill-dialog [data-act=test]').click()
  assert await page.locator('#test-answer').count()==1
  assert not errors, errors
  print('PASS responsive tech tree, fixed grade labels, native modal and training/exam links')
  await b.close()
asyncio.run(main())
