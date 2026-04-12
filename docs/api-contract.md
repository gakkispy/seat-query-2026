# API Contract

## Endpoint

### GET /api/seat

Query parameters:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Attendee name keyword, matched with PostgreSQL ILIKE |

Success response:

```json
[
	{
		"name": "张三",
		"organization": "A公司",
		"display_name": "张三(A公司)",
		"zone": "A区",
		"row": 3,
		"seat": 15
	}
]
```

Failure response:

```json
{
	"error": "query parameter 'name' is required"
}
```
