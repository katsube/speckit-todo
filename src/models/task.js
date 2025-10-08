/**
 * Task entity model
 * ToDoアプリケーションのタスクエンティティを定義
 */

/**
 * Task class - represents a single todo task
 */
export class Task {
    /**
     * Creates a new Task instance
     * @param {string} text - Task description
     * @param {object} options - Optional properties
     */
    constructor(text, options = {}) {
        this.validateText(text);
        
        this.id = options.id || this.generateId();
        this.text = text.trim();
        this.completed = options.completed || false;
        this.createdAt = options.createdAt || new Date().toISOString();
        this.updatedAt = options.updatedAt || new Date().toISOString();
    }

    /**
     * Validates task text
     * @param {string} text 
     * @throws {ValidationError}
     */
    validateText(text) {
        if (!text || typeof text !== 'string') {
            throw new ValidationError('Task text is required and must be a string');
        }

        const trimmedText = text.trim();
        if (trimmedText.length === 0) {
            throw new ValidationError('Task text cannot be empty');
        }

        if (trimmedText.length > 500) {
            throw new ValidationError('Task text cannot exceed 500 characters');
        }
    }

    /**
     * Toggles the completion status of the task
     * @returns {Task} Returns this for method chaining
     */
    toggle() {
        this.completed = !this.completed;
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Marks the task as completed
     * @returns {Task} Returns this for method chaining
     */
    markCompleted() {
        if (!this.completed) {
            this.completed = true;
            this.updatedAt = new Date().toISOString();
        }
        return this;
    }

    /**
     * Marks the task as incomplete
     * @returns {Task} Returns this for method chaining
     */
    markIncomplete() {
        if (this.completed) {
            this.completed = false;
            this.updatedAt = new Date().toISOString();
        }
        return this;
    }

    /**
     * Updates the task text
     * @param {string} newText 
     * @returns {Task} Returns this for method chaining
     */
    updateText(newText) {
        this.validateText(newText);
        this.text = newText.trim();
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Converts task to plain object for serialization
     * @returns {object}
     */
    toJSON() {
        return {
            id: this.id,
            text: this.text,
            completed: this.completed,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Creates a Task instance from plain object
     * @param {object} data 
     * @returns {Task}
     */
    static fromJSON(data) {
        return new Task(data.text, {
            id: data.id,
            completed: data.completed,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        });
    }

    /**
     * Validates task data object
     * @param {object} data 
     * @returns {boolean}
     */
    static isValidTaskData(data) {
        try {
            if (!data || typeof data !== 'object') return false;
            if (!data.id || typeof data.id !== 'string') return false;
            if (!data.text || typeof data.text !== 'string') return false;
            if (typeof data.completed !== 'boolean') return false;
            if (!data.createdAt || !data.updatedAt) return false;
            
            // Date validation
            if (isNaN(Date.parse(data.createdAt)) || isNaN(Date.parse(data.updatedAt))) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Generates a unique ID for the task
     * @returns {string}
     */
    generateId() {
        // UUID v4 simplified version
        return 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Returns a human-readable string representation
     * @returns {string}
     */
    toString() {
        const status = this.completed ? '✓' : '○';
        return `[${status}] ${this.text}`;
    }

    /**
     * Gets the age of the task in milliseconds
     * @returns {number}
     */
    getAge() {
        return Date.now() - new Date(this.createdAt).getTime();
    }

    /**
     * Gets the time since last update in milliseconds
     * @returns {number}
     */
    getTimeSinceUpdate() {
        return Date.now() - new Date(this.updatedAt).getTime();
    }

    /**
     * Checks if the task was recently created (within last 24 hours)
     * @returns {boolean}
     */
    isRecent() {
        return this.getAge() < 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    }

    /**
     * Creates a copy of the task
     * @returns {Task}
     */
    clone() {
        return Task.fromJSON(this.toJSON());
    }
}

/**
 * Validation error for task operations
 */
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

/**
 * Task status constants
 */
export const TaskStatus = {
    INCOMPLETE: false,
    COMPLETED: true
};

/**
 * Task utility functions
 */
export const TaskUtils = {
    /**
     * Sorts tasks by creation date (newest first)
     * @param {Task[]} tasks 
     * @returns {Task[]}
     */
    sortByCreatedDate(tasks) {
        return [...tasks].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    },

    /**
     * Sorts tasks by update date (most recently updated first)
     * @param {Task[]} tasks 
     * @returns {Task[]}
     */
    sortByUpdatedDate(tasks) {
        return [...tasks].sort((a, b) => 
            new Date(b.updatedAt) - new Date(a.updatedAt)
        );
    },

    /**
     * Filters tasks by completion status
     * @param {Task[]} tasks 
     * @param {boolean} completed 
     * @returns {Task[]}
     */
    filterByStatus(tasks, completed) {
        return tasks.filter(task => task.completed === completed);
    },

    /**
     * Groups tasks by completion status
     * @param {Task[]} tasks 
     * @returns {object}
     */
    groupByStatus(tasks) {
        return {
            completed: tasks.filter(task => task.completed),
            incomplete: tasks.filter(task => !task.completed)
        };
    },

    /**
     * Searches tasks by text content
     * @param {Task[]} tasks 
     * @param {string} searchTerm 
     * @returns {Task[]}
     */
    searchByText(tasks, searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return tasks;
        
        return tasks.filter(task => 
            task.text.toLowerCase().includes(term)
        );
    }
};