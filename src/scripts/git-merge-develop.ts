import process from 'node:process'
import { execa } from 'execa'
import { window } from 'vscode'

export default async function gitMergeDevelop() {
  try {
    // 获取当前分支名称
    const { stdout: currentBranch } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'])

    // 检查当前是否有未提交的更改
    const { stdout: status } = await execa('git', ['status', '--porcelain'])
    if (status) {
      window.showErrorMessage('合并失败：您有未提交的更改，请先提交或暂存更改。')
      process.exit(1)
    }

    // 切换到 develop 分支
    await execa('git', ['checkout', 'develop'])

    // // 拉取最新的 develop 分支代码
    await execa('git', ['fetch', 'origin', 'develop'])

    // // 合并远程 develop 分支到本地 develop 分支，并使用默认的合并信息
    await execa('git', ['merge', 'origin/develop', '--no-edit'])

    // // 合并之前的当前分支到 develop，并使用默认的合并信息
    await execa('git', ['merge', currentBranch, '--no-edit'])

    // // 提交最新的 develop 分支代码
    await execa('git', ['push', 'origin', 'develop'])

    // // 切换回原来的分支
    await execa('git', ['checkout', currentBranch])

    // 打印完成信息
    window.showInformationMessage(`
      ${currentBranch}合并完成。
      已切换到develop，合并并拉取了最新代码，然后切换回${currentBranch}。
    `)
  }
  catch (error) {
    window.showErrorMessage(`合并失败: ${error}`)
    process.exit(1)
  }
}
