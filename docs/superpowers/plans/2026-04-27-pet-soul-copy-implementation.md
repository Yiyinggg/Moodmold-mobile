# Pet Soul Copy Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the “create pet soul” copy to a concise sacred-ritual tone across entry, create, and generating states without changing layout or behavior.

**Architecture:** Keep all changes in `moodmold.html` where the user-facing copy currently lives. Implement in two scoped passes: (1) entry/create-screen copy, (2) generating-screen state and step copy. Validate by search-based assertions and manual UI smoke checks to ensure no interaction regressions.

**Tech Stack:** Static HTML/CSS/JS page (`moodmold.html`), shell validation with `rg`, manual browser verification.

---

## File Structure

- Modify: `moodmold.html`
  - Responsibility: source of all affected user-visible copy for action sheet, create page, generating page.
- Modify: `CHANGELOG.md`
  - Responsibility: record this copy-only UX refinement for project history.
- Verify against: `docs/superpowers/specs/2026-04-27-pet-soul-copy-design.md`
  - Responsibility: source of truth for approved copy and scope constraints.

### Task 1: Update Action-Sheet and Create-Screen Copy

**Files:**
- Modify: `moodmold.html`
- Test: `moodmold.html` (content assertions via `rg`)

- [ ] **Step 1: Write the failing test (assert new copy is not present yet)**

```bash
rg -n "为TA注入灵魂|开始唤醒仪式|上传照片与名字，完成一次灵魂唤醒仪式。" moodmold.html
```

Expected: no matches for at least one target string (current file still has old wording).

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
rg -n "为TA注入灵魂|开始唤醒仪式|上传照片与名字，完成一次灵魂唤醒仪式。" moodmold.html
```

Expected: non-zero exit or incomplete matches, confirming update not yet applied.

- [ ] **Step 3: Write minimal implementation**

Apply exact replacements in `moodmold.html`:

```html
<div class="sub-title">为TA注入灵魂</div>
...
<button class="create-btn" onclick="startGenerate()">开始唤醒仪式</button>
...
<div class="create-act-sub">上传照片与名字，完成一次灵魂唤醒仪式。</div>
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
rg -n "为TA注入灵魂|开始唤醒仪式|上传照片与名字，完成一次灵魂唤醒仪式。" moodmold.html
```

Expected: 3 matches, one for each updated location.

- [ ] **Step 5: Commit**

```bash
git add moodmold.html
git commit -m "refine create-pet copy with ritual tone for stronger emotional framing"
```

### Task 2: Update Generating-State Copy to Match Ritual Narrative

**Files:**
- Modify: `moodmold.html`
- Test: `moodmold.html` (content assertions via `rg`)

- [ ] **Step 1: Write the failing test (assert old generating copy still exists)**

```bash
rg -n "AI 生成中|准备中…|照片已分析|性格已建模|3D 形象已雕刻|情绪引擎已绑定|实体模型已排队" moodmold.html
```

Expected: matches found, confirming old generating vocabulary still active.

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
rg -n "灵魂唤醒中|仪式准备中…|记忆映射完成|心性刻印完成|灵体塑形完成|情感共鸣建立|灵魂载体就绪" moodmold.html
```

Expected: non-zero exit or incomplete matches, confirming new set not fully present yet.

- [ ] **Step 3: Write minimal implementation**

Apply exact replacements in `moodmold.html`:

```html
<div style="font-size:11px;font-weight:900;color:rgba(255,255,255,0.7);letter-spacing:0.1em;">灵魂唤醒中</div>
...
<div class="prog-head"><span id="genLabel">仪式准备中…</span><span class="prog-pct" id="genPct">0%</span></div>
...
<span class="step-txt t-wait" id="gt0">记忆映射完成</span>
<span class="step-txt t-wait" id="gt1">心性刻印完成</span>
<span class="step-txt t-wait" id="gt2">灵体塑形完成</span>
<span class="step-txt t-wait" id="gt3">情感共鸣建立</span>
<span class="step-txt t-wait" id="gt4">灵魂载体就绪</span>
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
rg -n "灵魂唤醒中|仪式准备中…|记忆映射完成|心性刻印完成|灵体塑形完成|情感共鸣建立|灵魂载体就绪" moodmold.html && rg -n "AI 生成中|照片已分析|性格已建模|3D 形象已雕刻|情绪引擎已绑定|实体模型已排队" moodmold.html
```

Expected: first `rg` finds all 7 new strings; second `rg` returns no matches.

- [ ] **Step 5: Commit**

```bash
git add moodmold.html
git commit -m "align generation-state copy with soul-awakening narrative"
```

### Task 3: Verify Scope Safety and Document the Change

**Files:**
- Modify: `CHANGELOG.md`
- Test: `moodmold.html` in browser/manual flow
- Verify: `docs/superpowers/specs/2026-04-27-pet-soul-copy-design.md`

- [ ] **Step 1: Write the failing test (scope guard)**

Create a manual verification checklist where any structural change fails the task:

```text
FAIL if tab structure changes
FAIL if create flow order changes
FAIL if button actions change
PASS only if copy changes are visible and interactions remain identical
```

- [ ] **Step 2: Run test to verify it fails (before manual check is completed)**

Run local page and open target flow:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/moodmold.html` and navigate:
Create Action Sheet -> 创建宠物灵魂 -> 生成流程。

Expected: verification remains incomplete until all checklist items are checked.

- [ ] **Step 3: Write minimal implementation**

Add one changelog entry describing copy-only scope:

```markdown
- Refined “创建宠物灵魂” flow copy to a ritual, emotion-first narrative without changing layout or interactions.
```

- [ ] **Step 4: Run test to verify it passes**

Manual pass criteria:

```text
1) Action sheet subtitle updated
2) Create title/button updated
3) Generating header/progress/5 steps updated
4) Navigation, input, and generation interactions unchanged
```

Expected: all four criteria pass.

- [ ] **Step 5: Commit**

```bash
git add CHANGELOG.md
git commit -m "document pet soul copy refresh in changelog"
```

### Task 4: Final Verification and Consolidation Commit (Optional if squashing is preferred)

**Files:**
- Modify: none required (verification + optional commit strategy)
- Test: git diff/status and end-to-end smoke run

- [ ] **Step 1: Write the failing test**

```bash
git diff --name-only HEAD~1..HEAD
```

Expected: if commit set does not reflect intended scope (`moodmold.html`, `CHANGELOG.md`), treat as fail.

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
git status --short
```

Expected: fail condition if unintended files are modified.

- [ ] **Step 3: Write minimal implementation**

If project prefers one final commit instead of multiple incremental commits:

```bash
git add moodmold.html CHANGELOG.md
git commit -m "refresh pet soul creation copy with sacred ritual narrative"
```

- [ ] **Step 4: Run test to verify it passes**

```bash
git status
```

Expected: clean working tree for intended files after chosen commit strategy.

- [ ] **Step 5: Commit**

```bash
# Skip if already committed in Step 3
```
