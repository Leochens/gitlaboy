# GitLaboy：让GitLab操作更优雅

<div align="center">
  <img src="./logo.svg" width="120" height="120" alt="GitLaboy Logo">
  <h1>GitLaboy</h1>
  <p>让GitLab操作更优雅</p>
</div>

GitLaboy是一个强大的GitLab命令行工具，旨在简化和优化您的GitLab工作流程。通过直观的命令行界面，它让GitLab的日常操作变得更加高效和愉快。

## 为什么需要GitLaboy？

在现代软件开发中，GitLab已经成为了团队协作不可或缺的工具。然而，日常使用GitLab时，我们经常会遇到以下痛点：

### 1. 操作繁琐，效率低下

- **频繁切换上下文**
  - 在浏览器和命令行之间来回切换
  - 需要手动复制分支名、提交信息等
  - 操作分散，注意力难以集中

- **重复性工作多**
  - 创建分支时需要手动输入规范的分支名
  - 提交MR时需要重复填写相似的信息
  - 多个项目间切换需要重复配置

### 2. 团队协作不够顺畅

- **代码审核流程繁琐**
  - 创建MR时需要手动选择审核人
  - 无法快速指定固定的审核人
  - 审核流程不够标准化

- **分支管理混乱**
  - 分支命名不规范
  - 合并目标分支容易选错
  - Cherry-pick操作容易出错

### 3. 配置管理复杂

- **多账号切换麻烦**
  - 需要手动更换Token
  - 多个项目使用不同账号时配置繁琐
  - 容易导致权限错误

- **项目配置分散**
  - 每个项目都需要单独配置
  - 配置信息不便于共享
  - 团队成员配置不统一

### 4. 容易出错

- **人工操作风险高**
  - 手动复制粘贴容易出错
  - 分支选择容易选错
  - Cherry-pick时容易遗漏提交

- **缺乏标准化流程**
  - 团队成员操作不统一
  - 缺乏操作记录和追踪
  - 错误操作难以及时发现

GitLaboy正是为了解决这些问题而生。它通过命令行工具的形式，将日常的GitLab操作标准化和自动化，具体体现在：

1. **提升效率**
   - 一键完成复杂操作
   - 减少上下文切换
   - 自动化重复性工作

2. **规范操作**
   - 统一的分支命名规范
   - 标准化的MR流程
   - 规范的代码审核流程

3. **降低错误率**
   - 自动化操作减少人为失误
   - 智能提示避免错误选择
   - 操作可追踪和回溯

4. **优化协作**
   - 简化代码审核流程
   - 统一团队操作规范
   - 提高协作效率

通过使用GitLaboy，开发团队可以：
- 将工作重心放在代码开发上，而不是繁琐的Git操作
- 提高团队协作效率，减少沟通成本
- 降低操作错误，提高代码质量
- 标准化工作流程，提升团队效率

## 什么是GitLaboy？

GitLaboy是一个基于Node.js开发的GitLab命令行工具，它让GitLab的日常操作变得简单而优雅。通过简单的命令，你就可以完成复杂的GitLab操作，无需在浏览器和命令行之间来回切换。

## 快速开始

### 安装
```bash
sudo npm install -g gitlaboy
```

### 初始化配置
```bash
sudo gt-init
```
配置项：
- GitLab服务器地址
- 用户名
- Private Token

### 项目注册
```bash
sudo gt-regist
```
在GitLab项目目录下执行，会自动注册当前项目。

## 核心功能

### 1. 智能分支管理
- 自动按照规范创建分支
- 支持在任意分支间创建新分支
- 智能识别项目结构，提供分支建议

### 2. 一键MR操作
- 在任意分支快速创建MR
- 自动生成MR描述
- 提供在线MR链接，方便团队协作

### 3. 便捷的代码迁移
- 支持在任意分支间进行cherry-pick操作
- 自动处理冲突
- 智能识别commit信息

### 4. 版本管理
- 支持自动版本号更新
- 一键提交新版本
- 版本历史追踪

## 命令大全

### 基础命令

#### 1. 初始化 (gt-init)
```bash
# 首次使用需要初始化配置
sudo gt-init
```
配置项：
- GitLab服务器地址
- 用户名
- Private Token

#### 2. 项目注册 (gt-regist)
```bash
# 在GitLab项目目录下执行
sudo gt-regist
```
功能：
- 自动识别当前Git项目
- 在GitLab中查找对应项目
- 支持多项目选择

#### 3. 查看项目 (gt-list)
```bash
# 查看已注册的项目列表
gt-list
```
输出示例：
```
已注册的项目：
1. project1 (https://git.example.com/group/project1)
2. project2 (https://git.example.com/group/project2)
```

#### 4. 移除项目 (gt-remove)
```bash
# 从已注册列表中移除项目
gt-remove
```
功能：
- 显示已注册项目列表
- 选择要移除的项目
- 确认后移除

### 开发命令

#### 1. 创建分支 (gt-cb)
```bash
# 创建新分支
gt-cb
```
使用场景：
- 从develop分支创建feature分支
- 从master分支创建hotfix分支
- 基于其他分支创建新分支

示例：
```bash
# 从develop分支创建feature分支
gt-cb
# 选择源分支：develop
# 输入新分支名：feature/user-login
```

#### 2. 创建MR (gt-mr)
```bash
# 创建合并请求
gt-mr
```
使用场景：
- 将feature分支合并到develop
- 将hotfix分支合并到master
- 将代码合并到其他分支

示例：
```bash
# 创建MR到develop分支
gt-mr
# 选择目标分支：develop
# 选择审核人：reviewer1
# 输入MR标题：feat: 添加用户登录功能
# 输入MR描述：实现了用户登录功能，包括...
```

#### 3. Cherry-pick操作 (gt-cp)
```bash
# 执行cherry-pick
gt-cp
```
使用场景：
- 将特定提交应用到其他分支
- 同步修复到其他环境
- 功能代码迁移

示例：
```bash
# 将提交cherry-pick到develop分支
gt-cp
# 选择目标分支：develop
# 选择要cherry-pick的提交
# 确认后自动执行cherry-pick
```

#### 4. 版本更新 (gt-uv)
```bash
# 更新版本号
gt-uv
```
使用场景：
- 发布新版本
- 更新版本号
- 自动提交版本更新

示例：
```bash
# 更新版本号
gt-uv
# 选择源分支：develop
# 当前版本：1.0.0
# 新版本：1.0.1
# 自动提交并推送
```

### 审核命令

#### 1. 普通审核 (gt-rv)
```bash
# 创建审核请求
gt-rv
```
使用场景：
- 需要代码审核
- 多人审核
- 自定义审核流程

示例：
```bash
# 创建审核请求
gt-rv
# 选择审核人：reviewer1, reviewer2
# 输入审核说明：请审核用户登录功能
```

#### 2. 快速审核 (gt-rvq)
```bash
# 快速创建审核请求
gt-rvq
```
使用场景：
- 紧急修复需要快速审核
- 与固定审核人配合
- 简化审核流程

示例：
```bash
# 快速创建审核请求
gt-rvq
# 自动使用配置的极速审核人
# 自动创建MR并分配审核人
```

## 配置管理

### 配置命令 (gt-config)

GitLaboy提供了丰富的配置选项，可以通过`gt-config`命令进行管理。执行`gt-config`命令后，会显示以下配置选项：

1. **用户管理**
   - **新增/修改用户配置**
     - 输入用户名和对应的GitLab Private Token
     - 支持配置多个用户，方便在不同账号间切换
     - 配置信息会保存在`userConfig`中
   
   - **查看当前用户配置**
     - 显示当前正在使用的用户信息
     - 包括用户名和GitLab服务器地址
   
   - **切换GitLab用户**
     - 在已配置的用户列表中快速切换
     - 切换后会自动更新`baseConfig`中的用户信息
     - 无需重新输入Token，提高效率

2. **审核人配置**
   - **新增常用代码审核人**
     - 设置MR默认审核人列表
     - 创建MR时会自动显示这些审核人供选择
     - 避免每次都要手动输入审核人
   
   - **新增极速代码审核人**
     - 专门为`gt-review-quick`命令配置的审核人
     - 使用`gt-review-quick`时会自动选择该审核人
     - 适合与固定审核人配合的场景

3. **分支配置**
   - **新增常用合并分支**
     - 设置MR默认目标分支列表
     - 创建MR时会自动显示这些分支供选择
     - 默认包含：develop、daily、release等常用分支
     - 避免每次都要手动输入目标分支

4. **配置查看**
   - **获取配置文件地址**
     - 显示配置文件的具体位置
     - 默认位置：`~/.gt/config.json`
   
   - **查看配置文件**
     - 显示完整的配置文件内容
     - 包括所有用户配置、分支配置等

### 配置文件说明

GitLaboy的配置文件位于`~/.gt/config.json`，包含以下主要配置项：

```json
{
  "baseConfig": {
    "gitUser-url": "GitLab服务器地址",
    "gitUser-name": "当前用户名",
    "gitUser-privateToken": "当前用户的Token",
    "quick-review-user": "极速审核人"
  },
  "userConfig": {
    "用户名1": "Token1",
    "用户名2": "Token2"
  },
  "defaultBranchConfig": [
    "develop",
    "daily",
    "release"
  ],
  "defaultAssigneeConfig": [
    "审核人1",
    "审核人2"
  ],
  "cpListCount": 10
}
```

## 常见问题

1. **命令找不到**
   - 检查是否全局安装
   - 检查环境变量是否正确

2. **权限问题**
   - Mac环境：使用sudo执行命令
   - Windows环境：使用管理员权限执行命令

3. **Node版本要求**
   - 需要Node.js 18以上版本
   - 如果遇到问题，请更新Node版本

## 结语

GitLaboy不仅仅是一个工具，更是对开发流程的优化。它让GitLab操作变得简单而优雅，让开发者能够专注于代码本身，而不是被繁琐的操作所困扰。

如果你也在为GitLab的日常操作而烦恼，不妨试试GitLaboy，它会让你的开发工作变得更加轻松愉快。

> 项目地址：[GitLaboy](https://www.npmjs.com/package/gitlaboy)
> 欢迎提交Issue和PR，一起让GitLaboy变得更好！
