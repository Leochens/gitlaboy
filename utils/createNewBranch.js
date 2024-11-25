const {
    execSync
} = require('child_process');

const chalk = require('chalk');

function createNewBranch(baseBranch, branchName, checkout = true) {
    try {
        const hasChanges = execSync('git status --porcelain').toString().trim() !== '';
        console.log(chalk.white(`检查远程分支${baseBranch}是否存在...`))
        const remoteBranchExists = execSync(`git ls-remote --exit-code --heads origin ${baseBranch}`).toString().trim();
        if (!remoteBranchExists) {
            console.log(chalk.red(`远程分支${baseBranch}不存在，请先创建分支`))
            throw new Error('远程分支不存在');
        }
        console.log(chalk.white(`拉取远程分支${baseBranch}...`))
        execSync(`git fetch origin ${baseBranch}`);
        // 如果设置了自动切换分支 就自动创建并切换
        if (checkout) {
            if (hasChanges) {
                console.log(chalk.white('发现当前暂存区有修改, 自动带到新分支上...'))
                execSync('git stash');
                execSync(`git checkout -b ${branchName} ${baseBranch} `);
                execSync('git stash apply');
            } else {
                execSync(`git checkout -b ${branchName} ${baseBranch} `);
            }
        } else {
            // 不自动切换 仅创建分支
            execSync(`git branch ${branchName} ${baseBranch} `);
        }


    } catch (error) {
        throw new Error(`切换分支出现问题,原因可能(1. 远程分支不存在 2. 暂存区内容和新分支冲突 3.git命令其他报错): ${error}`);
    }
}
module.exports = {
    createNewBranch
}
