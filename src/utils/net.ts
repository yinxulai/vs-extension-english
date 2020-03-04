import fs from 'fs'
import axios from 'axios'
// 文件下载
export async function download(uri: string, filename: string): Promise<void> {
  const stream = fs.createWriteStream(filename);
  const response = await axios({
    url: uri,
    method: 'GET',
    responseType: 'stream'
  })
  response.data.pipe(stream)

  return new Promise<void>((resolve, reject) => {
    stream.on("finish", () => resolve())
    stream.on("error", (err: any) => reject(err))
  })
}

// 获取 json 文件内容
export function getJSON<T>(url: string): Promise<T> {
  return axios.get(url)
}

// getJSON('https://raw.githubusercontent.com/yinxulai/vs-extension-english/master/source/config.json')
//   .catch(console.log)
//   .then(console.log)

download('https://raw.githubusercontent.com/skywind3000/ECDICT/master/wordroot.txt', './test.json')