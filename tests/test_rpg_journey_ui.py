"""End-to-end v0.1.7: fantasy flower and full ancestral path including branches."""
import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright
R=Path(__file__).resolve().parents[1]
BASE={'schema_version':1,'profile':{'grade':4,'month':10},'records':{},'recommendations':[],
      'diagnosis':None,'active':None,'practice':None,'lastResult':None,'attemptsHistory':[],
      'practiceHistory':[],'nav':'tree','selectedId':'e3.number.multiply_two_digit_by_two_digit',
      'createdAt':'2026-10-24T00:00:00Z','gradingRevision':2,'treeRange':'e1-3'}
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  page=await b.new_page(viewport={'width':1440,'height':900},accept_downloads=True)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.set_content('<html><head><meta charset="utf-8"></head><body></body></html>')
  await page.evaluate('''data=>{const values={'MathStudio.v0.1.local':JSON.stringify(data)};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>values[k]||null,setItem:(k,v)=>values[k]=String(v),removeItem:k=>delete values[k]}})}''',BASE)
  await page.set_content((R/'MathStudio_v0.1.7_Standalone.html').read_text(),wait_until='load')
  await page.wait_for_timeout(200)
  assert await page.locator('.tech-node').count()==69, ('nodes',await page.locator('.tech-node').count(),errors)
  assert await page.locator('.adventure-rank').count()==1
  assert await page.locator('.node-bloom').count()==12,await page.locator('.node-bloom').count()
  await page.screenshot(path=str(R/'tests/rpg_tree_1440.png'))
  await page.locator('.tech-node[data-id="e3.number.multiply_two_digit_by_two_digit"]').click()
  assert await page.locator('#skill-dialog').is_visible()
  assert await page.locator('.journey-guide').count()==1
  assert await page.locator('.journey-next .path-skill').count()>0
  assert await page.locator('#skill-dialog .path-skill[data-id="e1.number.count_objects"]').count()>=1
  assert await page.locator('.tech-link.journey-edge').count()>3
  assert await page.locator('.tech-node.journey-start').count()>0
  assert await page.locator('.emblem-panel .petal-bloom').count()==1 # playable target has four-petal emblem
  await page.screenshot(path=str(R/'tests/rpg_journey_dialog.png'))
  await page.locator('#skill-dialog .path-skill[data-id="e1.number.add_single"]').first.click()
  assert await page.locator('#skill-dialog').is_visible()
  assert await page.locator('#skill-dialog-title').count()==1
  assert await page.locator('.emblem-panel .petal-bloom').count()==1
  assert await page.locator('.challenge-actions [data-act="practice"]').count()==1
  await page.screenshot(path=str(R/'tests/rpg_bloom_dialog.png'))
  await page.locator('.challenge-actions [data-act="practice"]').click()
  assert await page.locator('#practice-answer').count()==1
  await page.locator('[data-act="stop-practice"]').click()
  assert await page.locator('.tech-node').count()==69
  await page.locator('#tech-range').select_option('all')
  assert await page.locator('.tech-node').count()==285
  assert await page.locator('.tech-link').count()==485
  for w,h in [(1920,1080),(1440,900),(1280,720),(1024,768),(800,600)]:
   await page.set_viewport_size({'width':w,'height':h});await page.wait_for_timeout(120)
   o=await page.evaluate('''() => {const c=document.querySelector('.tech-map-scroll').getBoundingClientRect(),a=document.querySelector('.tech-grade-overlay').getBoundingClientRect();return {page:document.documentElement.scrollHeight,c:c.toJSON(),a:a.toJSON(),toolbar:document.querySelector('.tech-toolbar').getBoundingClientRect().toJSON()}}''')
   assert o['page']<=h+3,(w,h,o['page'])
   assert o['a']['bottom']<=o['c']['top']+2,(w,h,o)
   assert o['c']['height']>=h*.55,(w,h,o['c']['height'])
  assert not errors,errors
  print('PASS: RPG tree, 285/485 nodes/edges, cross-grade complete ancestors, first start, actual 4-petal flower, 5 viewport sizes')
  await b.close()
asyncio.run(main())
