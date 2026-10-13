# 敲敲岛 Knock Knock Island

面向 **6-10 岁儿童**的键盘盲打 + 编程启蒙网页应用：8 座岛、132 个关卡、541 道题，从认识手指位置一路打到能写出会动的小游戏。

线上地址：https://bestgunners.github.io/qiaoqiaodao/

## 这是什么

- 孩子用**闯关的方式**学会盲打：每关只练几个键，敲对一个字母立刻有颜色和音效反馈；第 1 岛还会在模拟键盘上用一只小手引导「哪根手指按哪个键」
- 打到第 5、6 岛开始写 **C++**：自己敲的代码可以真的运行，舞台上能画出会动的画面；敲到关键词或变量名时，舞台会同步演出并解释它是什么
- 第 7 岛是**中文拼音打字**（24 关）：汉字上方标着拼音，一个字母一个字母打出来，从识字、词语、成语一路到古诗和短文
- 第 8 岛是**课文长句**：不给拼音，孩子靠自己把一整段小学课文打出来，打对一个字才能打下一个字
- 不需要邮箱注册：选个头像、画一个图形密码就能开始（数据保存在浏览器本地）

## 功能

| 模块 | 说明 |
|---|---|
| 儿童账号 | 20 个矢量小怪兽头像 + 图形密码（4 个线性图标）登录；多档案、改名、换头像、改图形密码，删除前二次确认 |
| 学习地图 | 8 座岛 132 关：认识键盘 / 键盘启蒙 / 英文单词 / 代码符号 / 简单代码 / 小游戏编程 / 中文打字 / 课文长句；每岛前三关直接开放，之后逐关解锁 |
| 打字训练 | 目标字符、可隐藏的虚拟键盘、手指提示、拼音条、实时 WPM 与正确率、弱键与混淆分析、连击、提示阶梯（连错 5 次可跳过） |
| 编程练习 | 自研 C++ 教学解释器：语法检查、中文报错、逐行演示、舞台绘图与逐帧动画；代码零件（关键词、符号、变量名）边打边解释 |
| 中文打字 | 拼音逐字母上色、汉字逐字完成反馈与音效；第 8 岛不给拼音，全靠自己拼 |
| 游戏化 | 星星、11 枚徽章、等级能量条、连续学习天数、排行榜（能量 / 速度 / 坚持三榜） |
| 家长端 | 学习时长、打字速度变化、完成课程、错误统计 |
| 设置 | 音效音量与开关、全局点击音效、背景音乐与音量、虚拟键盘显隐、字体样式（圆润 / 楷体 / 黑体）与字号、悬停小星星、改名换头像改密码 |
| 视觉 | 全站没有 emoji：头像、徽章、岛屿、舞台图形都是自绘 SVG，界面图标是统一的一套线性图标；童趣 + 科技风 |

## 技术栈

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · Zustand（localStorage 持久化）· React Router 6

音效全部用 Web Audio 实时合成，字体自托管，**没有任何需要联网的第三方资源**；纯前端应用，不需要后端。

## 本地运行

```bash
npm install
npm run dev        # http://localhost:5173
```

Windows PowerShell 若提示 npm 被禁用，把命令换成 `npm.cmd run dev`；也可以直接双击 `启动.cmd`。

## 构建与自测

```bash
npm run build      # 产物在 dist/
npm run typecheck  # 类型检查
node scripts/content-selftest.ts   # 自测之一
```

九套自测共 469 项断言，都在 `scripts/` 下：`content` / `engine` / `cpp` / `programs` / `stage` / `codeparts` / `unlock` / `settings` / `ranking`。

## 目录结构

```
src/
  components/   界面组件：打字、编程舞台、虚拟键盘、学习地图、儿童登录、通用组件、图标、动效
  data/         课程内容（8 座岛的关卡、可运行程序、拼音表、头像、徽章）
  engine/       打字引擎、C++ 教学解释器、音效、进度与奖励规则
  pages/        首页 / 登录 / 学习地图 / 打字关 / 排行榜 / 设置
  store/        Zustand 状态（档案、进度、设置）
  styles/       儿童向动效与自托管字体
scripts/        九套自测脚本 + GitHub API 推送与发布脚本
docs/           产品设计、项目结构指南、上线部署指南
```

## 上线部署

当前通过 GitHub Pages 托管：https://bestgunners.github.io/qiaoqiaodao/

```bash
node scripts/push-source-api.mjs     # 推源码（走 api.github.com，绕开 github.com 的 HTTPS 抖动）
node scripts/publish-pages-api.mjs   # 构建并发布到 gh-pages 分支
```

Vercel / Netlify / Cloudflare Pages 等静态托管的做法见 [docs/上线部署指南.md](docs/上线部署指南.md)，构建产物 `dist/` 直接放上去即可。

## 关于数据

孩子的档案、进度、设置都保存在**浏览器本地**（localStorage 的 `codekids.child` / `codekids.progress` / `codekids.settings`），不上传服务器，也没有第三方统计。因此换设备不会同步；如果要做多设备同步或家长远程查看，需要再加后端（`src/store/childStore.ts` 里已留好接入位置，档案结构带版本号，改字段时可以写迁移）。
