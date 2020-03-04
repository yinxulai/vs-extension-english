import * as vs from 'vscode'
import { log } from './utils/log'
import { Database } from './database'
import { Processor } from './processor'

exports.deactivate = function deactivate() {
  log('deactivate: 停用扩展')
}

exports.activate = function activate(context: vs.ExtensionContext) {
  log('activate: 扩展激活了')

  log('activate: 这里应该提示用户并检查字典文件、然后询问是否下载')

  log('activate: 创建 database')
  const database = new Database(context.globalStoragePath)

  log('activate: 创建 Processor')
  const processer = new Processor(database)

  // 添加订阅
  log('activate: 注册事件订阅')
  context.subscriptions.push(vs.workspace.onDidOpenTextDocument(processer.handleOpenTextDocument))
  context.subscriptions.push(vs.workspace.onDidCloseTextDocument(processer.handleCloseTextDocument))
  context.subscriptions.push(vs.window.onDidChangeActiveTextEditor(processer.handleChangeActiveTextEditor))
  context.subscriptions.push(vs.window.onDidChangeTextEditorSelection(processer.handleChangeTextEditorSelection))
  context.subscriptions.push(vs.window.onDidChangeTextEditorViewColumn(processer.handleChangeTextEditorViewColumn))
}