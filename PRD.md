# Aprende a Leer — PRD

## Overview

A Spanish literacy learning app for children and families. Uses word games (drag-and-drop, accentuation, syllable puzzles, crosswords) to build vocabulary and language skills through structured progression — chapters → lessons → exercises. Duolingo-like linear progression with engaging visuals, colorful characters, and rewarding feedback.

## Target Platform

Local development with Quasar CLI + Vite. Deploy as SPA or PWA.

## Tech Stack

- **Frontend:** Quasar v2.19.3 + Vue 3 Composition API (ESM)
- **State Management:** Pinia
- **Bundler:** Vite (Quasar CLI)
- **Database:** Not in scope for MVP — exercises defined as JSON/data files
- **Animation:** Vue transitions + CSS animations
- **Drag & Drop:** HTML5 Drag and Drop API (custom composable) or `vuedraggable` (vue-draggable-next)
- **Testing:** Vitest + Vue Test Utils (optional, Phase 6)

## Success Metrics

| Metric | Target | When |
|--------|--------|------|
| Exercise load time | < 500ms | Phase 5 |
| Drag-and-drop response | < 100ms (no lag) | Phase 3 |
| Lesson completion tracking | 100% accurate | Phase 4 |
| Test coverage (unit) | > 70% | Phase 6 |
| Cross-browser | Chrome, Firefox, Safari, Edge | Phase 6 |
| No console errors | 0 in production | Phase 6 |

## Timeline (Suggested)

- **MVP (Phases 1–6):** ~2-3 weeks part-time
- **Crossword & extras:** After MVP validation

---

## Phases

### Phase 1: Project Scaffold & Data Layer

**Dependencies:** None

**Objective:** Initialize Quasar v2 project, define data models for chapters/lessons/exercises, create seed data files.

**Requirements:**

1. Scaffold Quasar v2 project with Vite, Vue 3 Composition API, Pinia
2. Define TypeScript interfaces for data models:
   - `Chapter` (id, title, description, order, icon)
   - `Lesson` (id, chapterId, title, order, exerciseIds)
   - `Exercise` (id, lessonId, type, instructions, config, correctAnswer)
   - `ExerciseType` enum: `dragAndDrop`, `fixGrammar`, `fixAccentuation`, `crossword`, `syllableGame`
   - `Progress` (userId | null, exerciseId, completed, score, lastAttemptedAt)
3. Create seed JSON files: `chapters.json`, `lessons.json`, `exercises.json` with sample data (2 chapters, 2 lessons each, 2-3 exercises each)
4. Set up Pinia store: `useGameStore` with state for current chapter/lesson/exercise, progress map
5. Set up router with routes: `/` (home), `/chapters` (chapter list), `/chapters/:chapterId/lessons` (lesson list), `/lesson/:lessonId/exercise/:exerciseId`

**Non-goals:**

- Do not implement exercise gameplay yet
- Do not implement user authentication
- Do not build UI components beyond routing scaffold
- Do not build progress persistence (localStorage not yet)

**Acceptance Criteria:**

- [ ] `npm run dev` starts with no errors
- [ ] `/` renders "Aprende a Leer" placeholder
- [ ] `/chapters` renders list of 2 chapters from seed data
- [ ] Navigating to a chapter shows its lessons
- [ ] Pinia store loads seed data correctly
- [ ] TypeScript interfaces compile cleanly

**Checkpoint:** `Create checkpoint: "Phase 1 — Scaffold & Data Layer"`

---

### Phase 2: Home Page & Navigation UI

**Dependencies:** Phase 1

**Objective:** Build the home page with app branding, character introduction, and navigation to chapter/lesson selection. Duolingo-like style.

**Requirements:**

1. **App layout:** Quasar `q-layout` with header (app title, logo), main content area
2. **Home page:** Animated splash with app name "Aprende a Leer", friendly mascot character (plain SVG or emoji/icon), "Comenzar" button → navigates to chapter list
3. **Chapter list page:** Grid of chapter cards. Each card shows: icon, title, description, progress bar (0%). Completed chapters show checkmark.
4. **Lesson list page:** Horizontal/timeline view of lessons in a chapter. Completed lessons green, current lesson highlighted, locked lessons gray.
5. **Header back button** on all sub-pages (chapters, lessons, exercise)
6. **Responsive:** grid adapts from 1 column (mobile) to 2 columns (tablet) to 4 columns (desktop) using Quasar grid

**DO NOT CHANGE:**

- Data models from Phase 1
- Pinia store structure
- Router structure
- Seed data files

**Non-goals:**

- Do not implement exercise gameplay
- Do not implement progress save/load
- Do not implement animations beyond basic CSS transitions

**Technical Details:**

- Use Quasar `q-page`, `q-card`, `q-list`, `q-item` components
- Colors: bright palette (greens, blues, oranges, purples) — child-friendly
- Typography: large, rounded font family
- Mascot: villager child character with yellow-and-red-striped hat, drawn as simple SVG or inline vector illustration

**Acceptance Criteria:**

- [ ] Home page loads with title and mascot
- [ ] "Comenzar" navigates to `/chapters`
- [ ] Chapter cards show with progress bars at 0%
- [ ] Clicking a chapter navigates to its lesson list
- [ ] Lesson list shows status (completed/current/locked)
- [ ] Back buttons work on all pages
- [ ] Layout responsive at 3 breakpoints
- [ ] No console errors

**Checkpoint:** `Create checkpoint: "Phase 2 — Home & Navigation"`

---

### Phase 3: Exercise Engine — Drag & Drop

**Dependencies:** Phase 2

**Objective:** Build the core exercise player framework and implement drag-and-drop word exercises (first exercise type).

**Requirements:**

1. **Exercise player scaffold:**
   - Layout: instructions header, main play area (q-card), progress dots for multi-part exercises, submit button
   - Fetches exercise config from seed data via Pinia
   - Tracks current exercise state (answered, correct/incorrect)
   - Shows immediate feedback: correct (green flash + 🎉) / incorrect (red shake + try again)
   - "Siguiente" button after correct answer → next exercise in lesson
2. **Drag & drop exercise type:**
   - Display scrambled words at bottom (draggable "word chips" using `q-chip`)
   - Display target sentence slots at top (drop zones)
   - User drags words into correct order to form sentence
   - Visual feedback: drag ghost follows cursor, drop zone highlights on dragover
   - Validate order against `correctAnswer` array
3. **Exercise config schema:**
   - `type: "dragAndDrop"`
   - `instructions: "Arrastra las palabras para formar la oración"` (string)
   - `wordBank: string[]` — scrambled words
   - `correctAnswer: string[]` — correct order
   - `slots: number` — number of drop zones
4. **Scroll / pagination:** if exercise has multiple parts (e.g., 3 sentences), show one at a time with step indicator

**DO NOT CHANGE:**

- Navigation and page layouts from Phase 2
- Data models and seed data structure from Phase 1
- Pinia store base structure
- Router

**Non-goals:**

- Do not implement other exercise types yet
- Do not implement progress persistence
- Do not implement audio/pronunciation
- Do not implement scoring/points system

**Technical Details:**

- Custom composable: `useDragAndDrop()` — reusable for future exercise types
- Use native HTML5 DnD API: `dragstart`, `dragover`, `drop`, `dragend` events
- Touch support via `@touchstart` / `@touchmove` / `@touchend` polyfill or `vue-draggable-next`
- Difficulty levels reflected in word count (easy: 3-4 words, medium: 5-7 words)

**Acceptance Criteria:**

- [ ] Exercise player loads with instructions and drag area
- [ ] Word chips are draggable and follow cursor/finger
- [ ] Drop zones highlight when hovering with a word
- [ ] Words snap into drop zones on drop
- [ ] Submitted wrong order shows error feedback (no advance)
- [ ] Submitted correct order shows success feedback → enables "Siguiente"
- [ ] "Siguiente" loads next exercise
- [ ] After last exercise in lesson, shows "Lección completa!" screen with next lesson suggestion
- [ ] Works on mobile touch
- [ ] Works on desktop mouse

**Checkpoint:** `Create checkpoint: "Phase 3 — Drag & Drop Engine"`

---

### Phase 4: Progress & Progression System

**Dependencies:** Phase 3

**Objective:** Implement lesson completion tracking, progress persistence (localStorage), and linear chapter/lesson unlocking.

**Requirements:**

1. **Progress persistence:**
   - Save progress to `localStorage` after each completed exercise
   - Key: `aprendealeer_progress`, value: JSON object `{ "lesson-1": { completed: true, score: 80, exercises: {...} } }`
   - Load progress on app mount
2. **Lesson unlocking rules:**
   - First lesson of first chapter: always unlocked
   - Subsequent lessons: unlocked when previous lesson completed (score ≥ 60%)
   - Subsequent chapters: unlocked when all lessons in previous chapter completed
   - Locked lessons: show lock icon, not clickable, message "Completa la lección anterior"
3. **Progress bar:**
   - Chapter progress = lessons completed / total lessons in chapter × 100%
   - Overall progress = chapters completed / total chapters × 100% (shown on home page)
4. **Stars/score per exercise:**
   - 1 star if correct on 2nd+ attempt
   - 2 stars if correct on 1st attempt
   - 3 stars if correct on 1st attempt AND no hints used (future phase)
   - Show stars on lesson completion screen
5. **Lesson summary screen:**
   - After last exercise in lesson: modal/page showing stars earned, next lesson button, "Repetir" button

**DO NOT CHANGE:**

- Drag & drop exercise logic from Phase 3
- Data models from Phase 1
- Router
- Navigation UI from Phase 2

**Non-goals:**

- Do not implement user accounts/multi-user
- Do not implement server sync
- Do not implement streak tracking
- Do not implement XP/level system

**Acceptance Criteria:**

- [ ] Completing an exercise saves to localStorage
- [ ] Reloading page restores progress state from localStorage
- [ ] Lesson unlocks when previous lesson completed
- [ ] Chapter unlocks when all previous chapter lessons done
- [ ] Locked lessons display lock and are not clickable
- [ ] Progress bar updates correctly after each lesson
- [ ] Lesson summary shows correct stars
- [ ] "Repetir" resets lesson progress and reopens exercise 1
- [ ] All prior phases functionality still works

**Checkpoint:** `Create checkpoint: "Phase 4 — Progress System"`

---

### Phase 5: Additional Exercise Types

**Dependencies:** Phase 4

**Objective:** Implement fix-grammar, fix-accentuation, and syllable-game exercise types.

**Requirements:**

1. **Exercise type: `fixGrammar`**
   - Display a sentence with one word incorrect/highlighted
   - Provide 3-4 multiple-choice word options (q-option-group or q-btn-toggle)
   - User selects correct word to fix the sentence
   - Config: `incorrectWord`, `correctWord`, `sentenceParts` (array with highlighted position), `options: string[]`
   - Correct selection → green highlight → "Siguiente"

2. **Exercise type: `fixAccentuation`**
   - Display a word missing its accent mark (e.g., "arbol" → "árbol")
   - Show 2-3 versions: with accent on different letters, without accent
   - User taps/selects the correctly accented version
   - Config: `baseWord`, `correctAccent`, `options: string[]` (e.g., ["arbol", "árbol", "arból"])
   - Include brief rule explanation after correct answer: "Las palabras esdrújulas siempre llevan tilde"

3. **Exercise type: `syllableGame`**
   - Display a word split into syllables, scrambled
   - Drag syllables into correct order (reuse drag-and-drop composable)
   - Config: `word: string`, `syllables: string[]` (shuffled), `correctOrder: string[]`
   - Visual: colorful syllable blocks instead of word chips

4. **Seed data expansion:**
   - Add 3-4 exercises of each new type to existing lessons
   - Create one new chapter focused on accentuation

**DO NOT CHANGE:**

- Drag & drop composable (extend via options, not rewrite)
- Progress system from Phase 4
- Navigation/layout from Phase 2
- Data model interfaces from Phase 1

**Non-goals:**

- Do not implement crossword puzzle (stretch goal)
- Do not implement audio/pronunciation
- Do not implement timed challenges

**Acceptance Criteria:**

- [ ] `fixGrammar` exercises render and validate correctly
- [ ] `fixAccentuation` exercises render and provide rule explanation
- [ ] `syllableGame` exercises reuse drag-and-drop with syllable blocks
- [ ] All new exercise types save progress and unlock next lesson
- [ ] Seed data has at least 2 exercises of each new type
- [ ] All prior phases functionality still works

**Checkpoint:** `Create checkpoint: "Phase 5 — More Exercise Types"`

---

### Phase 6: Polish — Animations, Responsiveness, Accessibility

**Dependencies:** Phase 5

**Objective:** Add delight: animations, responsive polish, loading/error states, accessibility basics.

**Requirements:**

1. **Animations:**
   - Page transitions: slide-left/right between views (Vue `<Transition>`)
   - Correct answer: confetti effect (CSS or lightweight library) + bounce animation on success button
   - Incorrect answer: shake animation on the exercise card
   - Star earned: scale-up animation on lesson summary
   - Lesson unlock: glow/pulse effect on newly unlocked lesson
2. **Loading & error states:**
   - Skeleton loaders for chapter/lesson lists (q-skeleton)
   - Error boundary: if seed data missing, show friendly "Algo salió mal" with retry
   - Empty state: if no chapters/lessons, show "Pronto habrá más contenido"
3. **Accessibility basics:**
   - All interactive elements focusable and keyboard-navigable
   - Drag-and-drop: keyboard alternative (select word → use arrow keys → Enter to place)
   - Screen reader labels on icons and buttons
   - Color contrast: ensure text/background contrast ≥ 4.5:1
4. **Responsive polish:**
   - Touch targets minimum 44×44px on mobile
   - Drag handles visible on touch devices
   - Exercise area fills viewport height on small screens

**DO NOT CHANGE:**

- Exercise logic from Phases 3-5
- Progress system from Phase 4
- Data models from Phase 1
- Navigation structure from Phase 2

**Non-goals:**

- Do not implement user accounts
- Do not implement multiplayer
- Do not implement analytics
- Do not implement crossword (stretch)

**Acceptance Criteria:**

- [ ] Page transitions animate smoothly
- [ ] Correct/incorrect feedback has visual animations
- [ ] Confetti or celebration effect on lesson complete
- [ ] Skeleton loaders display during data fetch (even from local)
- [ ] Interactive elements are keyboard-accessible
- [ ] Drag-and-drop works with keyboard alternative
- [ ] Touch targets ≥ 44px on mobile
- [ ] No console errors or broken styles at 320px–1920px
- [ ] All prior phases functionality still works

**Checkpoint:** `Create checkpoint: "Phase 6 — Polish"`

---

### Phase 7: Crossword Exercise Type (Stretch)

**Dependencies:** Phase 5

**Objective:** Implement crossword puzzle exercise type for vocabulary building.

**Requirements:**

1. **Crossword grid:**
   - Generate grid from word list with intersecting letters
   - Display as CSS grid of cells (q-card squares)
   - Numbered cells indicate clue start
   - User taps cell → shows keyboard row below grid → tap letters to fill
2. **Crossword clues:**
   - Across clues and Down clues listed beside grid
   - Each clue is a definition or image hint in Spanish
3. **Validation:**
   - Check each word when user submits (or auto-check on cell completion)
   - Correct letters: green highlight, wrong letters: red
   - All correct → celebration animation
4. **Config:**
   - `type: "crossword"`
   - `words: [{ word, clue, row, col, direction }]`
   - `grid: { rows, cols }`

**DO NOT CHANGE:**

- All prior phase functionality
- Data models (extend ExerciseType enum)
- Progress system
- Navigation/layout

**Non-goals:**

- Do not implement dynamic crossword grid generation (pre-defined only for MVP)
- Do not implement multiplayer crosswords

**Acceptance Criteria:**

- [ ] Crossword grid renders with correct dimensions
- [ ] Tapping a cell highlights it and shows letter input
- [ ] Entering correct letters shows green feedback
- [ ] Completing all words shows success animation
- [ ] Progress saved correctly
- [ ] All prior phases functionality still works

**Checkpoint:** `Create checkpoint: "Phase 7 — Crossword"`

---

## Stretch Goals (Post-MVP)

- User accounts with multi-child profiles
- Server sync (Firebase or Supabase)
- Audio pronunciation (Web Speech API)
- XP / leveling / streak system (gamification)
- Parent dashboard with progress reports
- Story mode: narrative chapters with illustrated stories
- Custom exercise creator for parents/teachers
- PWA: offline support via service worker
- Dark mode
- i18n: English UI for English-speaking parents

## DO NOT CHANGE (Global)

- Database schema / data models once defined (Phase 1)
- Router structure once defined (Phase 1)
- Pinia store patterns
- Exercise validation logic once implemented
- Progress persistence format (Phase 4)
- Quasar v2 + Vue 3 framework choice
