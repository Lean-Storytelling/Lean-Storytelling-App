/* feedback.js — Feedback Story section
   Lean Storytelling v0.4.0 · ES module
*/

import { api } from './api-client.js'
import { renderStoryVersionSelector } from './story-selector.js'
import { renderStoryPreview } from './story-preview.js'

const DEBOUNCE_MS = 2000

let _feedbackId = null
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

export function initFeedback() {
  const section = document.getElementById('section-feedback')
  if (!section || section.dataset.initialized) return
  section.dataset.initialized = 'true'

  section.innerHTML = ''

  // Utility bar
  const bar = document.createElement('div')
  bar.className = 'section-utility-bar'
  const heading = document.createElement('h2')
  heading.className = 'section-heading'
  heading.textContent = 'Feedback your Story'
  _syncEl = document.createElement('span')
  _syncEl.className = 'sync-indicator-inline'
  _syncEl.hidden = true
  bar.appendChild(heading)
  bar.appendChild(_syncEl)
  section.appendChild(bar)

  // Story selector
  const selectorWrap = document.createElement('div')
  selectorWrap.id = 'feedback-selector'
  selectorWrap.className = 'selector-wrap'
  section.appendChild(selectorWrap)

  // Preview
  const previewWrap = document.createElement('div')
  previewWrap.id = 'feedback-preview'
  previewWrap.className = 'section-preview'
  section.appendChild(previewWrap)

  // Dynamic content
  const content = document.createElement('div')
  content.id = 'feedback-content'
  section.appendChild(content)

  renderStoryVersionSelector('feedback-selector', async ({ storyId, versionId }) => {
    await _loadFeedbackSection(storyId, versionId)
  })
}

async function _loadFeedbackSection(storyId, versionId) {
  let versionData = null
  try {
    versionData = await api.get(`/stories/${storyId}/versions/${versionId}`)
  } catch (_) {}
  renderStoryPreview('feedback-preview', versionData)

  // Load existing feedback or create new
  let feedback = null
  try {
    const feedbacks = await api.get(`/stories/${storyId}/versions/${versionId}/feedbacks`)
    feedback = feedbacks?.[0] || null
  } catch (_) {}

  if (!feedback) {
    try {
      feedback = await api.post(`/stories/${storyId}/versions/${versionId}/feedbacks`, {})
    } catch (_) {}
  }

  _feedbackId = feedback?.id || null
  _renderFeedbackContent(feedback)
}

function _renderFeedbackContent(feedback) {
  const content = document.getElementById('feedback-content')
  if (!content) return
  content.innerHTML = ''

  if (!_feedbackId) {
    const p = document.createElement('p')
    p.className = 'section-error'
    p.textContent = 'Could not load feedback data. Please try again.'
    content.appendChild(p)
    return
  }

  // Third-party feedback
  content.appendChild(_buildTextareaField(
    'feedback-third-party',
    'Third-party feedback',
    'Capture what others said: qualitative and/or quantitative, positive, negative, neutral, direct suggestions.',
    feedback?.third_party || '',
    value => {
      _setSync('Saving…')
      _debounce('third_party', async () => {
        try {
          await api.patch(`/feedbacks/${_feedbackId}`, { third_party: value })
          _setSync('Saved')
          setTimeout(() => _setSync(''), 2000)
        } catch (_) { _setSync('⚠ Not saved') }
      })
    }
  ))

  // Self-impression
  content.appendChild(_buildTextareaField(
    'feedback-self-impression',
    'Self-impression',
    'Capture how it felt: what seemed to land well, what you want to improve next time.',
    feedback?.self_impression || '',
    value => {
      _setSync('Saving…')
      _debounce('self_impression', async () => {
        try {
          await api.patch(`/feedbacks/${_feedbackId}`, { self_impression: value })
          _setSync('Saved')
          setTimeout(() => _setSync(''), 2000)
        } catch (_) { _setSync('⚠ Not saved') }
      })
    }
  ))
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
  textarea.rows = 6
  textarea.placeholder = 'Type here…'
  textarea.value = initialValue  // safe: .value assignment (not innerHTML)

  textarea.addEventListener('input', () => onInput(textarea.value))

  wrap.appendChild(labelEl)
  wrap.appendChild(adviceEl)
  wrap.appendChild(textarea)
  return wrap
}
