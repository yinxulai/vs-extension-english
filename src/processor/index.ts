
import * as vs from 'vscode'
import { log } from '../utils/log'
import { Display } from './display'
import { getIndex } from '../config'
import { Database } from '../database'
import autobind from 'autobind-decorator'


export class Processor {

  constructor(context: vs.ExtensionContext) {
    this.db = new Database(context.globalStoragePath)
    this.display = new Display()
    this.context = context
    this.init(context)
  }

  private db: Database
  private display: Display
  private context: vs.ExtensionContext

  // 初始化
  @autobind
  private async init(context: vs.ExtensionContext) {
    const localBasicDictionaryVersion = context.globalState.get<number>('basicDictionaryVersion') || 0 // 本地基础字典版本

    // 检查本地字典版本
    if (!localBasicDictionaryVersion) {
      log('init: 本地没有任何字典')
      // TODO: 下载离线字典
    }

    // 获取线上字典配置
    let index
    try { index = await getIndex() }
    catch (err) { log('init: 获取字典索引失败', err) }

    if (!index) {
      // TODO: 提示用户错误
      log('init: 获取索引文件错误')
      return
    }

    // 判断线上和本地版本的差距
    if (index.dictionary.basic.version > localBasicDictionaryVersion) {
      // TODO: 更新字典版本
      log(`init: 本地基础字典版本有更新, 本地版本${localBasicDictionaryVersion}, 最新版本${index.dictionary.basic.version}`)
    }
  }

  // 翻译单词
  @autobind
  private async translation(word: string) {
    //TODO:  处理翻译
    const paraphrase = await this.db.queryParaphrase(word)
    this.display.showStatusBarMessage(paraphrase)
  }

  // 获取 text
  @autobind
  private getText(...selections: vs.Selection[]): string[] {
    const { activeTextEditor } = vs.window

    // 不存在活动窗口
    if (activeTextEditor == null) {
      return []
    }

    if (activeTextEditor.document == null) {
      return []
    }

    // 获取用户选择的文本内容
    return selections.map(selection => activeTextEditor.document.getText(selection))
  }

  // 打开文档
  @autobind
  handleOpenTextDocument(e: vs.TextDocument) {
    log('Process: handleOpenTextDocument')
  }
  // 关闭文档
  @autobind
  handleCloseTextDocument(e: vs.TextDocument) {
    log('Process: handleCloseTextDocument')
  }

  // 切换活动的编辑文档
  @autobind
  handleChangeActiveTextEditor(e: vs.TextEditor | undefined) {
    log('Process: handleChangeActiveTextEditor')
  }
  // 编辑器选择内容变更了
  @autobind
  handleChangeTextEditorSelection(e: vs.TextEditorSelectionChangeEvent) {
    log('Process: handleChangeTextEditorSelection')
    const text = this.getText(...e.selections)
    this.translation(text[0])
  }

  @autobind
  handleChangeTextEditorViewColumn(e: vs.TextEditorViewColumnChangeEvent) {
    log('Process: handleChangeTextEditorViewColumn')
  }
}