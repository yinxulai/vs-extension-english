import { getJSON } from "../utils/net"

interface DictionaryInfo {
  url: string
  version: number
}

interface DictionaryIndex {
  basic: DictionaryInfo
}
interface Index {
  // 字典信息
  dictionary: DictionaryIndex
}

// 获取字典的索引信息
export function getIndex(): Promise<Index> {
  const url = "https://raw.githubusercontent.com/yinxulai/vs-extension-english/master/source/config.json"
  return getJSON(url)
}