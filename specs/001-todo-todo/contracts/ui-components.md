# UI Components Contract

**Feature**: ToDoリスト機能  
**Created**: 2025-10-07  
**Type**: JavaScript DOM Component Interface

## Component Interface: TaskInput

### Overview
タスク入力コンポーネント。ユーザーが新しいタスクを入力してリストに追加するためのインターフェース。

### DOM Structure
```html
<div class="task-input">
  <input type="text" id="task-input" placeholder="新しいタスクを入力..." maxlength="500">
  <button type="button" id="add-task-btn">追加</button>
</div>
```

### Events
- `task:add` - 新しいタスクが追加された時にdispatch
  - detail: `{ text: string }`

### Methods
#### `render(container: HTMLElement): void`
コンポーネントをDOM要素に描画

#### `clear(): void`
入力フィールドをクリア

#### `focus(): void`
入力フィールドにフォーカス

---

## Component Interface: TaskList

### Overview
タスク一覧表示コンポーネント。タスクのリスト表示と個別のタスクアイテムの管理。

### DOM Structure
```html
<div class="task-list">
  <ul id="tasks-container">
    <!-- TaskItem components rendered here -->
  </ul>
  <div class="task-count">
    <span id="total-count">0</span>個のタスク
  </div>
</div>
```

### Events
- `task:toggle` - タスクの完了状態が変更された時にdispatch
  - detail: `{ id: string, completed: boolean }`
- `task:delete` - タスクが削除された時にdispatch
  - detail: `{ id: string }`

### Methods
#### `render(container: HTMLElement, tasks: Task[]): void`
タスクリストをDOM要素に描画

#### `updateCount(total: number, completed: number): void`
タスク数表示を更新

---

## Component Interface: TaskItem

### Overview
個別タスクアイテムコンポーネント。タスクの表示、完了状態の切り替え、削除機能を提供。

### DOM Structure
```html
<li class="task-item" data-task-id="uuid">
  <div class="task-content">
    <span class="task-text completed">タスクテキスト</span>
    <button class="delete-btn" type="button" aria-label="削除">✕</button>
  </div>
</li>
```

### CSS Classes
- `.completed` - 完了状態のタスクに適用
- `.task-item:hover` - ホバー状態のスタイル

### Events
- Click on task text → toggles completion
- Click on delete button → deletes task

### Methods
#### `render(task: Task): HTMLElement`
タスクオブジェクトからDOM要素を生成

#### `updateState(task: Task): void`
既存のDOM要素の状態を更新

---

## App Controller Interface

### Overview
アプリケーション全体の制御を行うメインコントローラー。

### Initialization
```javascript
// DOM Content Loaded時に初期化
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
```

### Methods
#### `init(): void`
アプリケーションを初期化
- TaskServiceを初期化
- UIコンポーネントを作成
- イベントリスナーを設定
- 既存のタスクを読み込み

#### `handleTaskAdd(text: string): void`
新しいタスク追加を処理

#### `handleTaskToggle(id: string): void`
タスク完了状態切り替えを処理

#### `handleTaskDelete(id: string): void`
タスク削除を処理

#### `refreshUI(): void`
UI全体を最新のデータで更新

### Event Flow
```
User Input → Component Event → App Controller → TaskService → UI Update
```

## Accessibility Requirements

### Keyboard Navigation
- Tab: 入力フィールド → 追加ボタン → タスクアイテム → 削除ボタン
- Enter: タスク追加（入力フィールドフォーカス時）
- Space: タスク完了切り替え（タスクフォーカス時）
- Delete: タスク削除（タスクフォーカス時）

### ARIA Labels
- `aria-label="新しいタスクを入力"` on input field
- `aria-label="タスクを追加"` on add button  
- `aria-label="タスクを削除"` on delete buttons
- `aria-live="polite"` on task count

### Screen Reader Support
- タスク追加時: "タスクが追加されました"
- タスク完了時: "タスクが完了しました"
- タスク削除時: "タスクが削除されました"

## Performance Requirements

### Rendering
- 100タスクまで: 描画時間 < 100ms
- 1000タスクまで: 描画時間 < 500ms

### Memory Usage
- DOM要素の適切なクリーンアップ
- イベントリスナーのメモリリーク防止

### Storage Operations
- LocalStorage操作: < 10ms
- UI更新後のデータ永続化

## Error Handling

### User Feedback
- 空のタスク追加試行: "タスクの内容を入力してください"
- 長すぎるタスク: "タスクは500文字以内で入力してください"
- Storage失敗: "データの保存に失敗しました"

### Graceful Degradation
- LocalStorage無効時: セッション中のみデータ保持
- JavaScript無効時: 基本的なフォーム動作