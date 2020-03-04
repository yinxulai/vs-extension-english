
import * as vs from 'vscode'
import { log } from '../utils/log'
import { Display } from './display'
import { Database } from '../database'
import autobind from 'autobind-decorator'

export class Processor {
  constructor(database: Database) {
    this.db = database
    this.display = new Display()
  }

  private db: Database
  private display: Display


  // 翻译
  @autobind
  private translation(word: string) {
   //TODO:  处理翻译
   this.display.showStatusBarMessage(word)
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
    const { activeTextEditor } = vs.window

    if (activeTextEditor == null) {
      // 不存在活动窗口
      return
    }

    // 取得用户主要选择对象
    const primarySelection = e.selections[0]

    // 获取用户选择的文本内容
    const text = activeTextEditor.document.getText(primarySelection)

    this.translation(text)
  }

  @autobind
  handleChangeTextEditorViewColumn(e: vs.TextEditorViewColumnChangeEvent) {
    log('Process: handleChangeTextEditorViewColumn')
  }
}