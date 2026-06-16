# 上海周末遛娃推荐小程序 — 本地部署指引

> 适用环境：Windows 电脑
> 预计耗时：30-60 分钟（含下载安装时间）

---

## 第 1 步：安装必要软件

### 1.1 安装 Node.js（前端+后端都需要）

1. 打开浏览器访问 https://nodejs.org/
2. 下载 **LTS 版本**（长期支持版，目前是 v22.x）
3. 双击安装，**全部点"下一步"** 即可（默认会自动配置环境变量）
4. 验证安装：打开 **命令提示符**（Win+R → 输入 `cmd` → 回车），输入：
   ```
   node -v
   npm -v
   ```
   看到版本号就说明安装成功

### 1.2 安装微信开发者工具

1. 打开浏览器访问 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. 下载 **Windows 64位 稳定版**
3. 双击安装，全部默认
4. 打开微信开发者工具，用微信扫码登录

### 1.3 安装 Git（下载代码用）

1. 打开浏览器访问 https://git-scm.com/download/win
2. 下载安装，全部默认
3. 验证：命令提示符输入 `git --version`

---

## 第 2 步：创建项目并安装前端

### 2.1 创建项目目录

打开命令提示符，执行：
```cmd
mkdir C:\projects
cd C:\projects
mkdir shanghai-kidplay
cd shanghai-kidplay
```

### 2.2 初始化前端项目

```cmd
cd C:\projects\shanghai-kidplay
npx @tarojs/cli init client
```

初始化时选择：
- 框架：**React**
- 语言：**TypeScript**
- CSS 预处理：**Sass**
- 模板：**默认模板**

### 2.3 安装前端依赖

```cmd
cd C:\projects\shanghai-kidplay\client
npm install
```

> ⚠️ 这一步可能需要 5-10 分钟，耐心等待

### 2.4 替换源码

由于我们已有完整的源码，需要将沙箱中的代码复制过来。
最简单的方式是：**我会在聊天中把每个文件的内容发给你，你创建对应的文件。**

或者，如果你有 GitHub 账号，我可以帮你把代码推到 GitHub，你直接 clone。

---

## 第 3 步：用微信开发者工具预览

### 3.1 打开微信开发者工具

1. 点击 **"+"** → **"导入项目"**
2. 目录选择：`C:\projects\shanghai-kidplay\client`
3. AppID 选择：**"测试号"**（游客模式，不需要真实 AppID）
4. 点击 **"确定"**

### 3.2 查看效果

- 左侧是模拟器，可以看到小程序界面
- 右侧是代码编辑器
- 点击 **"编译"** 按钮可以重新编译

---

## 第 4 步：启动后端服务

### 4.1 安装 Docker Desktop

1. 打开浏览器访问 https://www.docker.com/products/docker-desktop/
2. 下载 Windows 版本
3. 安装后重启电脑
4. 打开 Docker Desktop，等待启动完成（左下角显示绿色）

### 4.2 启动数据库

```cmd
cd C:\projects\shanghai-kidplay\server
docker-compose up -d
```

### 4.3 安装后端依赖

```cmd
cd C:\projects\shanghai-kidplay\server
npm install
```

### 4.4 导入种子数据

```cmd
cd C:\projects\shanghai-kidplay\server
npm run seed
```

### 4.5 启动后端

```cmd
cd C:\projects\shanghai-kidplay\server
npm run start:dev
```

看到 `Nest application successfully started` 就说明后端启动成功！

---

## 第 5 步：前端对接后端

### 5.1 修改 API 地址

编辑 `client/src/services/recommendService.ts`，将：
```typescript
const API_BASE = 'https://your-domain.com/api/v1';
```
改为：
```typescript
const API_BASE = 'http://localhost:3000/api/v1';
```

### 5.2 微信开发者工具配置

1. 打开微信开发者工具
2. 点击右上角 **"详情"** → **"本地设置"**
3. 勾选 ✅ **"不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书"**

### 5.3 重新编译

点击 **"编译"** 按钮，小程序将连接到本地后端服务

---

## 常见问题

### Q: npm install 很慢怎么办？
A: 切换到国内镜像：
```cmd
npm config set registry https://registry.npmmirror.com
```

### Q: Docker Desktop 启动失败？
A: 确保电脑开启了虚拟化功能（BIOS 中开启 Hyper-V）

### Q: 没有真实 AppID 能用吗？
A: 可以！选择"测试号"即可预览，但部分功能（如分享到微信群）需要真实 AppID

### Q: 想要真实 AppID 怎么获取？
A: 访问 https://mp.weixin.qq.com/ → 注册小程序 → 在"开发管理"中查看 AppID
