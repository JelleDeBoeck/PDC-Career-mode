
import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'

const base = 'https://images.gc.pdcservices.co.uk/fit-in/600x600/'

const players = [
  {
    name: 'Luke Littler',
    filename: 'luke-littler',
    image: '7843dbf0-f21a-11f0-a2b2-337f630ef140.png',
  },
  {
    name: 'Luke Humphries',
    filename: 'luke-humphries',
    image: 'f62be0d0-f233-11f0-b703-63c53945660f.png',
  },
  {
    name: 'Gian van Veen',
    filename: 'gian-van-veen',
    image: 'f5b2b930-f233-11f0-9c7f-3f5eeb7c3f65.png',
  },
  {
    name: 'Gerwyn Price',
    filename: 'gerwyn-price',
    image: 'f5a3ec20-f233-11f0-a1f6-49664dee8666.png',
  },
  {
    name: 'Jonny Clayton',
    filename: 'jonny-clayton',
    image: 'f6647d00-f233-11f0-bdca-133e2e51708a.png',
  },
  {
    name: 'James Wade',
    filename: 'james-wade',
    image: 'f5e0ce10-f233-11f0-8be2-5d81ca77fe21.png',
  },
  {
    name: 'Josh Rock',
    filename: 'josh-rock',
    image: 'f5db4fd0-f233-11f0-a60f-19bb93e6fb80.png',
  },
  {
    name: 'Danny Noppert',
    filename: 'danny-noppert',
    image: '7847d390-f21a-11f0-9fa0-0dd7c602545d.png',
  },
  {
    name: 'Michael van Gerwen',
    filename: 'michael-van-gerwen',
    image: 'f62e2ac0-f233-11f0-b992-c9679735a32e.png',
  },
  {
    name: 'Gary Anderson',
    filename: 'gary-anderson',
    image: 'f5b948e0-f233-11f0-8720-17283098ea9c.png',
  },
  {
    name: 'Stephen Bunting',
    filename: 'stephen-bunting',
    image: '782f1b70-f21a-11f0-8e4e-4b7ed58fd19c.png',
  },
  {
    name: 'Wessel Nijman',
    filename: 'wessel-nijman',
    image: 'f5add730-f233-11f0-be26-73a99dbbe585.png',
  },
  {
    name: 'Ryan Searle',
    filename: 'ryan-searle',
    image: 'f6071ac0-f233-11f0-828f-515099993409.png',
  },
  {
    name: 'Ross Smith',
    filename: 'ross-smith',
    image: 'f4fbec50-f233-11f0-adbf-f569001aa27e.png',
  },
  {
    name: 'Nathan Aspinall',
    filename: 'nathan-aspinall',
    image: 'f6372b70-f233-11f0-9303-5182eef97cd9.png',
  },
  {
    name: 'Chris Dobey',
    filename: 'chris-dobey',
    image: 'f5267ec0-f233-11f0-8be2-5d81ca77fe21.png',
  },
]

const outputFolder = path.resolve('public/players')
await fs.mkdir(outputFolder, { recursive: true })

let successful = 0
let failed = 0

for (const player of players) {
  console.log(`Downloaden: ${player.name}`)

  try {
    const response = await fetch(base + player.image, {
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const buffer = Buffer.from(await response.arrayBuffer())

    const filename = path.join(
      outputFolder,
      `${player.filename}.png`
    )

    await sharp(buffer)
      .resize(500, 500, {
        fit: 'contain',
        background: '#00000000',
      })
      .png()
      .toFile(filename)

    console.log(`✓ Gelukt: ${player.filename}.png`)
    successful++
  } catch (error) {
    console.log(`✗ Mislukt: ${player.name}`)
    console.log(`  ${error.message}`)
    failed++
  }
}

console.log('')
console.log('Download afgerond!')
console.log(`Gelukt: ${successful}/16`)
console.log(`Mislukt: ${failed}/16`)
