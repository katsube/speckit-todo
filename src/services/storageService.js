/**
 * LocalStorage abstraction service
 * LocalStorageの操作を抽象化し、エラーハンドリングと型安全性を提供
 */

export class StorageService {
    constructor(keyPrefix = 'todo-app') {
        this.keyPrefix = keyPrefix;
        this.isAvailable = this.checkStorageAvailability();
        
        if (!this.isAvailable) {
            console.warn('LocalStorage is not available. Using in-memory storage.');
            this.memoryStorage = new Map();
        }
    }

    /**
     * LocalStorageの利用可能性をチェック
     * @returns {boolean}
     */
    checkStorageAvailability() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * キーにプレフィックスを付加
     * @param {string} key 
     * @returns {string}
     */
    getFullKey(key) {
        return `${this.keyPrefix}-${key}`;
    }

    /**
     * データを保存
     * @param {string} key 
     * @param {any} value 
     * @throws {StorageError}
     */
    setItem(key, value) {
        try {
            const fullKey = this.getFullKey(key);
            const serializedValue = JSON.stringify(value);

            if (this.isAvailable) {
                localStorage.setItem(fullKey, serializedValue);
            } else {
                this.memoryStorage.set(fullKey, serializedValue);
            }
        } catch (error) {
            throw new StorageError(`Failed to save data for key "${key}": ${error.message}`);
        }
    }

    /**
     * データを取得
     * @param {string} key 
     * @param {any} defaultValue 
     * @returns {any}
     * @throws {StorageError}
     */
    getItem(key, defaultValue = null) {
        try {
            const fullKey = this.getFullKey(key);
            let serializedValue;

            if (this.isAvailable) {
                serializedValue = localStorage.getItem(fullKey);
            } else {
                serializedValue = this.memoryStorage.get(fullKey);
            }

            if (serializedValue === null || serializedValue === undefined) {
                return defaultValue;
            }

            return JSON.parse(serializedValue);
        } catch (error) {
            console.error(`Failed to retrieve data for key "${key}":`, error);
            return defaultValue;
        }
    }

    /**
     * データを削除
     * @param {string} key 
     */
    removeItem(key) {
        try {
            const fullKey = this.getFullKey(key);

            if (this.isAvailable) {
                localStorage.removeItem(fullKey);
            } else {
                this.memoryStorage.delete(fullKey);
            }
        } catch (error) {
            console.error(`Failed to remove data for key "${key}":`, error);
        }
    }

    /**
     * 全てのデータをクリア
     */
    clear() {
        try {
            if (this.isAvailable) {
                // プレフィックスが一致するキーのみを削除
                const keys = Object.keys(localStorage);
                const prefixedKeys = keys.filter(key => key.startsWith(this.keyPrefix));
                
                prefixedKeys.forEach(key => {
                    localStorage.removeItem(key);
                });
            } else {
                this.memoryStorage.clear();
            }
        } catch (error) {
            console.error('Failed to clear storage:', error);
        }
    }

    /**
     * ストレージのサイズを取得（概算）
     * @returns {number} バイト数
     */
    getStorageSize() {
        if (!this.isAvailable) {
            // メモリストレージのサイズ計算
            let size = 0;
            for (const [key, value] of this.memoryStorage) {
                size += key.length + value.length;
            }
            return size * 2; // Unicode文字は2バイト
        }

        let size = 0;
        try {
            const keys = Object.keys(localStorage);
            const prefixedKeys = keys.filter(key => key.startsWith(this.keyPrefix));
            
            prefixedKeys.forEach(key => {
                const value = localStorage.getItem(key) || '';
                size += key.length + value.length;
            });
        } catch (error) {
            console.error('Failed to calculate storage size:', error);
        }

        return size * 2; // Unicode文字は2バイト
    }

    /**
     * ストレージの使用状況を取得
     * @returns {object}
     */
    getStorageInfo() {
        return {
            isAvailable: this.isAvailable,
            size: this.getStorageSize(),
            type: this.isAvailable ? 'localStorage' : 'memory'
        };
    }
}

/**
 * ストレージ操作エラー
 */
export class StorageError extends Error {
    constructor(message) {
        super(message);
        this.name = 'StorageError';
    }
}

// シングルトンインスタンスをエクスポート
export const storageService = new StorageService();