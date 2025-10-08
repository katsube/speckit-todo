# SpecKit Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-07

## Active Technologies
- JavaScript ES6+ with HTML5/CSS3 (001-todo-todo)
- LocalStorage (001-todo-todo)

## Project Structure
```
src/
├── models/
├── services/
├── components/
└── app.js

tests/
├── unit/
├── integration/
└── e2e/

index.html
styles/
└── app.css
```

## Commands
# Vanilla JavaScript development
npx serve .
npm test
npm run cy:open

## Code Style
JavaScript ES6+: Follow standard conventions
- Use const/let instead of var
- Arrow functions for callbacks
- Template literals for strings
- Destructuring for object/array access
- Modern DOM APIs (querySelector, addEventListener)

## Recent Changes
- 001-todo-todo: Added JavaScript ES6+ + LocalStorage

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->