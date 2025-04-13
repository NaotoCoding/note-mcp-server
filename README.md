# note-mcp-server

Note.com の記事内容を取得するためのMCPサーバー。

## 概要

このプロジェクトは、[Note.com](https://note.com)のユーザー ID を指定して、そのユーザーの最新の数個の記事内容を取得するMCPサーバーです。

## 注意事項

このプロジェクトは以下の手法を使用しています：

- Note.com の**非公式 API**へのアクセス
- Web ページの**スクレイピング**による情報取得

これらの手法は公式にサポートされているものではなく、Note.comのサービス変更によっていつでも動作しなくなる可能性があります。  
**動作の保証はありません**のでご了承ください。  
また、過度なリクエストはサーバーに負荷をかける可能性があるため、適切な間隔を空けて利用してください。

## 必要環境

- Node.js: v22.14.0
- npm: 10.9.2

## インストール

```bash
git clone https://github.com/yourusername/note-mcp-server.git
cd note-mcp-server
npm ci
```

## ビルド

```bash
npm run build
```

## 使用方法

MCPクライアントから以下のツールを呼び出すことで利用できます：

- `recent_notes`: 指定したユーザーIDの最新の数個のnote記事を取得します

### cursorの場合
`.cursor`下にサンプルのmcp.jsonを配置しています。  
`lib/index.js`へのパスを修正した上で、note-mcp-serverをENABLEにしてください。
その状態でchatで「{note use id}の最近の記事を要約してください。」等で実行されます。

## ライセンス

ISC
