import * as vs from 'vscode'
import { log } from './utils/log'
import { Processor } from './processor'

exports.deactivate = function deactivate() {
  log('deactivate: 停用扩展')
}

exports.activate = function activate(context: vs.ExtensionContext) {
  log('activate: 扩展激活了')

  log('activate: 创建 Processor')
  const processer = new Processor()

  // 添加订阅
  log('activate: 注册事件订阅')
  context.subscriptions.push(vs.workspace.onDidOpenTextDocument(processer.handleOpenTextDocument))
  context.subscriptions.push(vs.workspace.onDidCloseTextDocument(processer.handleCloseTextDocument))
  context.subscriptions.push(vs.window.onDidChangeActiveTextEditor(processer.handleChangeActiveTextEditor))
  context.subscriptions.push(vs.window.onDidChangeTextEditorSelection(processer.handleChangeTextEditorSelection))
  context.subscriptions.push(vs.window.onDidChangeTextEditorViewColumn(processer.handleChangeTextEditorViewColumn))
}

function updateStatusBar(statusBar: vs.StatusBarItem) {
  log('updateStatusBar: 更新状态栏')
  let selectedText = selectText()
  if (selectedText) {
    log(`updateStatusBar: 选中文本 ${selectedText}`)
    statusBar.text = `${selectedText}`
    statusBar.show()
  } else {
    statusBar.hide()
    log(`updateStatusBar: 隐藏状态栏`)
  }
}

function selectText(): string | null {
  log('selectText: 选中文本')
  const { activeTextEditor } = vs.window
  if (!activeTextEditor) { return null }
  const { document } = activeTextEditor

  return document.getText(activeTextEditor.selection)
}

