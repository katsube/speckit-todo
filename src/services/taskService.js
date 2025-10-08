/**
 * TaskService - handles all task-related operations
 * Provides CRUD operations for tasks with LocalStorage persistence
 */

import { Task, ValidationError } from '../models/task.js';
import { storageService, StorageError } from './storageService.js';

export class TaskService {
    constructor() {
        this.storageKey = 'tasks';
        this.tasks = [];
        this.initialized = false;
    }

    /**
     * Initialize the service and load existing tasks
     * @returns {Promise<void>}
     */
    async init() {
        if (this.initialized) return;

        try {
            await this.loadTasks();
            this.initialized = true;
            console.log(`TaskService initialized with ${this.tasks.length} tasks`);
        } catch (error) {
            console.error('TaskService initialization failed:', error);
            throw error;
        }
    }

    /**
     * Add a new task
     * @param {string} text - Task description
     * @returns {Task} The created task
     * @throws {ValidationError|StorageError}
     */
    addTask(text) {
        try {
            const task = new Task(text);
            this.tasks.push(task);
            this.saveTasks();
            
            console.log('Task added:', task.toJSON());
            return task;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new StorageError(`Failed to add task: ${error.message}`);
        }
    }

    /**
     * Get all tasks
     * @param {object} options - Filtering and sorting options
     * @returns {Task[]}
     */
    getAllTasks(options = {}) {
        let result = [...this.tasks];

        // Filter by completion status
        if (options.completed !== undefined) {
            result = result.filter(task => task.completed === options.completed);
        }

        // Search by text
        if (options.search) {
            const searchTerm = options.search.toLowerCase().trim();
            result = result.filter(task => 
                task.text.toLowerCase().includes(searchTerm)
            );
        }

        // Sort
        switch (options.sortBy) {
            case 'created':
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'updated':
                result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                break;
            case 'text':
                result.sort((a, b) => a.text.localeCompare(b.text));
                break;
            default:
                // Default: sort by creation date (newest first)
                result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return result;
    }

    /**
     * Get a task by ID
     * @param {string} id 
     * @returns {Task|null}
     */
    getTaskById(id) {
        return this.tasks.find(task => task.id === id) || null;
    }

    /**
     * Toggle task completion status
     * @param {string} id - Task ID
     * @returns {Task} The updated task
     * @throws {NotFoundError|StorageError}
     */
    toggleTask(id) {
        const task = this.getTaskById(id);
        if (!task) {
            throw new NotFoundError(`Task with id '${id}' not found`);
        }

        try {
            task.toggle();
            this.saveTasks();
            
            console.log('Task toggled:', task.toJSON());
            return task;
        } catch (error) {
            throw new StorageError(`Failed to toggle task: ${error.message}`);
        }
    }

    /**
     * Update task text
     * @param {string} id - Task ID
     * @param {string} newText - New task text
     * @returns {Task} The updated task
     * @throws {NotFoundError|ValidationError|StorageError}
     */
    updateTask(id, newText) {
        const task = this.getTaskById(id);
        if (!task) {
            throw new NotFoundError(`Task with id '${id}' not found`);
        }

        try {
            task.updateText(newText);
            this.saveTasks();
            
            console.log('Task updated:', task.toJSON());
            return task;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new StorageError(`Failed to update task: ${error.message}`);
        }
    }

    /**
     * Delete a task
     * @param {string} id - Task ID
     * @returns {boolean} True if deleted successfully
     * @throws {StorageError}
     */
    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
            return false; // Task not found, but not an error
        }

        try {
            const deletedTask = this.tasks.splice(taskIndex, 1)[0];
            this.saveTasks();
            
            console.log('Task deleted:', deletedTask.toJSON());
            return true;
        } catch (error) {
            throw new StorageError(`Failed to delete task: ${error.message}`);
        }
    }

    /**
     * Delete all completed tasks
     * @returns {number} Number of tasks deleted
     * @throws {StorageError}
     */
    deleteCompletedTasks() {
        const initialCount = this.tasks.length;
        this.tasks = this.tasks.filter(task => !task.completed);
        const deletedCount = initialCount - this.tasks.length;

        if (deletedCount > 0) {
            try {
                this.saveTasks();
                console.log(`Deleted ${deletedCount} completed tasks`);
            } catch (error) {
                throw new StorageError(`Failed to delete completed tasks: ${error.message}`);
            }
        }

        return deletedCount;
    }

    /**
     * Get task statistics
     * @returns {object}
     */
    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const incomplete = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            completed,
            incomplete,
            completionRate
        };
    }

    /**
     * Export all tasks as JSON
     * @returns {object}
     */
    exportTasks() {
        return {
            exportedAt: new Date().toISOString(),
            version: '1.0.0',
            tasks: this.tasks.map(task => task.toJSON())
        };
    }

    /**
     * Import tasks from JSON data
     * @param {object} data 
     * @returns {number} Number of tasks imported
     * @throws {ValidationError|StorageError}
     */
    importTasks(data) {
        if (!data || !Array.isArray(data.tasks)) {
            throw new ValidationError('Invalid import data format');
        }

        let importedCount = 0;
        const errors = [];

        for (const taskData of data.tasks) {
            try {
                if (Task.isValidTaskData(taskData)) {
                    // Check for duplicate IDs
                    if (!this.getTaskById(taskData.id)) {
                        const task = Task.fromJSON(taskData);
                        this.tasks.push(task);
                        importedCount++;
                    }
                } else {
                    errors.push(`Invalid task data: ${JSON.stringify(taskData)}`);
                }
            } catch (error) {
                errors.push(`Failed to import task: ${error.message}`);
            }
        }

        if (importedCount > 0) {
            this.saveTasks();
        }

        if (errors.length > 0) {
            console.warn('Import errors:', errors);
        }

        console.log(`Imported ${importedCount} tasks`);
        return importedCount;
    }

    /**
     * Clear all tasks
     * @throws {StorageError}
     */
    clearAllTasks() {
        try {
            this.tasks = [];
            this.saveTasks();
            console.log('All tasks cleared');
        } catch (error) {
            throw new StorageError(`Failed to clear tasks: ${error.message}`);
        }
    }

    /**
     * Load tasks from storage
     * @private
     */
    async loadTasks() {
        try {
            const tasksData = storageService.getItem(this.storageKey, []);
            this.tasks = [];

            if (Array.isArray(tasksData)) {
                for (const taskData of tasksData) {
                    try {
                        if (Task.isValidTaskData(taskData)) {
                            this.tasks.push(Task.fromJSON(taskData));
                        } else {
                            console.warn('Invalid task data found:', taskData);
                        }
                    } catch (error) {
                        console.warn('Failed to load task:', error.message);
                    }
                }
            }

            console.log(`Loaded ${this.tasks.length} tasks from storage`);
        } catch (error) {
            console.error('Failed to load tasks:', error);
            this.tasks = []; // Start with empty array on load failure
        }
    }

    /**
     * Save tasks to storage
     * @private
     */
    saveTasks() {
        try {
            const tasksData = this.tasks.map(task => task.toJSON());
            storageService.setItem(this.storageKey, tasksData);
        } catch (error) {
            throw new StorageError(`Failed to save tasks: ${error.message}`);
        }
    }
}

/**
 * Not found error for task operations
 */
export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}

// Create and export singleton instance
export const taskService = new TaskService();