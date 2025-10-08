# QuickStart Guide: ToDoリスト機能

**Feature**: ToDoリスト機能  
**Created**: 2025-10-07  

## Development Setup

### Prerequisites
- Node.js 16+ (テスト環境用)
- Modern browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code推奨)

### Quick Start
```bash
# プロジェクトディレクトリに移動
cd todo-app

# 開発サーバー起動（ローカル）
npx serve .

# ブラウザでアクセス
open http://localhost:3000
```

## Testing Scenarios

### Manual Testing Workflow

#### User Story 1: タスク追加機能（P1 - MVP）
```
1. ブラウザでindex.htmlを開く
2. タスク入力欄に「買い物に行く」と入力
3. Enterキーを押す、または「追加」ボタンをクリック
4. 期待結果: タスクがリストに表示される

エラーケース:
- 空のテキストでは追加されない
- 非常に長いテキストは適切に表示される
```

#### User Story 2: タスク完了チェック機能（P2）
```
前提: タスクが1つ以上リストに存在

1. 未完了のタスクをクリック
2. 期待結果: タスクに取り消し線が引かれる
3. 完了済みタスクを再度クリック
4. 期待結果: 取り消し線が削除される

確認ポイント:
- 完了状態がlocalStorageに保存される
- ページリロード後も状態が維持される
```

#### User Story 3: タスク削除機能（P3）
```
前提: タスクが1つ以上リストに存在

1. タスクの削除ボタン（✕）をクリック
2. 期待結果: タスクがリストから削除される
3. ページをリロード
4. 期待結果: 削除されたタスクは表示されない

確認ポイント:
- 他のタスクに影響しない
- LocalStorageから完全に削除される
```

### Automated Testing

#### Unit Tests
```bash
# Jest テスト実行
npm test

# カバレッジレポート
npm run test:coverage
```

#### E2E Tests
```bash
# Cypress テスト実行
npm run cy:open

# ヘッドレスモード
npm run cy:run
```

## Integration Testing

### LocalStorage Integration
```javascript
// ブラウザ開発者ツールで確認
localStorage.getItem('todo-app-tasks')

// データの手動設定（テスト用）
localStorage.setItem('todo-app-tasks', JSON.stringify([
  {
    id: '123',
    text: 'テストタスク',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]))
```

### Cross-Browser Testing
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Validation

### Load Testing
```javascript
// 大量データでのテスト
const largeTasks = Array.from({length: 100}, (_, i) => ({
  id: `task-${i}`,
  text: `タスク ${i + 1}`,
  completed: i % 2 === 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}))

localStorage.setItem('todo-app-tasks', JSON.stringify(largeTasks))
```

### Performance Metrics
- ページ読み込み時間: < 1秒
- タスク追加応答時間: < 200ms
- 100タスク表示時間: < 500ms

## Deployment Testing

### Static File Hosting
```bash
# GitHub Pages デプロイテスト
git add .
git commit -m "Deploy todo app"
git push origin main
```

### PWA機能（将来の拡張）
- オフライン動作確認
- Service Worker登録確認
- アプリアイコン表示確認

## Troubleshooting

### よくある問題

**タスクが保存されない**
- ブラウザのlocalStorage設定確認
- プライベートモードでないか確認
- ストレージ容量の確認

**タスクが表示されない**
- 開発者ツールでコンソールエラー確認
- localStorageのデータ形式確認
- JavaScript有効化確認

**スタイルが適用されない**
- CSSファイルのパス確認
- ブラウザキャッシュのクリア
- CSS構文エラーの確認