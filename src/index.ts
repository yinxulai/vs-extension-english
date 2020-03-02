import * as vs from 'vscode'
import { TextDocument } from './provider/textDocument'

exports.activate = function activate(context: vs.ExtensionContext) {

  // 注册 TextDocumentContentProvider
  const textDocumentProvider = vs.Disposable.from(
    vs.workspace.registerTextDocumentContentProvider(TextDocument.scheme, new TextDocument())
  )

  // 底部状态栏
  const statusBar = vs.window.createStatusBarItem(vs.StatusBarAlignment.Right, 0)

  // 添加订阅
  context.subscriptions.push(textDocumentProvider)
  context.subscriptions.push(vs.workspace.onDidOpenTextDocument(e => updateStatusBar(statusBar)))
  context.subscriptions.push(vs.workspace.onDidCloseTextDocument(e => updateStatusBar(statusBar)))
  context.subscriptions.push(vs.window.onDidChangeActiveTextEditor(e => updateStatusBar(statusBar)))
  context.subscriptions.push(vs.window.onDidChangeTextEditorSelection(e => updateStatusBar(statusBar)))
  context.subscriptions.push(vs.window.onDidChangeTextEditorViewColumn(e => updateStatusBar(statusBar)))

  updateStatusBar(statusBar)
}

function updateStatusBar(statusBar: vs.StatusBarItem) {
  let selectedText = selectText()
  if (selectedText) {
    // TODO: 翻译
    statusBar.text = `${selectedText}`
    statusBar.show()
  } else {
    statusBar.hide()
  }
}

function selectText(): string | null {
  const { activeTextEditor } = vs.window
  if (!activeTextEditor) { return null }
  const { document } = activeTextEditor

  return document.getText(activeTextEditor.selection)
}

exports.deactivate = function deactivate() {
}