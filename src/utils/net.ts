import fs from 'fs'
import { request } from 'http'

// 文件下载
// TODO: 提供 filename 就存储文件、否则 resolve 返回下载的数据
export function download(src: string, filename: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filename)
    request(src).pipe(stream).on('close', resolve).on('error', reject)
  })
}
