# Excel 数据规范

## 字段定义

| 字段名 | 类型 | 必填 |
|--------|------|------|
| name | string | 是 |
| organization | string | 是 |
| zone | string | 是 |
| row | int | 是 |
| seat | int | 是 |

## 数据清洗规则

1. 去除字符串首尾空格
2. organization 必填（用于区分重名）
3. row / seat 必须为整数
4. 删除完全重复记录

## 重名规则

- 数据库存储原始数据（不处理重名）
- 在接口层生成：

display_name = name + "(" + organization + ")"

## 导入要求

- 文件格式：.xlsx
- 单表结构
- 编码：UTF-8