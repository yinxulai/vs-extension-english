
import * as vs from 'vscode'
import { log } from '../utils/log'
import { Display } from './display'
import { Database } from '../database'
import autobind from 'autobind-decorator'

export class Processor {
  constructor(context: vs.ExtensionContext) {
    this.display = new Display()
    this.db = new Database(context.globalStoragePath)
  }

  private db: Database
  private display: Display

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