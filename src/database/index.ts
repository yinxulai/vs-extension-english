import sqlite from 'sqlite3'
import autobind from 'autobind-decorator'

type Paraphrase = string

interface Word {
  word: string // 单词
  phonetic: string // 音标，以英语英标为主
  definition: string // 单词释义（英文），每行一个释义
  translation: string // 单词释义（中文），每行一个释义
  exchange: string // 时态复数等变换
}

export class Database {
  private db: sqlite.Database
  constructor(storagePath: string) {
    this.db = new sqlite.Database(`${storagePath}/database.db`)
    this.createDictionaryTable()
  }

  // 创建词典表
  private createDictionaryTable() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS Dictionary (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT UNIQUE
        phonetic TEXT
        paraphrase TEXT
      )
    `)
  }

  // 查询 释义意译
  @autobind
  async queryParaphrase(word: string): Promise<Paraphrase> {
    const stmt = this.db.prepare("SELECT `word`, `paraphrase` FROM `Dictionary` WHERE `word`=?")
    return new Promise<Paraphrase>((resolve, reject) => {
      stmt.get(word, (err: Error | null, row: any) => {
        if (err) { return reject(err) }
        resolve(row && row.paraphrase)
      })
    })
  }

  // 更新
  @autobind
  async updateParaphrase(word: string, paraphrase: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queryParaphrase(word).then(
        result => {
          if (result) {
            //存在，则更新
            const stmt = this.db.prepare("UPDATE `Dictionary` SET `paraphrase` = ? WHERE `word`=?");
            return stmt.run(paraphrase, word, (err: Error | null, row: any) => {
              if (err) { return reject(err) }
              resolve()
            });
          } else {
            //不存在，则插入
            const stmt = this.db.prepare("INSERT INTO `Dictionary` (`word`, `paraphrase`) VALUES (?,?)");
            return stmt.run(word, paraphrase, (err: Error | null, row: any) => {
              if (err) {
                console.log('result:', result)
                console.log('word:', word)
                return reject(err)
              }
              resolve()
            });
          }
        }).catch(reject)
    })
  }
}
