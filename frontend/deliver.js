/* deliver.js — Deliver Story section
   Lean Storytelling v0.4.0 · ES module
*/

import { api } from './api-client.js'
import { renderStoryVersionSelector } from './story-selector.js'
import { renderStoryPreview } from './story-preview.js'

const DEBOUNCE_MS = 2000

// Format values MUST match the DB enum exactly (see routes/deliveries.js VALID_FORMATS)
const FORMAT_CARDS = [
  {
    value: 'text',
    label: 'Text',
    summary: 'Written document or message',
    goal: 'Async reading, lasting reference',
    advice: 'Structure clearly; use delivery order'
  },
  {
    value: 'slides',
    label: 'Slides',
    summary: 'Presentation deck',
    goal: 'Visual support for live delivery',
    advice: 'One idea per slide; story drives the deck'
  },
  {
    value: 'live',
    label: 'Live',
    summary: 'Spoken delivery, no deck',
    goal: 'Direct, human connection',
    advice: 'Rehearse the opening and closing'
  }
]

let _deliveryId = null
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

export function initDeliver() {
  const section = document.getElementById('section-deliver')
  if (!section || section.dataset.initialized) return
  section.dataset.initialized = 'true'

  section.innerHTML = ''

  // Utility bar
  const bar = document.createElement('div')
  bar.className = 'section-utility-bar'
  const heading = document.createElement('h2')
  heading.className = 'section-heading'
  heading.textContent = 'Deliver your Story'
  _syncEl = document.createElement('span')
  _syncEl.className = 'sync-indicator-inline'
  _syncEl.hidden = true
  bar.appendChild(heading)
  bar.appendChild(_syncEl)
  section.appendChild(bar)

  // Story selector
  const selectorWrap = document.createElement('div')
  selectorWrap.id = 'deliver-selector'
  selectorWrap.className = 'selector-wrap'
  section.appendChild(selectorWrap)

  // Preview
  const previewWrap = document.createElement('div')
  previewWrap.id = 'deliver-preview'
  previewWrap.className = 'section-preview'
  section.appendChild(previewWrap)

  // Dynamic content
  const content = document.createElement('div')
  content.id = 'deliver-content'
  section.appendChild(content)

  renderStoryVersionSelector('deliver-selector', async ({ storyId, versionId }) => {
    await _loadDeliverSection(storyId, versionId)
  })
}

async function _loadDeliverSection(storyId, versionId) {
  let versionData = null
  try {
    versionData = await api.get(`/stories/${storyId}/versions/${versionId}`)
  } catch (_) {}
  renderStoryPreview('deliver-preview', versionData)

  // Load existing deliveries or create a new one
  let delivery = null
  try {
    const deliveries = await api.get(`/stories/${storyId}/versions/${versionId}/deliveries`)
    delivery = deliveries?.[0] || null
  } catch (_) {}

  if (!delivery) {
    try {
      delivery = await api.post(`/stories/${storyId}/versions/${versionId}/deliveries`, {})
    } catch (_) {}
  }

  _deliveryId = delivery?.id || null
  _renderDeliverContent(delivery)
}

function _renderDeliverContent(delivery) {
  const content = document.getElementById('deliver-content')
  if (!content) return
  content.innerHTML = ''

  if (!_deliveryId) {
    const p = document.createElement('p')
    p.className = 'section-error'
    p.textContent = 'Could not load delivery data. Please try again.'
    content.appendChild(p)
    return
  }

  // Audience
  content.appendChild(_buildTextareaField(
    'deliver-audience',
    'Audience',
    'Describe who will receive this story: their role, level of familiarity, and what they care about.',
    delivery?.audience || '',
    value => {
      _setSync('Saving…')
      _debounce('audience', async () => {
        try {
          await api.patch(`/deliveries/${_deliveryId}`, { audience: value })
          _setSync('Saved')
          setTimeout(() => _setSync(''), 2000)
        } catch (_) { _setSync('⚠ Not saved') }
      })
    }
  ))

  // Context
  content.appendChild(_buildTextareaField(
    'deliver-context',
    'Context',
    'Describe where, when, why this story will be delivered: meeting type, group size, energy level, constraints.',
    delivery?.context || '',
    value => {
      _setSync('Saving…')
      _debounce('context', async () => {
        try {
          await api.patch(`/deliveries/${_deliveryId}`, { context: value })
          _setSync('Saved')
          setTimeout(() => _setSync(''), 2000)
        } catch (_) { _setSync('⚠ Not saved') }
      })
    }
  ))

  // Format cards
  const formatHeading = document.createElement('h3')
  formatHeading.className = 'subsection-heading'
  formatHeading.textContent = 'Format'
  content.appendChild(formatHeading)

  const formatGrid = document.createElement('div')
  formatGrid.className = 'format-card-grid'
  content.appendChild(formatGrid)

  for (const fmt of FORMAT_CARDS) {
    formatGrid.appendChild(_buildFormatCard(fmt, delivery?.format))
  }
}

function _buildTextareaField(id, label, advice, initialValue, onInput) {
  const wrap = document.createElement('div')
  wrap.className = 'field-group'

  const labelEl = document.createElement('h3')
  labelEl.className = 'subsection-heading'
  labelEl.textContent = label  // safe: hardcoded constant

  const adviceEl = document.createElement('p')
  adviceEl.className = 'field-advice-text'
  adviceEl.textContent = advice  // safe: hardcoded constant

  const textarea = document.createElement('textarea')
  textarea.id = id
  textarea.className = 'section-textarea'
  textarea.rows = 4
  textarea.placeholder = 'Type here…'
  textarea.value = initialValue  // safe: .value assignment (not innerHTML)

  textarea.addEventListener('input', () => onInput(textarea.value))

  wrap.appendChild(labelEl)
  wrap.appendChild(adviceEl)
  wrap.appendChild(textarea)
  return wrap
}

function _buildFormatCard(fmt, selectedFormat) {
  const card = document.createElement('div')
  card.className = 'format-card'
  if (fmt.value === selectedFormat) card.classList.add('format-card--selected')
  card.role = 'button'
  card.tabIndex = 0
  card.setAttribute('aria-pressed', String(fmt.value === selectedFormat))

  const title = document.createElement('h4')
  title.className = 'format-card__title'
  title.textContent = fmt.label  // safe: hardcoded constant

  const summary = document.createElement('p')
  summary.className = 'format-card__summary'
  summary.textContent = fmt.summary  // safe: hardcoded constant

  const goal = document.createElement('p')
  goal.className = 'format-card__goal'
  goal.textContent = 'Goal: ' + fmt.goal  // safe: hardcoded constant

  const advice = document.createElement('p')
  advice.className = 'format-card__advice'
  advice.textContent = fmt.advice  // safe: hardcoded constant

  card.appendChild(title)
  card.appendChild(summary)
  card.appendChild(goal)
  card.appendChild(advice)

  const handleSelect = async () => {
    const isSelected = card.classList.contains('format-card--selected')
    const newFormat = isSelected ? null : fmt.value

    // Update UI immediately
    document.querySelectorAll('.format-card').forEach(c => {
      c.classList.remove('format-card--selected')
      c.setAttribute('aria-pressed', 'false')
    })
    if (newFormat) {
      card.classList.add('format-card--selected')
      card.setAttribute('aria-pressed', 'true')
    }

    // Save immediately (no debounce for format selection)
    try {
      await api.patch(`/deliveries/${_deliveryId}`, { format: newFormat })
    } catch (_) {
      _setSync('⚠ Not saved')
    }
  }

  card.addEventListener('click', handleSelect)
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect() } })

  return card
}
