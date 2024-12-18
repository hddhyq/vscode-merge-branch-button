import process from 'node:process'
import type { ExtensionContext } from 'vscode'
import { StatusBarAlignment, commands, window, workspace } from 'vscode'
import gitMergeDevelop from '../scripts/git-merge-develop'

export function setupMergeGitBranchButton(context: ExtensionContext) {
  const mergeButton = window.createStatusBarItem(StatusBarAlignment.Left, 0)
  mergeButton.text = '$(git-merge) Merge'
  mergeButton.command = 'extension.mergeGitBranch'
  mergeButton.show()

  const disposable = commands.registerCommand('extension.mergeGitBranch', async () => {
    // 禁用按钮并更改图标
    mergeButton.text = '$(sync~spin) Merging...'
    mergeButton.command = undefined // 移除命令使按钮不可点击

    const workspaceFolders = workspace.workspaceFolders
    if (workspaceFolders && workspaceFolders.length > 0) {
      const workspacePath = workspaceFolders[0].uri.fsPath
      process.chdir(workspacePath)
    }
    else {
      window.showErrorMessage('No workspace folder found.')
      // 恢复按钮状态
      mergeButton.text = '$(git-merge) Merge'
      mergeButton.command = 'extension.mergeGitBranch'
      return
    }

    try {
      // 执行合并操作
      await gitMergeDevelop()
    }
    finally {
      // 无论成功失败都恢复按钮状态
      mergeButton.text = '$(git-merge) Merge'
      mergeButton.command = 'extension.mergeGitBranch'
    }
  })

  context.subscriptions.push(disposable)
}
