#!/usr/bin/env node
/**
 * Fill in missing app icons, feature graphics and screenshots.
 *
 *   1. Open data/apps.js and set `packageId` for any app that is missing one
 *      (it's the `?id=` value in the app's Play Store URL).
 *   2. Run:  npm run fetch:assets
 *
 * It prints ready-to-paste `icon` / `banner` / `screenshots` values for every
 * app that has a packageId. Nothing is overwritten automatically — you paste
 * what you want, so a bad scrape can never silently break the site.
 *
 * Apps still in closed testing have no public Play page, so keep `status: 'beta'`
 * and add their assets by hand (export them from Play Console).
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const appsPath = resolve(here, '../data/apps.js')

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

async function scrape(packageId) {
  const url = `https://play.google.com/store/apps/details?id=${packageId}&hl=en&gl=US`
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()

  const icon = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1]?.split('=')[0]

  const shots = [
    ...new Set(
      [...html.matchAll(/https:\/\/play-lh\.googleusercontent\.com\/[\w-]+=w\d+-h\d+/g)].map((m) =>
        m[0].split('=')[0]
      )
    ),
  ].filter((u) => u !== icon)

  return {
    icon: icon ? `${icon}=s192` : '',
    banner: shots[0] ? `${shots[0]}=w640-h360` : '',
    screenshots: shots.slice(0, 4).map((s) => `${s}=w640-h360`),
  }
}

const src = await readFile(appsPath, 'utf8')
const ids = [...src.matchAll(/slug:\s*'([^']+)'[\s\S]*?packageId:\s*'([^']*)'/g)].map((m) => ({
  slug: m[1],
  packageId: m[2],
}))

const withIds = ids.filter((a) => a.packageId)
const without = ids.filter((a) => !a.packageId)

if (without.length) {
  console.log(`\nNo packageId set (skipped): ${without.map((a) => a.slug).join(', ')}\n`)
}

for (const app of withIds) {
  process.stdout.write(`\n── ${app.slug} (${app.packageId}) ──\n`)
  try {
    const assets = await scrape(app.packageId)
    console.log(`    icon: '${assets.icon}',`)
    console.log(`    banner:\n      '${assets.banner}',`)
    console.log(`    screenshots: [\n${assets.screenshots.map((s) => `      '${s}',`).join('\n')}\n    ],`)
  } catch (err) {
    console.log(`    failed: ${err.message}`)
  }
  await new Promise((r) => setTimeout(r, 800))
}

console.log('\nPaste the values you want into data/apps.js.\n')
