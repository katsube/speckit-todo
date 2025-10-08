# Data Model: ToDoリスト機能

**Feature**: ToDoリスト機能  
**Created**: 2025-10-07  
**Input**: User stories and functional requirements from spec.md

## Entities

### Task
ToDoアプリケーションの中核となるタスクエンティティ

**Attributes:**
- `id` (string): タスクの一意識別子（UUID v4形式）
- `text` (string): タスクの説明文（1-500文字）
- `completed` (boolean): 完了状態フラグ（true: 完了, false: 未完了）
- `createdAt` (Date): タスク作成日時（ISO 8601形式）
- `updatedAt` (Date): 最終更新日時（ISO 8601形式）

**Validation Rules:**
- `text`: 必須、空文字列不可、最大500文字
- `completed`: 必須、boolean値のみ
- `id`: システム生成、重複不可
- `createdAt`: システム生成、変更不可
- `updatedAt`: 更新時に自動設定

**State Transitions:**
```
[未完了] <---> [完了]
   |              |
   v              v
[削除] <------- [削除]
```

## Relationships

現在のスコープでは、Taskエンティティは他のエンティティとの関係を持たない。将来の拡張でカテゴリやユーザーとの関係を追加する可能性がある。

## Storage Schema

### LocalStorage Key Structure
- Key: `todo-app-tasks`
- Value: JSON配列形式のTaskオブジェクト

### Sample Data Structure
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "text": "買い物に行く",
    "completed": false,
    "createdAt": "2025-10-07T10:00:00.000Z",
    "updatedAt": "2025-10-07T10:00:00.000Z"
  },
  {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "text": "レポートを書く",
    "completed": true,
    "createdAt": "2025-10-07T09:30:00.000Z",
    "updatedAt": "2025-10-07T11:15:00.000Z"
  }
]
```

## Data Operations

### Create Task
- 新しいタスクのテキストを受け取る
- UUID v4でIDを生成
- 現在時刻でcreatedAt, updatedAtを設定
- completedをfalseで初期化

### Read Tasks
- 全タスクリストを取得
- 作成日時順（新しい順）でソート

### Update Task
- 完了状態の切り替え
- updatedAtを現在時刻に更新

### Delete Task
- IDによるタスクの削除
- 配列から対象タスクを除去

## Performance Considerations

- LocalStorageの最大容量: 約5-10MB（ブラウザ依存）
- 想定最大タスク数: 1000個
- 1タスクあたりの平均サイズ: 約200バイト
- 合計ストレージ使用量: 約200KB（十分に余裕あり）

## Migration Strategy

初期バージョンのため、マイグレーション不要。将来のスキーマ変更時は以下の戦略を採用：
- データバージョン番号の追加
- 下位互換性の維持
- 段階的マイグレーション