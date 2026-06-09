import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const OUT = process.env.OUT_DIR ?? '/work/shots'
const LABEL = process.env.LABEL ?? 'shot'

const MOBILE = { width: 390, height: 844 }
const DESKTOP = { width: 1280, height: 900 }

// [route, name, scrollToBottom?]
const ROUTES = [
  ['/', 'home'],
  ['/calendar', 'calendar'],
  ['/analytics', 'analytics'],
  ['/achievements', 'achievements'],
  ['/habits', 'habits'],
  ['/settings', 'settings'],
  ['/habit/seed-1', 'detail'],
]

async function shoot(browser, viewport, tag) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  for (const [route, name] of ROUTES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' })
    await page.waitForTimeout(700)
    await page.screenshot({ path: `${OUT}/${LABEL}-${tag}-${name}.png` })
  }
  await ctx.close()
}

const browser = await chromium.launch()
await shoot(browser, MOBILE, 'mobile')
await shoot(browser, DESKTOP, 'desktop')
await browser.close()
console.log('done')
