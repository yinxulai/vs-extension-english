import * as vs from 'vscode'
import { log } from '../utils/log'

export class Display {
  constructor() {
    this.statusBar = this.createStatusBar()
  }

  private statusBar: vs.StatusBarItem

  private createStatusBar() {
    log('Display: createStatusBar')
    return vs.window.createStatusBarItem(vs.StatusBarAlignment.Left, 100)
  }

  // 在状态栏上显示内容
  showStatusBarMessage(text?:string) {
    log('Display: showStatusBarMessage')

    if (!text) {
      return this.statusBar.hide()
    }

    this.statusBar.text = text
    this.statusBar.show()
  }
}