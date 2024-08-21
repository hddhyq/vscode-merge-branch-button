import type { ExtensionContext } from 'vscode'
import { setupMergeGitBranchButton } from './extension/git-merge-develop'

export function activate(context: ExtensionContext) {
  setupMergeGitBranchButton(context)
}

export function deactivate() {

}
