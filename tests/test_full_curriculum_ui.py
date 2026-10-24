"""MathStudio v0.1.4 complete curriculum and fixed grade header Chromium smoke tests."""
import asyncio,pathlib
from playwright.async_api import async_playwright
R=pathlib.Path(__file__).resolve().parents[1]
async def main():
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  page=await browser.new_page(viewport={'width':1440,'height':900})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.set_content('<html><head><meta charset="utf-8"></head><body><div id="app"></div></body></html>')
  await page.add_style_tag(content=(R/'src/style.css').read_text(encoding='utf-8'))
  await page.evaluate("""() => {const state={schema_version:1,profile:{grade:4,month:10},records:{},recommendations:[],diagnosis:null,active:null,practice:null,lastResult:null,attemptsHistory:[],practiceHistory:[],nav:'tree',selectedId:'e1.number.add_single',createdAt:'2026-10-24T00:00:00Z',gradingRevision:2,treeRange:'e1-3'};const db={'MathStudio.v0.1.local':JSON.stringify(state)};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>db[k]||null,setItem:(k,v)=>db[k]=String(v)}});}""")
  for name in ['skills.js','expression_grader.js','engine.js','catalog.js','dependency_path.js','tech_tree.js','app.js']:
   await page.add_script_tag(content=(R/'src'/name).read_text(encoding='utf-8'))
  for width,height in [(1920,1080),(1440,900),(1280,720),(1024,768),(800,600)]:
   await page.set_viewport_size({'width':width,'height':height})
   await page.wait_for_timeout(110)
   dims=await page.evaluate("""() => {const h=document.querySelector('.tech-grade-overlay').getBoundingClientRect(),v=document.querySelector('#tech-map-scroll').getBoundingClientRect();return {body:document.body.scrollHeight,headerBottom:h.bottom,scrollTop:v.top}}""")
   assert dims['body']<=height+1,(width,height,dims)
   assert dims['headerBottom']<=dims['scrollTop']+1,(width,height,dims)
  for mode,count in [('e1-3',69),('e4-6',74),('elementary',143),('junior',66),('high',76),('all',285)]:
   await page.locator('#tech-range').select_option(mode)
   assert await page.locator('.tech-node').count()==count,(mode,count)
  assert await page.locator('.tech-link').count()==485
  await page.locator('#tech-range').select_option('e1-3')
  await page.locator('#tech-search').fill('三角形')
  await page.locator('[data-act=map-search]').click()
  assert await page.locator('#tech-search-results button').count()>0
  await page.locator('#tech-search-results button').first.click()
  assert await page.locator('#skill-dialog').is_visible()
  assert await page.locator('#skill-dialog [data-act=test]').count()==0
  await page.locator('[data-act=close-skill]').click()
  await page.locator('#tech-range').select_option('e1-3')
  await page.locator('.tech-node[data-id="e1.number.add_single"]').click()
  assert await page.locator('#skill-dialog [data-act=test]').count()==1
  assert not errors,errors
  print('PASS 285 skills/485 links, six ranges, 5 viewports, nonoverlap header, search, planned safeguards')
  await browser.close()
asyncio.run(main())
