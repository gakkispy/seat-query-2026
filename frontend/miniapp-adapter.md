# Mini Program Adapter

当前项目已经不再依赖后端查询接口，微信小程序可以直接复用以下模块：

- `lib/data.js`: 原始的 `姓名 -> 座位文本` 数据
- `lib/search-core.js`: 座位文本拆分、部门补齐、模糊查询、小程序结果格式化

小程序可直接调用：

```js
import { searchSeatsForMiniProgram } from "../lib/search-core.js";

Page({
  data: {
    keyword: "",
    results: [],
  },
  onInput(event) {
    this.setData({ keyword: event.detail.value });
  },
  onSearch() {
    const results = searchSeatsForMiniProgram(this.data.keyword);
    this.setData({ results });
  },
});
```

结果字段：

- `title`: 展示名称
- `subtitle`: 部门信息
- `zone`: 区域
- `row`: 排号文本
- `seat`: 座位文本
- `location_text`: 完整座位文本