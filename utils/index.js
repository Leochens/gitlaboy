const Gitlab = require('@gitbeaker/rest').Gitlab;
const chalk = require('chalk');
const getConfig = require('./getConfig');
const config = getConfig();
const baseConfig = config.baseConfig || {};
const projectConfig = config.projectConfig || {};
const {
    execSync,
    exec
} = require('child_process');
const api = new Gitlab({
    host: baseConfig['gitUser-url'],
    token: baseConfig['gitUser-privateToken'],
});
const createCherryPickBranch = async ({
    projectId,
    baseBranchName
}) => {
    const branchName = `cherry-pick-${baseBranchName}-${Date.parse(new Date())}-${parseInt(Math.random() * 10000)}`
    const res = await api.Branches.create(projectId, branchName, baseBranchName);
    console.log(`正在创建cp临时分支:${res.web_url}`);
    return branchName;
}
const getUserByUserName = async (username) => {
    const searchedUsers = await api.Users.all({
        username
    });
    if (searchedUsers.length === 0) {
        throw new Error(`根据用户名${username}未查询到用户`)
    }
    const assigneeUser = searchedUsers.pop();
    return assigneeUser;
}
const getCommits = async ({
    projectId,
    branchName,
    count
}) => {
    const res = await api.Commits.all(projectId, {
        refName: branchName,
        page: 1,
        perPage: count
    })

    // console.log(res);
    return res;
}
const createMR = async ({
    assigneeName,
    projectId,
    sourceBranch,
    targetBranch,
    title,
    options = {},
    removeSourceBranch
}) => {
    const assigneeUser = await getUserByUserName(assigneeName)
    const assigneeId = assigneeUser.id;
    console.log(chalk.green(`根据用户名${assigneeName}查询到用户id为${assigneeId}`));
    console.log(chalk.green(`合并 [${sourceBranch}] => [${targetBranch}] TITLE: ${title} 审核人为:${assigneeUser.name} `));
    const res = await api.MergeRequests.create(projectId, sourceBranch, targetBranch, title, {
        targetProjectId: projectId,
        assigneeId,
        removeSourceBranch,
        ...options
    })
    console.log(chalk.green(`MR在线链接为:${res.web_url}`));
    return res;
}
const cherryPickCommits = async ({ projectId, targetBranch, commits }) => {
    for (let commit of commits) {
        await api.Commits.cherryPick(projectId, commit.short_id, targetBranch);
        console.log(`${commit.title} ==> cp成功`)
    }
}
async function getLastCommitTitle() {
    return new Promise((resolve, reject) => {
      exec('git log -1 --pretty=format:"%s"', (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        
        const commitTitle = stdout.trim();
        resolve(commitTitle);
      });
    });
  }
const getCurProjectName = async () => {
    const url = execSync('git remote get-url origin')?.toString()?.trim('');
    const httpsStr = baseConfig['gitUser-url'];
    let projectName = ''
    if (url.startsWith(httpsStr)) {
        projectName = url.split(httpsStr)?. [1]?.split('.git')?. [0]
    } else {
        const arr = url.split(':') || []
        projectName = arr?. [arr.length - 1]?.split('.git')?. [0]
    }
    if (!projectName) {
        return null;
    }
    return projectName;
}
async function getCurProjectId() {
   const projectName = await getCurProjectName();
   if(!projectName) throw new Error('获取项目名称失败，请重新注册项目');
   const project = projectConfig[projectName];
   if(!project) throw new Error('通过项目名称未找到项目id! 请使用 \n \t gt-regist \n 进行项目注册后再试');
   return project['gitUser-projectId'];
}

async function getMergeRequests({
    assigneeName
}) {
    const user = await getUserByUserName(assigneeName);
    const mrs =  await api.MergeRequests.all({
        state: 'opened',
        scope:'assigned_to_me'
    });
    return mrs;
}
async function mergeMr({mergerequestIId,projectId}) {
    console.log(projectId, mergerequestIId)
    return await api.MergeRequests.merge(projectId,mergerequestIId)
};
module.exports = {
    gitlabInstance: api,
    mergeMr,
    getMergeRequests,
    getCurProjectId,
    getCurProjectName,
    getCommits,
    createCherryPickBranch,
    cherryPickCommits,
    createMR,
    getUserByUserName,
    getLastCommitTitle
}