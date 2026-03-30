/* extend.js — Extend Story section
   Lean Storytelling v0.4.0 · ES module
*/

import { api } from './api-client.js'
import { renderStoryVersionSelector } from './story-selector.js'
import { renderStoryPreview } from './story-preview.js'

const DEBOUNCE_MS = 2000

// Element type keys MUST match the DB enum values exactly (see routes/extensions.js VALID_ELEMENT_TYPES)
const ELEMENT_TYPES = {
  challenge: {
    label: 'Challenge',
    summary: 'A provocative question or statement',
    goal: 'Refocus the audience',
    advice: 'Keep it short — one sentence max'
  },
  data: {
    label: 'Data',
    summary: 'A fact, statistic, or metric',
    goal: 'Ground the story in evidence',
    advice: 'Cite the source; one data point only'
  },
  quote: {
    label: 'Quote',
    summary: 'A direct quote from a person',
    goal: 'Add credibility or emotion',
    advice: 'Use real quotes; attribute clearly'
  },
  alternative: {
    label: 'Alternative',
    summary: 'A path not taken',
    goal: 'Show you considered options',
    advice: 'Brief — the story is not about the alternative'
  },
  fail: {
    label: 'Fail',
    summary: 'What did not work before',
    goal: 'Build authenticity and trust',
    advice: 'Vulnerability is a strength; stay factual'
  },
  call_to_action: {
    label: 'Call to Action',
    summary: 'What you want the audience to do',
    goal: 'Close with intent',
    advice: 'One action only; make it concrete'
  }
}

// Anchor values MUST match the DB enum values exactly (see routes/extensions.js VALID_ANCHORS)
const ANCHORS = [
  { value: 'before_context',     label: 'Before Context' },
  { value: 'after_context',      label: 'After Context' },
  { value: 'after_target',       label: 'After Target' },
  { value: 'after_empathy',      label: 'After Empathy' },
  { value: 'after_problem',      label: 'After Problem' },
  { value: 'after_consequences', label: 'After Consequences' },
  { value: 'after_solution',     label: 'After Solution' },
  { value: 'after_benefits',     label: 'After Benefits' },
  { value: 'after_why',          label: 'After Why' }
]

let _currentStoryId = null
let _currentVersionId = null
let _extensions = []
let _saveTimers = {}
let _syncEl = null

function _setSync(text) {
  if (!_syncEl) return
  _syncEl.hidden = !text
  _syncEl.textContent = text  // safe: hardcoded status strings
}

function _debounce(id, fn) {
  clearTimeout(_saveTimers[id])
  _saveTimers[id] = setTimeout(fn, DEBOUNCE_MS)
}

export function initExtend() {
  const section = document.getElementById('section-extend')
  if (!section || section.dataset.initialized) return
  section.dataset.initialized = 'true'

  section.innerHTML = ''

  // Utility bar
  const bar = document.createElement('div')
  bar.className = 'section-utility-bar'
  const heading = document.createElement('h2')
  heading.className = 'section-heading'
  heading.textContent = 'Extend your Story'
  _syncEl = document.createElement('span')
  _syncEl.className = 'sync-indicator-inline'
  _syncEl.hidden = true
  bar.appendChild(heading)
  bar.appendChild(_syncEl)
  section.appendChild(bar)

  // Story selector
  const selectorWrap = document.createElement('div')
  selectorWrap.id = 'extend-selector'
  selectorWrap.className = 'selector-wrap'
  section.appendChild(selectorWrap)

  // Preview
  const previewWrap = document.createElement('div')
  previewWrap.id = 'extend-preview'
  previewWrap.className = 'section-preview'
  section.appendChild(previewWrap)

  // Dynamic content area
  const content = document.createElement('div')
  content.id = 'extend-content'
  section.appendChild(content)

  renderStoryVersionSelector('extend-selector', async ({ storyId, versionId }) => {
    _currentStoryId = storyId
    _currentVersionId = versionId
    await _loadExtendSection(storyId, versionId)
  })
}

async function _loadExtendSection(storyId, versionId) {
  let versionData = null
  try {
    versionData = await api.get(`/stories/${storyId}/versions/${versionId}`)
  } catch (_) {}
  renderStoryPreview('extend-preview', versionData)

  try {
    _extensions = await api.get(`/stories/${storyId}/versions/${versionId}/extensions`)
  } catch (_) {
    _extensions = []
  }

  _renderExtendContent(storyId, versionId)
}

function _renderExtendContent(storyId, versionId) {
  const content = document.getElementById('extend-content')
  if (!content) return
  content.innerHTML = ''

  // Advice banner
  const banner = document.createElement('p')
  banner.className = 'advice-banner'
  banner.textContent = 'The simpler the better. Test with one addition before adding more.'
  content.appendChild(banner)

  // Add Elements heading
  const addHeading = document.createElement('h3')
  addHeading.className = 'subsection-heading'
  addHeading.textContent = 'Add Elements'
  content.appendChild(addHeading)

  const cardGrid = document.createElement('div')
  cardGrid.className = 'element-card-grid'
  content.appendChild(cardGrid)

  for (const [typeKey, typeDef] of Object.entries(ELEMENT_TYPES)) {
    cardGrid.appendChild(_buildElementCard(typeKey, typeDef, storyId, versionId))
  }

  // Placement widget heading
  const placementHeading = document.createElement('h3')
  placementHeading.className = 'subsection-heading'
  placementHeading.textContent = 'Placement'
  content.appendChild(placementHeading)

  const placementWidget = document.createElement('div')
  placementWidget.className = 'placement-widget'
  placementWidget.id = 'placement-widget'
  content.appendChild(placementWidget)
  _renderPlacementWidget()

  // Blend scaffold
  content.appendChild(_buildBlendScaffold())
}

function _buildElementCard(typeKey, typeDef, storyId, versionId) {
  const card = document.createElement('div')
  card.className = 'element-card'

  const title = document.createElement('h4')
  title.className = 'element-card__title'
  title.textContent = typeDef.label  // safe: hardcoded constant

  const summary = document.createElement('p')
  summary.className = 'element-card__summary'
  summary.textContent = typeDef.summary  // safe: hardcoded constant

  const goalEl = document.createElement('p')
  goalEl.className = 'element-card__goal'
  goalEl.textContent = 'Goal: ' + typeDef.goal  // safe: hardcoded constant

  const adviceEl = document.createElement('p')
  adviceEl.className = 'element-card__advice'
  adviceEl.textContent = typeDef.advice  // safe: hardcoded constant

  const addBtn = document.createElement('button')
  addBtn.className = 'btn btn--ghost btn--sm element-card__add'
  addBtn.textContent = '+ Add'

  const panel = document.createElement('div')
  panel.className = 'element-card__panel'
  panel.hidden = true

  card.appendChild(title)
  card.appendChild(summary)
  card.appendChild(goalEl)
  card.appendChild(adviceEl)
  card.appendChild(addBtn)
  card.appendChild(panel)

  addBtn.addEventListener('click', async () => {
    let ext
    try {
      _setSync('Saving…')
      // typeKey is one of the 6 safe enum values defined in ELEMENT_TYPES — not user input
      ext = await api.post(`/stories/${storyId}/versions/${versionId}/extensions`, {
        element_type: typeKey,
        anchor: 'after_why'
      })
      _extensions.push(ext)
      _setSync('Saved')
      setTimeout(() => _setSync(''), 2000)
    } catch (_) {
      _setSync('⚠ Not saved')
      return
    }

    const textarea = document.createElement('textarea')
    textarea.className = 'element-card__textarea'
    textarea.rows = 3
    textarea.placeholder = 'Enter content…'
    textarea.dataset.extensionId = ext.id

    textarea.addEventListener('input', () => {
      _setSync('Saving…')
      _debounce(ext.id, async () => {
        try {
          const updated = await api.patch(`/extensions/${ext.id}`, { content: textarea.value })
          const idx = _extensions.findIndex(e => e.id === ext.id)
          if (idx >= 0) _extensions[idx] = { ..._extensions[idx], ...updated }
          _setSync('Saved')
          setTimeout(() => _setSync(''), 2000)
          _renderPlacementWidget()
        } catch (_) {
          _setSync('⚠ Not saved')
        }
      })
    })

    const removeBtn = document.createElement('button')
    removeBtn.className = 'btn btn--ghost btn--sm element-card__remove'
    removeBtn.textContent = 'Remove'
    removeBtn.addEventListener('click', async () => {
      try {
        await api.delete(`/extensions/${ext.id}`)
        _extensions = _extensions.filter(e => e.id !== ext.id)
        panel.innerHTML = ''
        panel.hidden = true
        addBtn.hidden = false
        _renderPlacementWidget()
      } catch (_) {}
    })

    panel.appendChild(textarea)
    panel.appendChild(removeBtn)
    panel.hidden = false
    addBtn.hidden = true
  })

  return card
}

function _renderPlacementWidget() {
  const widget = document.getElementById('placement-widget')
  if (!widget) return
  widget.innerHTML = ''

  for (const anchor of ANCHORS) {
    const zone = document.createElement('div')
    zone.className = 'placement-zone'
    zone.dataset.anchor = anchor.value

    const zoneLabel = document.createElement('div')
    zoneLabel.className = 'placement-zone__label'
    zoneLabel.textContent = anchor.label  // safe: hardcoded constant

    zone.appendChild(zoneLabel)

    const chipsHere = _extensions
      .filter(e => e.anchor === anchor.value)
      .sort((a, b) => a.sort_order - b.sort_order)

    for (const ext of chipsHere) {
      zone.appendChild(_buildChip(ext))
    }

    zone.addEventListener('dragover', e => {
      e.preventDefault()
      zone.classList.add('placement-zone--dragover')
    })
    zone.addEventListener('dragleave', () => {
      zone.classList.remove('placement-zone--dragover')
    })
    zone.addEventListener('drop', async e => {
      e.preventDefault()
      zone.classList.remove('placement-zone--dragover')
      const extId = e.dataTransfer.getData('text/plain')
      if (!extId) return

      // Dropped chip goes to end of this anchor
      const newSortOrder = chipsHere.length + 1
      try {
        const updated = await api.patch(`/extensions/${extId}`, {
          anchor: anchor.value,
          sort_order: newSortOrder
        })
        const idx = _extensions.findIndex(ex => ex.id === extId)
        if (idx >= 0) _extensions[idx] = { ..._extensions[idx], ...updated }
        _renderPlacementWidget()
      } catch (_) {}
    })

    widget.appendChild(zone)
  }
}

function _buildChip(ext) {
  const chip = document.createElement('div')
  chip.className = 'extension-chip'
  chip.draggable = true
  chip.dataset.id = ext.id

  const typeInfo = ELEMENT_TYPES[ext.element_type] || { label: ext.element_type }
  const excerpt = ext.content ? ext.content.slice(0, 40) + (ext.content.length > 40 ? '…' : '') : ''

  const labelEl = document.createElement('span')
  labelEl.className = 'extension-chip__label'
  labelEl.textContent = typeInfo.label + (excerpt ? ': ' + excerpt : '')  // safe: textContent

  const arrows = document.createElement('span')
  arrows.className = 'chip-arrows'

  const upBtn = document.createElement('button')
  upBtn.className = 'chip-arrow'
  upBtn.setAttribute('aria-label', 'Move up')
  upBtn.textContent = '↑'
  upBtn.addEventListener('click', e => { e.stopPropagation(); _moveChip(ext, -1) })

  const downBtn = document.createElement('button')
  downBtn.className = 'chip-arrow'
  downBtn.setAttribute('aria-label', 'Move down')
  downBtn.textContent = '↓'
  downBtn.addEventListener('click', e => { e.stopPropagation(); _moveChip(ext, +1) })

  arrows.appendChild(upBtn)
  arrows.appendChild(downBtn)
  chip.appendChild(labelEl)
  chip.appendChild(arrows)

  chip.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', ext.id)
    chip.classList.add('extension-chip--dragging')
  })
  chip.addEventListener('dragend', () => {
    chip.classList.remove('extension-chip--dragging')
  })

  return chip
}

async function _moveChip(ext, direction) {
  const sameAnchor = _extensions
    .filter(e => e.anchor === ext.anchor)
    .sort((a, b) => a.sort_order - b.sort_order)

  const idx = sameAnchor.findIndex(e => e.id === ext.id)
  const swapIdx = idx + direction
  if (swapIdx < 0 || swapIdx >= sameAnchor.length) return

  const other = sameAnchor[swapIdx]
  try {
    const [u1, u2] = await Promise.all([
      api.patch(`/extensions/${ext.id}`, { sort_order: other.sort_order }),
      api.patch(`/extensions/${other.id}`, { sort_order: ext.sort_order })
    ])
    const i1 = _extensions.findIndex(e => e.id === ext.id)
    const i2 = _extensions.findIndex(e => e.id === other.id)
    if (i1 >= 0) _extensions[i1] = { ..._extensions[i1], ...u1 }
    if (i2 >= 0) _extensions[i2] = { ..._extensions[i2], ...u2 }
    _renderPlacementWidget()
  } catch (_) {}
}

function _buildBlendScaffold() {
  const wrap = document.createElement('div')
  wrap.className = 'blend-scaffold'

  const inner = document.createElement('div')
  inner.className = 'blend-scaffold__inner'

  const heading = document.createElement('h3')
  heading.className = 'subsection-heading'
  heading.textContent = 'Blend to another story'
  inner.appendChild(heading)

  const blendSelectorWrap = document.createElement('div')
  blendSelectorWrap.id = 'blend-selector'
  blendSelectorWrap.className = 'selector-wrap'
  inner.appendChild(blendSelectorWrap)
  // Render selector but immediately disable — Blend is Coming Soon
  renderStoryVersionSelector('blend-selector', () => {}).then(() => {
    blendSelectorWrap.querySelectorAll('select, button').forEach(el => { el.disabled = true })
  }).catch(() => {})

  const blendPreviewWrap = document.createElement('div')
  blendPreviewWrap.id = 'blend-preview'
  blendPreviewWrap.className = 'section-preview'
  renderStoryPreview('blend-preview', null)
  inner.appendChild(blendPreviewWrap)

  const blendGrid = document.createElement('div')
  blendGrid.className = 'element-card-grid element-card-grid--disabled'
  for (const bt of ['Prequel-Sequel', 'Nested sub-story', 'Parallel', 'Flashback']) {
    const card = document.createElement('div')
    card.className = 'element-card element-card--disabled'
    const t = document.createElement('h4')
    t.className = 'element-card__title'
    t.textContent = bt  // safe: hardcoded constant
    card.appendChild(t)
    blendGrid.appendChild(card)
  }
  inner.appendChild(blendGrid)
  wrap.appendChild(inner)

  // Overlay that blocks all interaction
  const overlay = document.createElement('div')
  overlay.className = 'coming-soon-overlay'
  overlay.setAttribute('aria-hidden', 'true')
  overlay.textContent = 'Coming soon'  // safe: hardcoded constant
  wrap.appendChild(overlay)

  return wrap
}
