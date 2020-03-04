import * as vs from 'vscode'
import { log } from './utils/log'
import { Processor } from './processor'
import { download } from './utils/net'

exports.deactivate = function deactivate() {
  log('deactivate: 停用扩展')
}

exports.activate = async function activate(context: vs.ExtensionContext) {
  log('activate: 扩展激活了')

  log('activate: init 数据库文件')
  await initDBFile(context)

  log('activate: 创建 Processor')
  const processer = new Processor(context)

  // 添加订阅
  log('activate: 注册事件订阅')
  context.subscriptions.push(vs.workspace.onDidOpenTextDocument(processer.handleOpenTextDocument))
  context.subscriptions.push(vs.workspace.onDidCloseTextDocument(processer.handleCloseTextDocument))
  context.subscriptions.push(vs.window.onDidChangeActiveTextEditor(processer.handleChangeActiveTextEditor))
  context.subscriptions.push(vs.window.onDidChangeTextEditorSelection(processer.handleChangeTextEditorSelection))
  context.subscriptions.push(vs.window.onDidChangeTextEditorViewColumn(processer.handleChangeTextEditorViewColumn))
}

export async function initDBFile(context: vs.ExtensionContext) {
  // 这里做一些下载字典文件的操作

  // TODO: 允许用户下载多个版本的字典
  // 基础版 完备版 甚至允许选择词频范围

  // 检查基础字典文件是否存在
  // 下载配置文件
  // 比较版本
  // 更新/下载
  

  // if (!context.globalState.get('basisStardictVersion')) {
  //   vs.window.withProgress({
  //     location: vs.ProgressLocation.Notification,
  //     title: "正在下载字典文件"
  //   }, (progress, token) => {
  //     progress.report({ increment: 0 })
  //     return download('')
  //   })
  // }


  return
}