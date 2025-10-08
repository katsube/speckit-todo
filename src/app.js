/**
 * ToDoリストアプリケーション メインエントリポイント
 * 
 * アプリケーション全体の初期化とコントロールを行う
 */

// Import modules
import { StorageService } from './services/storageService.js';
import { TaskService } from './services/taskService.js';
import { DOMUtils } from './utils/domUtils.js';

/**
 * アプリケーションクラス
 */
class TodoApp {
    constructor() {
        this.storageService = new StorageService();
        this.taskService = new TaskService(this.storageService);
        this.taskInput = null;
        this.taskList = null;
        this.tasks = [];
    }

    /**
     * アプリケーションの初期化
     */
    async init() {
        try {
            console.log('ToDoアプリケーションを初期化中...');
            
            // Initialize localStorage and check for existing data
            await this.initializeStorage();
            
            // Components will be initialized here
            // this.taskInput = new TaskInput();
            // this.taskList = new TaskList();
            
            // イベントリスナーの設定（暫定）
            this.setupEventListeners();
            
            // 既存のタスクを読み込み
            await this.loadTasks();
            
            console.log('ToDoアプリケーションの初期化完了');
        } catch (error) {
            console.error('アプリケーション初期化エラー:', error);
            this.showError('アプリケーションの初期化に失敗しました');
        }
    }

    /**
     * ストレージの初期化
     */
    async initializeStorage() {
        try {
            // Check if localStorage is available
            if (!this.storageService.isAvailable()) {
                throw new Error('LocalStorage is not available');
            }

            // Test storage operations
            const testKey = 'todo-app-test';
            this.storageService.setItem(testKey, 'test');
            const testValue = this.storageService.getItem(testKey);
            this.storageService.removeItem(testKey);

            if (testValue !== 'test') {
                throw new Error('Storage test failed');
            }

            // Load existing tasks
            const existingTasks = this.taskService.getAllTasks();
            console.log(`Found ${existingTasks.length} existing tasks in storage`);

            // Show success message if there are existing tasks
            if (existingTasks.length > 0) {
                DOMUtils.showToast(`${existingTasks.length}件のタスクを読み込みました`, 'success');
            }

        } catch (error) {
            console.error('Storage initialization failed:', error);
            DOMUtils.showToast('データの読み込みに失敗しました', 'warning');
            
            // Continue without storage if possible
            if (error.message === 'LocalStorage is not available') {
                console.warn('Running in memory-only mode');
                DOMUtils.showToast('オフライン機能が利用できません', 'info');
            }
        }
    }

    /**
     * イベントリスナーの設定（暫定実装）
     */
    setupEventListeners() {
        // DOM要素の取得
        const taskInput = document.getElementById('task-input');
        const addButton = document.getElementById('add-task-btn');
        const tasksContainer = document.getElementById('tasks-container');

        // タスク追加イベント
        addButton.addEventListener('click', () => {
            this.handleTaskAdd();
        });

        // Enterキーでタスク追加
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleTaskAdd();
            }
        });

        // タスクリストのイベント（イベント委譲）
        tasksContainer.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;

            const taskId = taskItem.dataset.taskId;
            
            if (e.target.classList.contains('delete-btn')) {
                // 削除ボタンがクリックされた
                this.handleTaskDelete(taskId);
            } else {
                // タスクテキストがクリックされた（完了切り替え）
                this.handleTaskToggle(taskId);
            }
        });
    }

    /**
     * 既存タスクの読み込み
     */
    async loadTasks() {
        try {
            // TaskServiceを使用してタスクを取得
            this.tasks = this.taskService.getAllTasks();
            
            this.refreshUI();
        } catch (error) {
            console.error('タスク読み込みエラー:', error);
            this.tasks = [];
            DOMUtils.showToast('タスクの読み込みに失敗しました', 'error');
        }
    }

    /**
     * タスク追加の処理
     */
    handleTaskAdd() {
        const taskInput = document.getElementById('task-input');
        const text = taskInput.value.trim();

        if (!text) {
            DOMUtils.showToast('タスクの内容を入力してください', 'warning');
            return;
        }

        try {
            // TaskServiceを使用してタスクを追加
            const task = this.taskService.addTask(text);
            this.tasks = this.taskService.getAllTasks();
            this.refreshUI();
            
            // 入力フィールドをクリア
            taskInput.value = '';
            taskInput.focus();

            DOMUtils.showToast('タスクを追加しました', 'success');
            console.log('タスクを追加しました:', task);
        } catch (error) {
            console.error('タスク追加エラー:', error);
            DOMUtils.showToast(error.message || 'タスクの追加に失敗しました', 'error');
        }
    }

    /**
     * タスク完了切り替えの処理
     */
    handleTaskToggle(taskId) {
        try {
            // TaskServiceを使用してタスクの完了状態を切り替え
            const updatedTask = this.taskService.toggleTask(taskId);
            this.tasks = this.taskService.getAllTasks();
            this.refreshUI();

            const status = updatedTask.completed ? '完了' : '未完了';
            DOMUtils.showToast(`タスクを${status}にしました`, 'success');
            console.log('タスクの完了状態を切り替えました:', updatedTask);
        } catch (error) {
            console.error('タスク切り替えエラー:', error);
            DOMUtils.showToast(error.message || 'タスクの更新に失敗しました', 'error');
        }
    }

    /**
     * タスク削除の処理
     */
    handleTaskDelete(taskId) {
        try {
            // TaskServiceを使用してタスクを削除
            const deletedTask = this.taskService.deleteTask(taskId);
            this.tasks = this.taskService.getAllTasks();
            this.refreshUI();

            DOMUtils.showToast('タスクを削除しました', 'success');
            console.log('タスクを削除しました:', deletedTask);
        } catch (error) {
            console.error('タスク削除エラー:', error);
            DOMUtils.showToast(error.message || 'タスクの削除に失敗しました', 'error');
        }
    }

    /**
     * UI全体の更新（暫定実装）
     */
    refreshUI() {
        this.renderTaskList();
        this.updateTaskCount();
    }

    /**
     * タスクリストの描画（暫定実装）
     */
    renderTaskList() {
        const container = document.getElementById('tasks-container');
        
        if (this.tasks.length === 0) {
            container.innerHTML = '<li class="empty-state">タスクがありません。新しいタスクを追加してみましょう。</li>';
            return;
        }

        // 作成日時順（新しい順）でソート
        const sortedTasks = [...this.tasks].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        container.innerHTML = sortedTasks.map(task => `
            <li class="task-item" data-task-id="${task.id}">
                <div class="task-content">
                    <span class="task-text ${task.completed ? 'completed' : ''}">${DOMUtils.escapeHtml(task.text)}</span>
                    <button class="delete-btn" type="button" aria-label="削除">✕</button>
                </div>
            </li>
        `).join('');
    }

    /**
     * タスクカウントの更新
     */
    updateTaskCount() {
        try {
            const stats = this.taskService.getStatistics();
            
            const countElement = document.getElementById('total-count');
            countElement.textContent = stats.total;
            
            // 完了数も表示（将来の機能拡張）
            // countElement.textContent = `${stats.total}個のタスク（完了: ${stats.completed}）`;
        } catch (error) {
            console.error('タスクカウント更新エラー:', error);
            const countElement = document.getElementById('total-count');
            countElement.textContent = '0';
        }
    }

    /**
     * エラーメッセージの表示
     */
    showError(message) {
        DOMUtils.showToast(message, 'error');
        console.error(message);
    }

    /**
     * ユニークIDの生成（UUID v4の簡易版）
     * @deprecated Use TaskService for task creation instead
     */
    generateId() {
        return 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    const app = new TodoApp();
    app.init();
    
    // グローバルに公開（デバッグ用）
    window.todoApp = app;
});