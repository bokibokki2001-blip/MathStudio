import asyncio,pathlib
from playwright.async_api import async_playwright
R=pathlib.Path(__file__).resolve().parents[1]
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  page=await b.new_page(viewport={'width':1200,'height':800},accept_downloads=True)
  errors=[]
  page.on('pageerror',lambda err:errors.append(str(err)))
  page.on('dialog',lambda dlg: asyncio.create_task(dlg.accept()))
  await page.set_content('<html><head><meta charset="utf-8"></head><body><div id="app"></div></body></html>')
  await page.add_style_tag(content=(R/'src/style.css').read_text())
  await page.evaluate("""() => {const data={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>data[k]||null,setItem:(k,v)=>{data[k]=v},removeItem:k=>delete data[k]}})}""")
  for f in ['skills.js','expression_grader.js','engine.js','tech_tree.js','app.js']:
   await page.add_script_tag(content=(R/'src'/f).read_text())
  await page.locator('[data-act=begin]').click()
  for i in range(60):
   if not await page.locator('#diag-answer').count():break
   await page.locator('#diag-answer').fill('0')
   await page.locator('[data-act=diagnose-answer]').click()
  print('Diagnosis complete:', i)
  await page.locator('.tech-node[data-id="e1.number.add_single"]').click()
  await page.locator('#skill-dialog [data-act=practice]').click()
  print('Practice:',await page.locator('h1').all_text_contents())
  await page.locator('#practice-answer').fill('0')
  await page.locator('[data-act=practice-check]').click()
  print('Practice feedback:',await page.locator('div.notice').all_text_contents())
  await page.locator('[data-act=stop-practice]').click()
  print('After practice:',await page.locator('h1').all_text_contents())
  await page.locator('.tech-node[data-id="e1.number.add_single"]').click()
  await page.locator('#skill-dialog [data-act=test]:not([disabled])').click()
  for j in range(100):
   act=await page.evaluate('JSON.parse(localStorage.getItem("MathStudio.v0.1.local")).active')
   if not act:break
   q=act['test']['questions'][j]
   answer=q['formula'] if q['inputMode']=='formula' else q['displayAnswer']
   await page.locator('#test-answer').fill(str(answer))
   if j< len(act['test']['questions'])-1:await page.locator('[data-act=next]').click()
   else:await page.locator('[data-act=submit]').click();break
  print('Test result:',await page.locator('h1').all_text_contents())
  print('Result msg:',(await page.locator('h2').all_text_contents())[:2])
  assert '採点結果' in (await page.locator('h1').first.text_content())
  assert not errors, errors
  await page.screenshot(path=str(R/'tests/result.png'),full_page=True)
  await page.locator('[data-act=close-result]').click()
  await page.locator('[data-act=nav][data-value=progress]').click()
  assert '学習の記録' in (await page.locator('h1').first.text_content())
  print('History entries:',await page.locator('.result-line').count(),'errors',errors)
  await page.locator('[data-act=nav][data-value=settings]').click()
  async with page.expect_download() as d:
   await page.locator('[data-act=export]').last.click()
  download=await d.value
  print('Export filename:',download.suggested_filename)
  exported=await download.path()
  assert pathlib.Path(exported).stat().st_size>1000
  await page.locator('input#import-file').set_input_files(exported)
  await page.wait_for_timeout(350)
  assert '数学の技術ツリー' in (await page.locator('h1').first.text_content()), 'JSON import did not return to tree'
  print('JSON re-import passed')
  await b.close()
asyncio.run(main())
