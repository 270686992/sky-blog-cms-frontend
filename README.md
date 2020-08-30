<h1 align="center">
  Sky-Blog-CMS 前端
</h1>

<blockquote align="center">
 本项目的 CMS 前端基于 Lin-CMS 进行开发, <em>Lin-CMS</em> 是林间有风团队经过大量项目实践所提炼出的一套<strong>内容管理系统框架</strong>。<br>
 Lin-CMS 可以有效的帮助开发者提高 CMS 的开发效率。
</blockquote>

<p align="center">
  <a href="##预览">预览</a>&nbsp;|&nbsp;
  <a href="##简介">简介</a>&nbsp;|&nbsp;
  <a href="##如何使用">如何使用</a>
</p>

## 预览

### 线上 demo

- 博客地址: [www.xilikeli.cn](https://www.xilikeli.cn)

- CMS 端地址: [admin.xilikeli.cn](https://admin.xilikeli.cn)
    - 游客用户的账号密码: guest, 123456

## 简介

Sky-Blog-CMS 是基于 Lin CMS 开发的博客后台管理系统，CMS 后端请访
问 [CMS 后端仓库](https://github.com/270686992/sky-blog-cms-server)

博客前端查看请访问 [博客前端仓库](https://github.com/270686992/sky-blog-frontend)

博客前端的服务端查看请访问 [博客前端的服务端仓库](https://github.com/270686992/sky-blog-server)

Lin CMS 地址: [https://github.com/TaleLin](https://github.com/TaleLin)

## 如何使用

```sh
# 1. 安装依赖
npm install

# 2. 修改项目根目录下的 .env.development 文件中的后端 API 为相应地址
ENV = 'development'
VUE_APP_BASE_URL = 'http://127.0.0.1:5800/'

# 3. 开发环境运行
npm run serve
```