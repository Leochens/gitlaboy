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
        projectName = url.split(httpsStr)?.[1]?.split('.git')?.[0]
    } else {
        const arr = url.split(':') || []
        projectName = arr?.[arr.length - 1]?.split('.git')?.[0]
    }
    if (!projectName) {
        return null;
    }
    return projectName;
}
async function getCurProjectId() {
    const projectName = await getCurProjectName();
    if (!projectName) throw new Error('获取项目名称失败，请重新注册项目');
    const project = projectConfig[projectName];
    if (!project) throw new Error('通过项目名称未找到项目id! 请使用 \n \t gt-regist \n 进行项目注册后再试');
    return project['gitUser-projectId'];
}

async function getMergeRequests({
    assigneeName,
    getMy,
    withStats = true
}) {
    // const API = customApi ?? api;
    // const user = await getUserByUserName(assigneeName);
    const mrs = await api.MergeRequests.all({
        state: 'opened',
        assigneeName: getMy ? undefined : assigneeName,
        scope: getMy ? 'assigned_to_me' : undefined
    });
    if (!withStats || !mrs?.length) return mrs;

    const isHeaderLine = (line) => {
        return line.startsWith('+++') || line.startsWith('---') || line.startsWith('diff --git') || line.startsWith('index ') || line.startsWith('@@');
    };

    const computeStatsFromDiff = (diffStr) => {
        if (!diffStr) return { additions: 0, deletions: 0 };
        const lines = diffStr.split('\n');
        let additions = 0;
        let deletions = 0;
        for (const line of lines) {
            if (!line) continue;
            if (isHeaderLine(line)) continue;
            if (line.startsWith('+')) additions += 1;
            else if (line.startsWith('-')) deletions += 1;
        }
        return { additions, deletions };
    };

    const addStatsPromises = mrs.map(async (mr) => {
        try {
            // Prefer showChanges with raw diffs when available
            let fileChanges = [];
            try {
                const changesRes = await api.MergeRequests.showChanges(mr.project_id, mr.iid, { accessRawDiffs: true });
                if (changesRes?.changes?.length) {
                    fileChanges = changesRes.changes;
                }
            } catch (_) {
                // ignore and fallback
            }

            if (!fileChanges.length) {
                const diffs = await api.MergeRequests.allDiffs(mr.project_id, mr.iid, { perPage: 100 });
                if (Array.isArray(diffs)) fileChanges = diffs;
            }

            let additions = 0;
            let deletions = 0;
            for (const fileChange of fileChanges) {
                const diffText = fileChange?.diff || '';
                const { additions: a, deletions: d } = computeStatsFromDiff(diffText);
                additions += a;
                deletions += d;
            }
            mr.lineStats = { additions, deletions, total: additions + deletions };
        } catch (e) {
            mr.lineStats = null;
        }
        return mr;
    });

    const mrsWithStats = await Promise.all(addStatsPromises);
    return mrsWithStats;
}
async function mergeMr({ mergerequestIId, projectId, customApi }) {
    const API = customApi ?? api;
    console.log(projectId, mergerequestIId)
    return await API.MergeRequests.merge(projectId, mergerequestIId)
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