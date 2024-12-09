import { Buffer } from 'node:buffer'
import through2 from 'through2'

/**
 * Rename file - change extname or/and added suffix
 * @type { function rename({ extname?: string | null; suffix?: string | null }) }
 */

export default function rename({
  extname = null,
  suffix = null,
}: { extname?: string | null; suffix?: string | null } = {}) {
  return through2.obj(function (file, _, cb) {
    if (file.isBuffer()) {
      file.contents = Buffer.from(file.contents)

      const extName = file.extname
      if (extname && !suffix) {
        file.extname = extname
      }
      if (!extname && suffix) {
        file.extname = suffix + extName
      }
      if (!extname && !suffix) {
        file.extname = extName
      }
      if (extname && suffix) {
        file.extname = suffix + extname
      }
    }
    cb(null, file)
  })
}
