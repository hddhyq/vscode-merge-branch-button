import process from 'node:process'
import { execa } from 'execa'
import { window, workspace } from 'vscode'

// Todo: 1 判断当前分支是否为 develop 分支，如果是则直接不执行
// Todo: 2. 判断远程develop是否强制修改过，如果是则不执行，提示用户删除本地develop分支后，重新拉取

export default async function gitMergeDevelop() {
  try {
    // 从配置中读取目标分支名称
    const config = workspace.getConfiguration('gitMergeBranch')
    const targetBranch = config.get('targetBranch', 'develop')

    // 获取当前分支名称
    const { stdout: currentBranch } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'])

    // 检查当前是否有未提交的更改
    const { stdout: status } = await execa('git', ['status', '--porcelain'])

    if (status) {
      window.showErrorMessage('合并失败：您有未提交的更改，请先提交或暂存更改。')
      return process.exit(1)
    }

    // 切换到目标分支
    await execa('git', ['checkout', targetBranch])

    // 拉取最新的目标分支代码
    await execa('git', ['fetch', 'origin', targetBranch])

    // 合并远程目标分支到本地目标分支
    await execa('git', ['merge', `origin/${targetBranch}`, '--no-edit'])

    // 合并之前的当前分支到目标分支
    await execa('git', ['merge', currentBranch, '--no-edit'])

    // 提交最新的目标分支代码
    await execa('git', ['push', 'origin', targetBranch])

    // 切换回原来的分支
    await execa('git', ['checkout', currentBranch])

    // 打印完成信息
    window.showInformationMessage(`
      ${currentBranch}合并完成。
      已切换到${targetBranch}，合并并拉取了最新代码，然后切换回${currentBranch}。
    `)
  }
  catch (error) {
    window.showErrorMessage(`合并失败: ${error}`)
    process.exit(1)
  }
}
