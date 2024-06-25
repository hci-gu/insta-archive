import * as zip from '@zip.js/zip.js'
import { atom } from 'jotai'
import { atomFamily, loadable, unwrap } from 'jotai/utils'
import deepEqual from 'fast-deep-equal'
import * as cheerio from 'cheerio'
import moment from 'moment/moment'

export const fileAtom = atom(null)

const ignorePathsPrefixes = ['__', '._', '.DS_Store']

const shouldIgnorePath = (path) => {
  return ignorePathsPrefixes.some((prefix) => path.startsWith(prefix))
}

const fileTreeAtom = atom(async (get) => {
  const file = get(fileAtom)

  if (!file) {
    return null
  }

  const reader = new zip.ZipReader(new zip.BlobReader(file))

  const entries = await reader.getEntries()

  let root = {}

  for (const entry of entries) {
    const pathParts = entry.filename.split('/')
    let currentLevel = root

    // Iterate through the path parts to build the structure
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i]
      if (shouldIgnorePath(part)) {
        continue
      }

      // Check if we're at a file or still navigating/creating folders
      if (i === pathParts.length - 1) {
        // It's a file, add it directly
        currentLevel[part] = entry
      } else {
        // It's a folder, create it if it doesn't exist
        if (!currentLevel[part]) {
          currentLevel[part] = {}
        }
        // Move into the next level of the structure
        currentLevel = currentLevel[part]
      }
    }
  }

  if (Object.keys(root).length === 1) {
    root = root[Object.keys(root)[0]]
  }

  return root
})

export const folderDataAtom = atomFamily(
  (paths) =>
    atom(async (get) => {
      const root = await get(fileTreeAtom)

      if (!root) {
        return {}
      }

      let currentLevel = root
      for (const path of paths) {
        currentLevel = currentLevel[path]
        if (!currentLevel) {
          return {}
        }
      }

      const dates = {}
      Object.keys(currentLevel).forEach((key) => {
        if (!key.length || key == '.DS_Store') return

        if (!dates[key]) {
          console.log(currentLevel[key])
          dates[key] = Object.keys(currentLevel[key]).length
        }
      })

      return dates
    }),
  deepEqual
)

const monthShortNameToNumber = {
  jan: '01',
  feb: '02',
  mar: '03',
  apr: '04',
  maj: '05',
  jun: '06',
  jul: '07',
  aug: '08',
  sep: '09',
  okt: '10',
  nov: '11',
  dec: '12',
}

export const htmlDataAtom = atomFamily(
  (paths) =>
    atom(async (get) => {
      const root = await get(fileTreeAtom)

      if (!root) {
        return {}
      }

      let currentLevel = root

      for (const path of paths) {
        currentLevel = currentLevel[path]
        if (!currentLevel) {
          return {}
        }
      }

      const content = await currentLevel.getData(new zip.TextWriter())
      const $ = cheerio.load(content)

      // find attribute role="main"
      const dates = {}
      $('div[role="main"]').each((i, el) => {
        let list = $(el)
        list.children().each((i, el) => {
          const [name, date] = $(el).text().split('👍')
          const [day, month, year, time] = date.split(' ')
          const key = `${year}${monthShortNameToNumber[month]}`
          if (!dates[key]) {
            dates[key] = 1
          } else {
            dates[key]++
          }
        })
      })
      return dates
    }),
  deepEqual
)

export const htmlHistoryDataAtom = atomFamily(
  (paths) =>
    atom(async (get) => {
      const root = await get(fileTreeAtom)

      if (!root) {
        return []
      }

      let currentLevel = root

      for (const path of paths) {
        currentLevel = currentLevel[path]
        if (!currentLevel) {
          return []
        }
      }

      const content = await currentLevel.getData(new zip.TextWriter())
      const $ = cheerio.load(content)

      let posts = []
      $('.uiBoxWhite').each((i, el) => {
        const title = $(el.children[0]).text()
        const timestamp = $(el.children[2]).text()

        posts.push({
          title,
          timestamp: moment(timestamp).toDate(),
        })
      })
      posts.sort((a, b) => b.timestamp - a.timestamp)

      return posts
    }),
  deepEqual
)
