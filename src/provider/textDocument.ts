import * as vs from 'vscode'

export class TextDocument implements vs.TextDocumentContentProvider {
  static scheme = ''

  provideTextDocumentContent(uri: vs.Uri, token: vs.CancellationToken): vs.ProviderResult<string> {
    return
  }
}

export default new TextDocument()