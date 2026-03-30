/* story-preview.js — Shared read-only story preview component
   Lean Storytelling v0.4.0 · ES module
*/

// Canonical delivery order (Context → … → Why)
const DELIVERY_ORDER = ['context', 'target', 'empathy', 'problem', 'consequences', 'solution', 'benefits', 'why']

const FIELD_LABELS = {
  context:      'Context',
  target:       'Target',
  empathy:      'Empathy',
  problem:      'Problem',
  consequences: 'Consequences',
  solution:     'Solution',
  benefits:     'Benefits',
  why:          'Why',
}

/**
 * Render a read-only story preview inside the given container.
 * All user content is written via .textContent — XSS safe.
 *
 * @param {string} containerId - ID of the DOM element to render into
 * @param {object|null} versionData - version object from the API, or null to show empty state
 */
export function renderStoryPreview(containerId, versionData) {
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = ''

  if (!versionData) {
    const p = document.createElement('p')
    p.className = 'preview-placeholder-text'
    p.textContent = 'Select a story version to preview it here.'
    container.appendChild(p)
    return
  }

  const allEmpty = DELIVERY_ORDER.every(f => !versionData[f])

  if (allEmpty) {
    const p = document.createElement('p')
    p.className = 'preview-placeholder-text'
    p.textContent = 'This version has no content yet.'
    container.appendChild(p)
    return
  }

  for (const field of DELIVERY_ORDER) {
    const text = versionData[field]

    const block = document.createElement('div')
    block.className = 'preview-block'

    const label = document.createElement('h3')
    label.className = 'preview-label'
    label.textContent = FIELD_LABELS[field]  // safe: hardcoded constant
    block.appendChild(label)

    const content = document.createElement('p')
    if (text) {
      content.className = 'preview-content'
      content.textContent = text  // safe: textContent — no innerHTML
    } else {
      content.className = 'preview-placeholder'
      content.textContent = '—'
    }
    block.appendChild(content)

    container.appendChild(block)
  }
}
