# ElasticSearch Example

## 初期化

```
docker-compose up -d
pnpm install
pnpm seed
```

## ダッシュボード

http://localhost:5601

- username: admin
- password: admin

### インデックスの確認

http://localhost:5601/app/opensearch_index_management_dashboards#/indices

### DevTool

http://localhost:5601/app/dev_tools#/console

サンプル

```json
GET /movies/_search
{
  "query": {
    "match": {
      "country": "Japan"
    }
  }
}
```
