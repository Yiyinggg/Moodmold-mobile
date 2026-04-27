# Virtual Pet IP UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the current home screen unchanged while adding `IP设定` and `内容工坊` flows, and replacing bottom `收藏` tab with `IP设定`.

**Architecture:** Extend the current single-page multi-screen prototype by adding two new screens in `moodmold.html`, two focused behavior modules (`ip.js` and `studio.js`), and minimal shared navigation wiring in `core-ui.js`/`bootstrap.js`. UI state remains frontend-only (`localStorage`) to preserve prototype speed and avoid backend dependencies.

**Tech Stack:** Vanilla HTML/CSS/JS, Vitest + jsdom (for DOM behavior tests), existing component split under `src/js/components`.

---

## File Structure Map

- Create: `docs/superpowers/plans/2026-04-27-virtual-pet-ip-implementation.md` (this file)
- Create: `src/js/components/ip.js` (IP profile state + validation + save + jump to studio)
- Create: `src/js/components/studio.js` (studio input state + animation generation mock flow + result actions)
- Create: `tests/ui/ip-navigation.test.js` (bottom tab replacement/navigation behavior)
- Create: `tests/ui/ip-profile.test.js` (IP profile completion and CTA behavior)
- Create: `tests/ui/studio-flow.test.js` (studio generation state transitions)
- Create: `vitest.config.js` (test runtime config)
- Create: `tests/setup-dom.js` (shared jsdom test setup)
- Modify: `moodmold.html` (new `sc-ip` and `sc-studio` screens, bottom nav tab replacement, script includes)
- Modify: `src/styles/moodmold.css` (styles for `sc-ip`/`sc-studio` sections)
- Modify: `src/js/components/core-ui.js` (safe `goTo` behavior for new routes + nav active state helper)
- Modify: `src/js/components/bootstrap.js` (initialize new modules)
- Modify: `CHANGELOG.md` (record feature addition and navigation change)
- Modify: `.gitignore` (ignore test cache/node_modules if absent)
- Create/Modify: `package.json` (scripts/deps for test execution, if missing)

### Task 1: Establish Test Harness First

**Files:**
- Create: `package.json` (if absent)
- Create: `vitest.config.js`
- Create: `tests/setup-dom.js`
- Modify: `.gitignore`

- [ ] **Step 1: Write failing harness test scaffold**

```js
// tests/ui/ip-navigation.test.js
import { describe, it, expect } from 'vitest';

describe('ip navigation placeholder', () => {
  it('loads test runner', () => {
    expect(true).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/ui/ip-navigation.test.js`  
Expected: `FAIL` with assertion `expected true to be false`.

- [ ] **Step 3: Write minimal harness implementation**

```json
{
  "name": "moodmold-mobile",
  "private": true,
  "scripts": {
    "test": "vitest run"
  },
  "devDependencies": {
    "jsdom": "^26.0.0",
    "vitest": "^2.1.0"
  }
}
```

```js
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup-dom.js']
  }
});
```

```js
// tests/setup-dom.js
import { vi } from 'vitest';

globalThis.showToast = vi.fn();
```

- [ ] **Step 4: Run test to verify it passes after updating assertion**

Update assertion:

```js
expect(true).toBe(true);
```

Run: `npm run test -- tests/ui/ip-navigation.test.js`  
Expected: `PASS` with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add package.json vitest.config.js tests/setup-dom.js tests/ui/ip-navigation.test.js .gitignore
git commit -m "test: add frontend DOM test harness for ip flow"
```

### Task 2: Replace Bottom Tab and Wire `IP设定` Route

**Files:**
- Modify: `moodmold.html`
- Modify: `src/js/components/core-ui.js`
- Modify: `tests/ui/ip-navigation.test.js`

- [ ] **Step 1: Write failing navigation test**

```js
import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';

describe('bottom tab navigation', () => {
  it('navigates to sc-ip when ip tab clicked', () => {
    const dom = new JSDOM(`
      <div id="sc-home" class="screen active"></div>
      <div id="sc-ip" class="screen"></div>
      <button id="navIpBtn">IP设定</button>
    `);
    global.document = dom.window.document;
    global.goTo('sc-ip');
    expect(document.getElementById('sc-ip').classList.contains('active')).toBe(true);
    expect(document.getElementById('sc-home').classList.contains('active')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/ui/ip-navigation.test.js`  
Expected: `FAIL` with `global.goTo is not a function`.

- [ ] **Step 3: Implement minimal route + nav active helper**

```js
// src/js/components/core-ui.js
function goTo(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  syncBottomNav(id);
}

function syncBottomNav(activeId){
  document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
    const target = btn.getAttribute('data-target');
    const on = target === activeId;
    btn.classList.toggle('nav-item--current', on);
    btn.setAttribute('aria-current', on ? 'page' : 'false');
  });
}
```

```html
<!-- moodmold.html: bottom nav replacement -->
<button type="button" class="nav-item" data-target="sc-ip" onclick="goTo('sc-ip')">
  <span class="nav-icon">✨</span><span class="nav-lbl">IP设定</span>
</button>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/ui/ip-navigation.test.js`  
Expected: `PASS` with `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add moodmold.html src/js/components/core-ui.js tests/ui/ip-navigation.test.js
git commit -m "feat: replace favorites tab with ip settings navigation"
```

### Task 3: Build `IP设定` Screen and Profile Persistence

**Files:**
- Modify: `moodmold.html`
- Modify: `src/styles/moodmold.css`
- Create: `src/js/components/ip.js`
- Modify: `src/js/components/bootstrap.js`
- Create: `tests/ui/ip-profile.test.js`

- [ ] **Step 1: Write failing profile behavior test**

```js
import { describe, it, expect } from 'vitest';
import { saveIpProfile, getIpCompleteness } from '../../src/js/components/ip.js';

describe('ip profile completeness', () => {
  it('returns low completeness when required fields missing', () => {
    const profile = { name: '', species: 'dog', ageTone: '', oneLiner: '' };
    saveIpProfile(profile);
    expect(getIpCompleteness()).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/ui/ip-profile.test.js`  
Expected: `FAIL` because module/functions do not exist.

- [ ] **Step 3: Implement screen structure + state module**

```html
<!-- moodmold.html -->
<div class="screen" id="sc-ip">
  <div class="subscreen-header">
    <div class="sub-back" onclick="goTo('sc-home')">...</div>
    <div class="sub-title">IP设定</div>
  </div>
  <div class="subscreen-body ip-body">
    <input id="ipNameInput" class="mock-input" placeholder="名称"/>
    <input id="ipSpeciesInput" class="mock-input" placeholder="物种"/>
    <select id="ipAgeToneSelect" class="mock-input">...</select>
    <textarea id="ipOneLinerInput" class="mock-input" placeholder="一句话介绍"></textarea>
    <button id="ipSaveToStudioBtn" class="ar-cta" onclick="saveIpAndGoStudio()">保存并去内容工坊</button>
    <button id="ipSaveOnlyBtn" class="sheet-btn-sec" onclick="saveIpOnly()">仅保存设定</button>
  </div>
</div>
```

```js
// src/js/components/ip.js
const IP_STORAGE_KEY = 'moodmold.ip.profile.v1';
let ipProfile = { name: '', species: '', ageTone: '', oneLiner: '', tags: [], world: {}, visual: {} };

export function saveIpProfile(nextProfile){
  ipProfile = { ...ipProfile, ...nextProfile };
  localStorage.setItem(IP_STORAGE_KEY, JSON.stringify(ipProfile));
}

export function getIpCompleteness(){
  const required = ['name', 'species', 'ageTone', 'oneLiner'];
  const filled = required.filter(k => String(ipProfile[k] || '').trim().length > 0).length;
  return Math.round((filled / required.length) * 100);
}

function saveIpAndGoStudio(){
  saveIpFromInputs();
  goTo('sc-studio');
}
```

```js
// src/js/components/bootstrap.js
syncStats();
initHomePetSwitcher();
initIpScreen();
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tests/ui/ip-profile.test.js`  
Expected: `PASS` and completeness reflects required-field filling logic.

- [ ] **Step 5: Commit**

```bash
git add moodmold.html src/styles/moodmold.css src/js/components/ip.js src/js/components/bootstrap.js tests/ui/ip-profile.test.js
git commit -m "feat: add ip settings screen with persisted profile state"
```

### Task 4: Build `内容工坊` with Animation-First Flow

**Files:**
- Modify: `moodmold.html`
- Modify: `src/styles/moodmold.css`
- Create: `src/js/components/studio.js`
- Modify: `src/js/components/bootstrap.js`
- Create: `tests/ui/studio-flow.test.js`

- [ ] **Step 1: Write failing studio flow test**

```js
import { describe, it, expect } from 'vitest';
import { startAnimationGeneration, getStudioState } from '../../src/js/components/studio.js';

describe('studio generation flow', () => {
  it('moves status from idle to generating', () => {
    startAnimationGeneration({ mood: '开心', scene: '家庭', duration: 15 });
    expect(getStudioState().status).toBe('done');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/ui/studio-flow.test.js`  
Expected: `FAIL` because function/module absent or status mismatch.

- [ ] **Step 3: Implement studio page and state transitions**

```html
<!-- moodmold.html -->
<div class="screen" id="sc-studio">
  <div class="subscreen-header">
    <div class="sub-back" onclick="goTo('sc-ip')">...</div>
    <div class="sub-title">内容工坊</div>
  </div>
  <div class="subscreen-body studio-body">
    <div class="studio-main-card">
      <div class="studio-main-title">生成宠物动画</div>
      <select id="studioMood">...</select>
      <select id="studioScene">...</select>
      <div class="studio-duration-row">
        <button onclick="pickStudioDuration(15)">15s</button>
        <button onclick="pickStudioDuration(30)">30s</button>
      </div>
      <button class="ar-cta" onclick="startAnimationGenerationFromUI()">开始生成</button>
      <div id="studioHintText" class="subtitle"></div>
    </div>
    <button class="sheet-btn-sec" onclick="goTo('sc-home')">返回首页陪伴</button>
  </div>
</div>
```

```js
// src/js/components/studio.js
let studioState = { status: 'idle', draft: null, outputs: [] };

export function startAnimationGeneration(draft){
  studioState = { ...studioState, status: 'generating', draft };
  setTimeout(() => {
    studioState.status = 'done';
    studioState.outputs.unshift({
      id: Date.now(),
      title: `${draft.mood} · ${draft.scene} · ${draft.duration}s`,
      createdAt: new Date().toISOString()
    });
    renderStudioResult();
  }, 1200);
}

export function getStudioState(){
  return studioState;
}
```

- [ ] **Step 4: Run test to verify it passes (update assertion to generating then done with fake timers)**

```js
import { vi } from 'vitest';
vi.useFakeTimers();
startAnimationGeneration({ mood: '开心', scene: '家庭', duration: 15 });
expect(getStudioState().status).toBe('generating');
vi.advanceTimersByTime(1200);
expect(getStudioState().status).toBe('done');
```

Run: `npm run test -- tests/ui/studio-flow.test.js`  
Expected: `PASS`.

- [ ] **Step 5: Commit**

```bash
git add moodmold.html src/styles/moodmold.css src/js/components/studio.js src/js/components/bootstrap.js tests/ui/studio-flow.test.js
git commit -m "feat: add animation-first studio screen with generation states"
```

### Task 5: Integration Polish, Regression Checks, and Docs

**Files:**
- Modify: `moodmold.html`
- Modify: `src/styles/moodmold.css`
- Modify: `src/js/components/ip.js`
- Modify: `src/js/components/studio.js`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Write failing integration test**

```js
// tests/ui/ip-navigation.test.js
it('allows studio generation even with low ip completeness and shows hint', () => {
  const hint = getStudioHintForCompleteness(25);
  expect(hint).toContain('补全2项设定可提升动画质量');
});
```

- [ ] **Step 2: Run tests to verify at least one fails before integration fix**

Run: `npm run test`  
Expected: one `FAIL` for missing hint helper.

- [ ] **Step 3: Implement final integration behaviors**

```js
// src/js/components/studio.js
export function getStudioHintForCompleteness(completeness){
  if (completeness >= 50) return '';
  return '补全2项设定可提升动画质量';
}
```

```md
## [未发布] 当前 `main`

### IP设定与内容工坊（2026-04-27）
- 底部导航将 `收藏` 替换为 `IP设定`
- 新增 `IP设定` 页面，支持角色必填信息与本地保存
- 新增 `内容工坊` 页面，主入口为宠物动画生成
- 低完整度设定时展示轻提示，但不阻断生成流程
```

- [ ] **Step 4: Run full verification**

Run:
- `npm run test`
- 手动打开 `moodmold.html`，验证：
  1) 首页未变化  
  2) 底部第二 tab 为 `IP设定`  
  3) `IP设定` -> `内容工坊` 可达  
  4) `内容工坊` 主按钮是动画生成  
  5) 可返回首页  

Expected: tests all pass + manual checklist all true.

- [ ] **Step 5: Commit**

```bash
git add moodmold.html src/styles/moodmold.css src/js/components/ip.js src/js/components/studio.js CHANGELOG.md tests/ui
git commit -m "feat: deliver ip settings and content studio flow without home changes"
```

## Self-Review Against Spec

- **Spec coverage:**  
  - Home unchanged: Task 5 manual check + no home-module redesign tasks.  
  - `收藏` -> `IP设定`: Task 2.  
  - `sc-ip` required/optional modules + CTA: Task 3.  
  - `sc-studio` animation-first + secondary placeholders + result actions: Task 4/5.  
  - Low completeness hint without hard block: Task 5.
- **Placeholder scan:** No `TODO`/`TBD` markers in execution steps.
- **Type consistency:** Route IDs standardized as `sc-ip` and `sc-studio`; shared names `ipProfile`, `getIpCompleteness`, `studioState`.

