/**
 * DOM manipulation utilities
 * Helper functions for common DOM operations
 */

export class DOMUtils {
    /**
     * Create an element with attributes and content
     * @param {string} tagName 
     * @param {object} attributes 
     * @param {string|Node|Array} content 
     * @returns {HTMLElement}
     */
    static createElement(tagName, attributes = {}, content = null) {
        const element = document.createElement(tagName);

        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className' || key === 'class') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('aria-') || key.startsWith('data-')) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        });

        // Set content
        if (content !== null) {
            if (Array.isArray(content)) {
                content.forEach(item => {
                    if (typeof item === 'string') {
                        element.appendChild(document.createTextNode(item));
                    } else if (item instanceof Node) {
                        element.appendChild(item);
                    }
                });
            } else if (typeof content === 'string') {
                element.textContent = content;
            } else if (content instanceof Node) {
                element.appendChild(content);
            }
        }

        return element;
    }

    /**
     * Safe query selector with error handling
     * @param {string} selector 
     * @param {Element} parent 
     * @returns {Element|null}
     */
    static querySelector(selector, parent = document) {
        try {
            return parent.querySelector(selector);
        } catch (error) {
            console.error(`Invalid selector: ${selector}`, error);
            return null;
        }
    }

    /**
     * Safe query selector all with error handling
     * @param {string} selector 
     * @param {Element} parent 
     * @returns {NodeList}
     */
    static querySelectorAll(selector, parent = document) {
        try {
            return parent.querySelectorAll(selector);
        } catch (error) {
            console.error(`Invalid selector: ${selector}`, error);
            return [];
        }
    }

    /**
     * Add event listener with automatic cleanup
     * @param {Element} element 
     * @param {string} event 
     * @param {Function} handler 
     * @param {object} options 
     * @returns {Function} Cleanup function
     */
    static addEventListener(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
        
        // Return cleanup function
        return () => {
            element.removeEventListener(event, handler, options);
        };
    }

    /**
     * Toggle CSS classes on an element
     * @param {Element} element 
     * @param {string|Array} classes 
     * @param {boolean} force 
     */
    static toggleClass(element, classes, force = undefined) {
        const classList = Array.isArray(classes) ? classes : [classes];
        classList.forEach(className => {
            element.classList.toggle(className, force);
        });
    }

    /**
     * Remove element with optional animation
     * @param {Element} element 
     * @param {string} animationClass 
     * @param {number} delay 
     * @returns {Promise}
     */
    static removeElement(element, animationClass = null, delay = 300) {
        return new Promise(resolve => {
            if (animationClass) {
                element.classList.add(animationClass);
                setTimeout(() => {
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                    resolve();
                }, delay);
            } else {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
                resolve();
            }
        });
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text 
     * @returns {string}
     */
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Debounce function calls
     * @param {Function} func 
     * @param {number} wait 
     * @param {boolean} immediate 
     * @returns {Function}
     */
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    /**
     * Throttle function calls
     * @param {Function} func 
     * @param {number} limit 
     * @returns {Function}
     */
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Get element position relative to viewport
     * @param {Element} element 
     * @returns {object}
     */
    static getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            bottom: rect.bottom,
            right: rect.right,
            width: rect.width,
            height: rect.height,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2
        };
    }

    /**
     * Check if element is visible in viewport
     * @param {Element} element 
     * @param {number} threshold 
     * @returns {boolean}
     */
    static isElementVisible(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        const verticalVisible = rect.top + threshold < windowHeight && rect.bottom - threshold > 0;
        const horizontalVisible = rect.left + threshold < windowWidth && rect.right - threshold > 0;

        return verticalVisible && horizontalVisible;
    }

    /**
     * Animate element with CSS transitions
     * @param {Element} element 
     * @param {object} properties 
     * @param {number} duration 
     * @returns {Promise}
     */
    static animate(element, properties, duration = 300) {
        return new Promise(resolve => {
            const originalTransition = element.style.transition;
            element.style.transition = `all ${duration}ms ease`;

            Object.entries(properties).forEach(([property, value]) => {
                element.style[property] = value;
            });

            setTimeout(() => {
                element.style.transition = originalTransition;
                resolve();
            }, duration);
        });
    }

    /**
     * Create and show a toast notification
     * @param {string} message 
     * @param {string} type 
     * @param {number} duration 
     */
    static showToast(message, type = 'info', duration = 3000) {
        const toast = this.createElement('div', {
            className: `toast toast-${type}`,
            style: 'position: fixed; top: 20px; right: 20px; padding: 15px; border-radius: 5px; z-index: 1000; opacity: 0; transition: opacity 0.3s ease;'
        }, message);

        // Set colors based on type
        const colors = {
            info: { bg: '#3498db', text: 'white' },
            success: { bg: '#2ecc71', text: 'white' },
            warning: { bg: '#f39c12', text: 'white' },
            error: { bg: '#e74c3c', text: 'white' }
        };

        const color = colors[type] || colors.info;
        toast.style.backgroundColor = color.bg;
        toast.style.color = color.text;

        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });

        // Auto remove
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
}

/**
 * Event management helper
 */
export class EventManager {
    constructor() {
        this.listeners = new Map();
    }

    /**
     * Add event listener with automatic tracking
     * @param {Element} element 
     * @param {string} event 
     * @param {Function} handler 
     * @param {object} options 
     */
    add(element, event, handler, options = {}) {
        const key = `${element.tagName}-${event}-${Date.now()}`;
        element.addEventListener(event, handler, options);
        
        this.listeners.set(key, {
            element,
            event,
            handler,
            options
        });

        return key;
    }

    /**
     * Remove specific event listener
     * @param {string} key 
     */
    remove(key) {
        const listener = this.listeners.get(key);
        if (listener) {
            listener.element.removeEventListener(
                listener.event,
                listener.handler,
                listener.options
            );
            this.listeners.delete(key);
        }
    }

    /**
     * Remove all event listeners
     */
    removeAll() {
        this.listeners.forEach((listener, key) => {
            listener.element.removeEventListener(
                listener.event,
                listener.handler,
                listener.options
            );
        });
        this.listeners.clear();
    }

    /**
     * Get number of active listeners
     * @returns {number}
     */
    size() {
        return this.listeners.size;
    }
}