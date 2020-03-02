import { log } from 'util'
import * as vs from 'vscode'
import { TextDocument } from './provider/textDocument'

exports.activate = function activate(context: vs.ExtensionContext) {
  log('activate: 扩展激活了')

  log('activate: 注册 TextDocumentContentProvider')
  // 注册 TextDocumentContentProvider
  const textDocumentProvider = vs.Disposable.from(
    vs.workspace.registerTextDocumentContentProvider(TextDocument.scheme, new TextDocument())
  )

  log('activate: 创建状态栏控件')
  // 底部状态栏
  const statusBar = vs.window.createStatusBarItem(vs.StatusBarAlignment.Right, 0)

  log('activate: 注册事件订阅')
  // 添加订阅
  context.subscriptions.push(textDocumentProvider)
  context.subscriptions.push(vs.workspace.onDidOpenTextDocument(e => updateStatusBar(statusBar)))
  context.subscriptions.push(vs.workspace.onDidCloseTextDocument(e => updateStatusBar(statusBar)))
  context.subscriptions.push(vs.window.onDidChangeActiveTextEditor(e => updateStatusBar(statusBar)))
  context.subscriptions.push(vs.window.onDidChangeTextEditorSelection(e => updateStatusBar(statusBar)))
  context.subscriptions.push(vs.window.onDidChangeTextEditorViewColumn(e => updateStatusBar(statusBar)))

  log('activate: 更新状态栏')
  updateStatusBar(statusBar)
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

exports.deactivate = function deactivate() {
  log('deactivate: 停用扩展')
}