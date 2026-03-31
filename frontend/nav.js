/* nav.js — App navigation: section switching, breadcrumb, sidebar rail toggle
   Lean Storytelling v0.4.0 · ES module · Auto-initialises on load (deferred)
*/

import { initExtend }   from './extend.js'
import { initDeliver }  from './deliver.js'
import { initFeedback } from './feedback.js'

const STORAGE_KEY = 'leanstory_sidebar_collapsed'

const SECTIONS = {
  build:    'Build Story',
  extend:   'Extend Story',
  deliver:  'Deliver Story',
  feedback: 'Feedback Story'
}

const _sectionInited = { build: true, extend: false, deliver: false, feedback: false }

export function initNav() {
  _applyCollapsedState(_readCollapsed())

  // Nav item clicks
  document.querySelectorAll('.nav-item[data-section]').forEach(el => {
    el.addEventListener('click', () => navigateTo(el.dataset.section))
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigateTo(el.dataset.section) }
    })
  })

  // Sidebar toggle button (header)
  document.getElementById('sidebar-toggle')?.addEventListener('click', _toggleCollapsed)

  // Rail: Stories icon expands sidebar
  document.getElementById('rail-stories-btn')?.addEventListener('click', () => {
    _applyCollapsedState(false)
    _saveCollapsed(false)
  })

  // Default to Build section
  navigateTo('build')
}

export function navigateTo(sectionId) {
  if (!SECTIONS[sectionId]) return

  // Show/hide sections
  Object.keys(SECTIONS).forEach(id => {
    const el = document.getElementById(`section-${id}`)
    if (el) el.classList.toggle('section--active', id === sectionId)
  })

  // Nav active state
  document.querySelectorAll('.nav-item[data-section]').forEach(el => {
    const active = el.dataset.section === sectionId
    el.classList.toggle('nav-item--active', active)
    el.setAttribute('aria-current', active ? 'page' : 'false')
  })

  // Breadcrumb
  const bc = document.getElementById('app-breadcrumb')
  if (bc) bc.textContent = 'Lean Storytelling > ' + SECTIONS[sectionId]  // safe: hardcoded

  // Lazy init
  if (!_sectionInited[sectionId]) {
    _sectionInited[sectionId] = true
    if (sectionId === 'extend')   initExtend()
    if (sectionId === 'deliver')  initDeliver()
    if (sectionId === 'feedback') initFeedback()
  }
}

function _toggleCollapsed() {
  const next = !_readCollapsed()
  _applyCollapsedState(next)
  _saveCollapsed(next)
}

function _applyCollapsedState(collapsed) {
  document.getElementById('app-nav')?.classList.toggle('sidebar--collapsed', collapsed)
  const btn = document.getElementById('sidebar-toggle')
  if (btn) btn.setAttribute('aria-expanded', String(!collapsed))
}

function _readCollapsed() {
  try { return localStorage.getItem(STORAGE_KEY) === 'true' } catch (_) { return false }
}
function _saveCollapsed(val) {
  try { localStorage.setItem(STORAGE_KEY, String(val)) } catch (_) {}
}

// Auto-init — modules are deferred so DOM is ready when this runs
initNav()
