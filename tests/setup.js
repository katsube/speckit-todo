// Jest setup file
// DOM環境の初期化とグローバルヘルパーの設定

// LocalStorageのモック
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// alertのモック
global.alert = jest.fn();

// consoleのモック（テスト中の冗長なログを抑制）
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// テスト用ヘルパー関数
global.createMockTask = (overrides = {}) => ({
  id: 'test-task-' + Date.now(),
  text: 'テストタスク',
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// DOM要素作成ヘルパー
global.createTestContainer = () => {
  const container = document.createElement('div');
  container.id = 'test-container';
  document.body.appendChild(container);
  return container;
};

// クリーンアップヘルパー
global.cleanup = () => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
  localStorage.clear();
};