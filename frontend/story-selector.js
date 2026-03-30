/* story-selector.js — Shared story + version selector component
   Lean Storytelling v0.4.0 · ES module
*/

import { api } from './api-client.js'

/**
 * Render a story dropdown + version dropdown inside the given container.
 * Defaults to the first (most recent) story and its latest version.
 * Calls onSelectCallback({ storyId, versionId }) whenever the selection changes.
 *
 * @param {string} containerId - ID of the DOM element to render into
 * @param {function} onSelectCallback - called with { storyId, versionId }
 */
export async function renderStoryVersionSelector(containerId, onSelectCallback) {
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = ''

  let stories
  try {
    stories = await api.get('/stories')
  } catch (_) {
    const p = document.createElement('p')
    p.className = 'selector-error'
    p.textContent = 'Failed to load stories.'
    container.appendChild(p)
    return
  }

  if (!stories || stories.length === 0) {
    const p = document.createElement('p')
    p.className = 'selector-empty'
    p.textContent = 'No stories yet — build one first.'
    container.appendChild(p)
    return
  }

  const wrap = document.createElement('div')
  wrap.className = 'story-selector'

  // Story label + select
  const storyLabel = document.createElement('label')
  storyLabel.className = 'selector-label'
  storyLabel.textContent = 'Story'

  const storySelect = document.createElement('select')
  storySelect.className = 'selector-select'
  storySelect.setAttribute('aria-label', 'Select story')

  for (const story of stories) {
    const opt = document.createElement('option')
    opt.value = story.id
    opt.textContent = story.title  // safe: textContent
    storySelect.appendChild(opt)
  }

  storyLabel.appendChild(storySelect)

  // Version label + select
  const versionLabel = document.createElement('label')
  versionLabel.className = 'selector-label'
  versionLabel.textContent = 'Version'

  const versionSelect = document.createElement('select')
  versionSelect.className = 'selector-select'
  versionSelect.setAttribute('aria-label', 'Select version')

  versionLabel.appendChild(versionSelect)

  wrap.appendChild(storyLabel)
  wrap.appendChild(versionLabel)
  container.appendChild(wrap)

  // Load versions for a given storyId and populate the version dropdown
  async function loadVersions(storyId) {
    versionSelect.innerHTML = ''
    let versions
    try {
      versions = await api.get(`/stories/${storyId}/versions`)
    } catch (_) {
      const opt = document.createElement('option')
      opt.textContent = 'Failed to load versions'
      versionSelect.appendChild(opt)
      return
    }

    if (!versions || versions.length === 0) {
      const opt = document.createElement('option')
      opt.textContent = 'No versions'
      versionSelect.appendChild(opt)
      return
    }

    // Newest version first
    const sorted = [...versions].sort((a, b) => b.version_number - a.version_number)
    for (const v of sorted) {
      const opt = document.createElement('option')
      opt.value = v.id
      opt.textContent = `v${v.version_number}`  // safe: textContent
      versionSelect.appendChild(opt)
    }

    // Fire callback with initial selection
    onSelectCallback({ storyId, versionId: versionSelect.value })
  }

  // Story change handler
  storySelect.addEventListener('change', async () => {
    await loadVersions(storySelect.value)
  })

  // Version change handler
  versionSelect.addEventListener('change', () => {
    if (versionSelect.value) {
      onSelectCallback({ storyId: storySelect.value, versionId: versionSelect.value })
    }
  })

  // Initial load: first story, latest version
  await loadVersions(stories[0].id)
}
