---
description: "Task list template for feature implementation"
---

# Tasks: ToDoリスト機能

**Input**: Design documents from `/specs/001-todo-todo/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, quickstart.md

**Tests**: Tests are included following TDD approach as required by constitution

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- Paths below follow single project structure as defined in plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create HTML entry point at index.html
- [x] T002 [P] Create CSS stylesheet at styles/app.css
- [x] T003 [P] Create main application script at src/app.js
- [x] T004 [P] Setup Jest testing configuration
- [x] T005 [P] Create storage service at src/services/storageService.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create Task model at src/models/task.js
- [x] T007 Create task service at src/services/taskService.js
- [x] T008 Setup basic DOM manipulation utilities
- [x] T009 Configure LocalStorage initialization in src/app.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - タスク追加機能 (Priority: P1) 🎯 MVP

**Goal**: ユーザーが新しいタスクをToDoリストに追加できる基本機能

**Independent Test**: タスク入力→Enter→リスト表示で完全にテスト可能

### Tests for User Story 1 ⚠️

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Unit test for task creation in tests/unit/models/task.test.js
- [ ] T011 [P] [US1] Unit test for task service add method in tests/unit/services/taskService.test.js
- [ ] T012 [P] [US1] Integration test for task input component in tests/integration/taskInput.test.js

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create task input component at src/components/taskInput.js
- [ ] T014 [P] [US1] Create task list component at src/components/taskList.js
- [ ] T015 [US1] Implement task addition logic in taskService.js (depends on T013, T014)
- [ ] T016 [US1] Add task input form to index.html
- [ ] T017 [US1] Style task input and list in styles/app.css
- [ ] T018 [US1] Wire up task addition event handlers in src/app.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - タスク完了チェック機能 (Priority: P2)

**Goal**: ユーザーがタスクを完了済みとしてマークし、視覚的に区別できる

**Independent Test**: タスククリック→完了状態変化→LocalStorage保存で独立テスト可能

### Tests for User Story 2 ⚠️

- [ ] T019 [P] [US2] Unit test for task completion toggle in tests/unit/models/task.test.js
- [ ] T020 [P] [US2] Unit test for task update service in tests/unit/services/taskService.test.js
- [ ] T021 [P] [US2] Integration test for completion toggle in tests/integration/taskCompletion.test.js

### Implementation for User Story 2

- [ ] T022 [P] [US2] Create task item component at src/components/taskItem.js
- [ ] T023 [US2] Add completion toggle method to taskService.js
- [ ] T024 [US2] Implement task completion styling in styles/app.css
- [ ] T025 [US2] Add click event handlers for task completion in taskItem.js
- [ ] T026 [US2] Update task list component to use taskItem component

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - タスク削除機能 (Priority: P3)

**Goal**: ユーザーが不要なタスクをリストから削除できる

**Independent Test**: 削除ボタンクリック→タスク削除→LocalStorage更新で独立テスト可能

### Tests for User Story 3 ⚠️

- [ ] T027 [P] [US3] Unit test for task deletion in tests/unit/services/taskService.test.js
- [ ] T028 [P] [US3] Integration test for delete functionality in tests/integration/taskDeletion.test.js

### Implementation for User Story 3

- [ ] T029 [P] [US3] Add delete method to taskService.js
- [ ] T030 [US3] Add delete button to task item component in taskItem.js
- [ ] T031 [US3] Style delete button in styles/app.css
- [ ] T032 [US3] Implement delete confirmation (optional) in taskItem.js

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T033 [P] Add responsive design styles in styles/app.css
- [ ] T034 [P] Add accessibility attributes (ARIA labels, keyboard navigation)
- [ ] T035 [P] Add error handling for LocalStorage failures
- [ ] T036 [P] Add task counter and statistics display
- [ ] T037 [P] Optimize performance for large task lists (虚仮化)
- [ ] T038 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses taskItem component but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Extends taskItem component but independently testable

### Within Each User Story

- Tests (included) MUST be written and FAIL before implementation
- Components before services integration
- Services before UI wiring
- Core implementation before styling
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2  
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests written FIRST following TDD (constitutional requirement)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence