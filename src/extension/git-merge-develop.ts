import process from 'node:process'
import type { ExtensionContext } from 'vscode'
import { StatusBarAlignment, commands, window, workspace } from 'vscode'
import gitMergeDevelop from '../scripts/git-merge-develop'

export function setupMergeGitBranchButton(context: ExtensionContext) {
  const mergeButton = window.createStatusBarItem(StatusBarAlignment.Left, 0)
  mergeButton.text = '$(git-merge) Merge'
  mergeButton.command = 'extension.mergeGitBranch'
  mergeButton.show()

  const disposable = commands.registerCommand('extension.mergeGitBranch', () => {
    const workspaceFolders = workspace.workspaceFolders
    if (workspaceFolders && workspaceFolders.length > 0) {
      const workspacePath = workspaceFolders[0].uri.fsPath
      process.chdir(workspacePath)
    }
    else {
      window.showErrorMessage('No workspace folder found.')
      return
    }

    // 执行合并操作
    gitMergeDevelop()
  })

  context.subscriptions.push(disposable)
}
