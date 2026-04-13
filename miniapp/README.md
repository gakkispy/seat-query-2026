# Miniapp

该目录是可直接导入微信开发者工具的小程序工程。

## 使用方式

1. 在微信开发者工具中打开 `miniapp` 目录。
2. 默认使用本地数据检索。
3. 如果要切换到后端 API，修改 `utils/config.js`:

```js
useRemoteApi: true,
apiBaseUrl: "https://your-domain.com"
```

## 目录说明

- `pages/index/`: 首页查询页面
- `utils/data.js`: 座位原始数据
- `utils/search-core.js`: 小程序本地搜索逻辑
- `utils/seat-service.js`: API / 本地双通道查询封装
