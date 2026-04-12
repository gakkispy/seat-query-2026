# 数据库设计（PostgreSQL）

## 表：attendees

CREATE TABLE attendees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    row INT NOT NULL,
    seat INT NOT NULL
);

## 索引

CREATE INDEX idx_name ON attendees(name);
CREATE INDEX idx_name_org ON attendees(name, organization);

## 设计说明

- 使用 PostgreSQL
- 不存 display_name（由后端生成）
- 适配模糊查询（LIKE / ILIKE）