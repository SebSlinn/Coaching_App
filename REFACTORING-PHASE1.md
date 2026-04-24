# Phase 1: Frontend Modularization - Migration Guide

## What Was Done

### 1. **Extracted Business Logic** ✅

#### **`src/lib/zones/suggestions.js`**
- Extracted `suggestTimes()` function - generates zone time recommendations
- Extracted `suggestAllZones()` - batch suggest all zones
- Pure functions, no React dependency, fully testable

#### **`src/lib/sessions/builders.js`**
Session building utilities extracted:
- `generateId()` - unique ID generation
- `createLine()`, `createBlock()` - factories for data structures
- `calculateBlockVolume()`, `calculateBlockTotalTime()` - metrics
- `calculateGroupVolume()`, `calculateGroupTime()` - aggregation
- `flattenSession()` - flatten nested session to linear array
- `bracketLines()`, `deleteChild()`, `updateChild()` - mutations

### 2. **Created Shared Styles** ✅

#### **`src/styles/theme.js`**
Centralized design tokens:
- Color palette (zones, text, backgrounds)
- Button, input, card, section base styles
- Helper functions: `getInputStyle()`, `getButtonStyle()`
- **Benefit**: Single source of truth for styling

### 3. **Created Custom Hooks** ✅

#### **`src/hooks/useClassifier.js`**
State management for Classifier tab:
- Input management (`inputs`, `updateInput`)
- Results (`singleResult`, `seqResult`)
- View state (`resultView`, `selectedZone`)
- Memoized suggestions computation

#### **`src/hooks/useSessionBuilder.js`**
State management for Set Builder tab:
- Session data and mutations
- Group/block operations
- Selection state (`lineSelectMode`, `selectedLines`)
- Pool display preference

#### **`src/hooks/useAthleteSetup.js`**
State management for Athlete Setup tab:
- Athlete identity fields
- Parse results and logs
- Active athlete + derived profile

### 4. **Created Screen Components** ✅

#### **`src/screens/ClassifierScreen.jsx`**
- Placeholder for classifier UI
- Uses `useClassifier()` hook
- Ready for incrementally adding UI from App.jsx

#### **`src/screens/AthleteSetupScreen.jsx`**
- Placeholder for athlete setup UI
- Uses `useAthleteSetup()` hook

#### **`src/screens/SetBuilderScreen.jsx`**
- Placeholder for set builder UI
- Uses `useSessionBuilder()` hook

### 5. **Refactored App.jsx** ✅

#### **`src/App-refactored.jsx`** (new)
- **Now 120 lines** (was 2900)
- Tab navigation logic only
- Header and global styles
- Imports screens and theme
- Ready to replace old App.jsx

**Old App.jsx**: 2900 lines (monolithic)
**New modular structure**:
- App.jsx: 120 lines (container/router)
- ClassifierScreen: isolated UI
- AthleteSetupScreen: isolated UI
- SetBuilderScreen: isolated UI
- Business logic in `src/lib/`

## Project Structure

```
src/
├── lib/
│   ├── zones/
│   │   ├── suggestions.js     (zone time suggestions)
│   │   └── index.js           (exports)
│   ├── sessions/
│   │   ├── builders.js        (session building utilities)
│   │   └── index.js           (exports)
│   └── athletes/              (TODO: athlete parsing logic)
│
├── hooks/
│   ├── useClassifier.js       (classifier state)
│   ├── useSessionBuilder.js   (builder state)
│   ├── useAthleteSetup.js     (setup state)
│   └── index.js               (exports)
│
├── screens/
│   ├── ClassifierScreen.jsx   (classifier tab)
│   ├── AthleteSetupScreen.jsx (setup tab)
│   ├── SetBuilderScreen.jsx   (builder tab)
│   └── index.js               (exports)
│
├── styles/
│   └── theme.js               (design tokens)
│
├── components/                (existing, reusable UI)
├── zones/                     (existing core logic)
├── athlete/                   (existing athlete logic)
├── session/                   (existing session logic)
├── drills/                    (existing drill library)
│
├── App-refactored.jsx         (new modular App)
├── App.jsx                    (old, still working)
└── main.jsx
```

## Next Steps

### To Activate New App Structure:

1. **Option A**: Rename then replace
   ```bash
   mv src/App.jsx src/App-old.jsx
   mv src/App-refactored.jsx src/App.jsx
   npm run dev
   ```

2. **Option B**: Keep old, switch via main.jsx
   ```javascript
   // main.jsx
   // import App from './App.jsx';        // old
   import App from './App-refactored.jsx'; // new
   ```

### Phase 1B: Migrate UI (Recommended Next)

Move UI from App.jsx into screens incrementally:

**ClassifierScreen.jsx** (most complex)
- Inputs section
- Results section (with 3 views: energy, zones, adaptations)
- Print/export features

**AthleteSetupScreen.jsx** (medium)
- Athlete upload/parsing
- Profile editor

**SetBuilderScreen.jsx** (medium)
- Session editor UI
- Block composer

### Phase 2: Backend Integration

Once screens are stable, add API layer:

```javascript
// api/zoneClient.js
export async function classifySet(params) {
  const res = await fetch('/api/zones/classify', { method: 'POST', body: JSON.stringify(params) });
  return res.json();
}

// api/sessionClient.js
export async function saveSession(session) {
  const res = await fetch('/api/sessions', { method: 'POST', body: JSON.stringify(session) });
  return res.json();
}
```

### Phase 3: Responsive UI

Use React hooks + CSS media queries for mobile:
- Sidebar drawer on mobile
- Modal dialogs instead of inline forms
- Collapsible sections

## Benefits of This Architecture

✅ **Testability**: Business logic isolated, easy unit tests
✅ **Reusability**: Hooks can be used in multiple screens
✅ **Maintainability**: Clear separation of concerns
✅ **Team Ready**: Easier for others to understand
✅ **Scalability**: Easy to add backend later
✅ **Modularity**: Screens can evolve independently
✅ **Styling**: Consistent design tokens across app

## Files Created

| File | Lines | Purpose |
|------|-------|---------|
| lib/zones/suggestions.js | 75 | Zone suggestion logic |
| lib/sessions/builders.js | 150 | Session operations |
| styles/theme.js | 90 | Design tokens |
| hooks/useClassifier.js | 40 | Classifier state |
| hooks/useSessionBuilder.js | 110 | Builder state |
| hooks/useAthleteSetup.js | 30 | Setup state |
| screens/ClassifierScreen.jsx | 30 | Classifier UI (stub) |
| screens/AthleteSetupScreen.jsx | 30 | Setup UI (stub) |
| screens/SetBuilderScreen.jsx | 30 | Builder UI (stub) |
| App-refactored.jsx | 120 | New modular App |
| **TOTAL** | **705** | **Previously: 2900 in App.jsx** |

## How to Test

```bash
# Build should still succeed
npm run build

# App still works (old App.jsx)
npm run dev

# To switch to new structure:
mv src/App.jsx src/App-old.jsx
mv src/App-refactored.jsx src/App.jsx
npm run dev  # Should load placeholders for each screen
```

## Current Status

✅ Phase 1A Complete: Modularization structure ready
⏳ Phase 1B Next: Migrate UI from App.jsx to screens
⏳ Phase 2: Backend integration
⏳ Phase 3: Responsive UI & mobile optimization
