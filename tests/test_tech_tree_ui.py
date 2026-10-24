import asyncio,pathlib
from playwright.async_api import async_playwright
R=pathlib.Path(__file__).resolve().parents[1]
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  page=await b.new_page(viewport={'width':1430,'height':990},device_scale_factor=1)
  errs=[]
  page.on('pageerror',lambda e:errs.append(str(e)))
  await page.set_content('<html><head><meta charset="utf-8"></head><body><div id="app"></div></body></html>')
  await page.add_style_tag(content=(R/'src/style.css').read_text())
  await page.evaluate("""() => {const data={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>data[k]||null,setItem:(k,v)=>{data[k]=v},removeItem:k=>delete data[k]}})}""")
  for name in ['skills.js','expression_grader.js','engine.js','tech_tree.js','app.js']:
   await page.add_script_tag(content=(R/'src'/name).read_text())
  await page.locator('[data-act=begin]').click()
  for i in range(60):
   if not await page.locator('#diag-answer').count():break
   await page.locator('#diag-answer').fill('0');await page.locator('[data-act=diagnose-answer]').click()
  assert await page.locator('.tech-node').count()==15
  assert await page.locator('.tech-link').count()==16
  assert await page.locator('.grade-fixed').count()==6
  print('Map: nodes 15, edges 16, eras 6')
  await page.screenshot(path=str(R/'tests/tech_tree_full.png'),full_page=True)
  await page.locator('.tech-node[data-id="e3.number.multiply_two_digit_by_two_digit"]').click()
  assert (await page.locator('.tech-node.selected').get_attribute('data-id'))=='e3.number.multiply_two_digit_by_two_digit'
  assert await page.locator('.tech-link.highlight').count()>=2
  assert await page.locator('#skill-dialog').is_visible()
  assert '2桁×2桁の掛け算' in await page.locator('#skill-dialog').inner_text()
  await page.locator('[data-act=close-skill]').click()
  base=int((await page.locator('.map-zoom-value').inner_text()).strip('%'))
  await page.locator('[data-act=map-zoom-in]').click()
  assert int((await page.locator('.map-zoom-value').inner_text()).strip('%'))==base+10
  await page.locator('[data-act=map-zoom-out]').click()
  assert int((await page.locator('.map-zoom-value').inner_text()).strip('%'))==base
  await page.locator('[data-act=map-focus]').click()
  assert not errs,errs
  print('Graph navigation, highlighted prerequisites, zoom, focus: passed')
  print('Screenshot:',R/'tests/tech_tree_full.png')
  await b.close()
asyncio.run(main())
