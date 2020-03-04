import fs from "fs"
import request from "request"

// 文件下载
export function download(src: string, filename: string) {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filename)
    request(src).pipe(stream).on('close', resolve).on('error', reject)
  })
}