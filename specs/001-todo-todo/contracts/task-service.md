# Task Service Contract

**Feature**: ToDoリスト機能  
**Created**: 2025-10-07  
**Type**: Local JavaScript Service Interface

## Service Interface: TaskService

### Overview
TaskServiceはToDoアプリケーションの核となるサービスで、タスクのCRUD操作を提供します。LocalStorageを使用してデータを永続化し、すべての操作は同期的に実行されます。

### Methods

#### `addTask(text: string): Task`
新しいタスクを作成してリストに追加します。

**Parameters:**
- `text` (string): タスクの説明文（必須、1-500文字）

**Returns:**
- `Task`: 作成されたタスクオブジェクト

**Behavior:**
- UUID v4でIDを自動生成
- createdAt, updatedAtを現在時刻に設定
- completedをfalseで初期化
- LocalStorageに永続化

**Validation:**
- textが空文字列の場合はエラー
- textが500文字を超える場合はエラー

**Example:**
```javascript
const task = taskService.addTask("買い物に行く");
// Returns: { id: "uuid", text: "買い物に行く", completed: false, ... }
```

#### `getAllTasks(): Task[]`
全タスクのリストを取得します。

**Parameters:** なし

**Returns:**
- `Task[]`: タスクの配列（作成日時降順）

**Behavior:**
- LocalStorageからデータを読み込み
- 作成日時順（新しい順）でソート

**Example:**
```javascript
const tasks = taskService.getAllTasks();
// Returns: [{ id: "uuid1", text: "Task 1", ... }, ...]
```

#### `toggleTask(id: string): Task`
指定されたタスクの完了状態を切り替えます。

**Parameters:**
- `id` (string): タスクのID（必須）

**Returns:**
- `Task`: 更新されたタスクオブジェクト

**Behavior:**
- completedフィールドを反転（true ↔ false）
- updatedAtを現在時刻に更新
- LocalStorageに変更を保存

**Validation:**
- 指定されたIDのタスクが存在しない場合はエラー

**Example:**
```javascript
const task = taskService.toggleTask("uuid-123");
// Returns: { id: "uuid-123", text: "Task", completed: true, ... }
```

#### `deleteTask(id: string): boolean`
指定されたタスクを削除します。

**Parameters:**
- `id` (string): タスクのID（必須）

**Returns:**
- `boolean`: 削除成功時はtrue、失敗時はfalse

**Behavior:**
- 指定されたIDのタスクをリストから削除
- LocalStorageから永続的に削除

**Validation:**
- 指定されたIDのタスクが存在しない場合はfalseを返す

**Example:**
```javascript
const success = taskService.deleteTask("uuid-123");
// Returns: true (削除成功) or false (タスクが見つからない)
```

### Error Handling

#### ValidationError
- 入力パラメータが無効な場合にスロー
- メッセージ例: "Task text cannot be empty", "Task text too long"

#### StorageError  
- LocalStorageアクセスが失敗した場合にスロー
- メッセージ例: "Failed to save to localStorage", "localStorage not available"

#### NotFoundError
- 指定されたタスクが見つからない場合にスロー
- メッセージ例: "Task with id 'uuid-123' not found"

### Data Format

#### Task Object
```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  text: "買い物に行く",
  completed: false,
  createdAt: "2025-10-07T10:00:00.000Z",
  updatedAt: "2025-10-07T10:00:00.000Z"
}
```

### Storage Contract

#### LocalStorage Key
- Key: `"todo-app-tasks"`
- Value: JSON string of Task array

#### Storage Operations
- Load: `JSON.parse(localStorage.getItem("todo-app-tasks") || "[]")`
- Save: `localStorage.setItem("todo-app-tasks", JSON.stringify(tasks))`

### Contract Tests Required

#### Unit Test Coverage
- [ ] addTask with valid text
- [ ] addTask with empty text (should throw)
- [ ] addTask with too long text (should throw)
- [ ] getAllTasks returns sorted array
- [ ] toggleTask changes completion state
- [ ] toggleTask with invalid ID (should throw)
- [ ] deleteTask removes task successfully
- [ ] deleteTask with invalid ID returns false
- [ ] LocalStorage persistence across operations

#### Integration Test Coverage
- [ ] Full workflow: add → toggle → delete
- [ ] Multiple task operations
- [ ] LocalStorage data survival across page reloads
- [ ] Error handling when localStorage is disabled