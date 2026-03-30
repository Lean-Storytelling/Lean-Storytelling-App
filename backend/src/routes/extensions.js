/* routes/extensions.js — StoryExtension CRUD
   Lean Storytelling v0.4.0
*/

import sql from '../db/client.js'

const VALID_ELEMENT_TYPES = new Set(['challenge', 'data', 'quote', 'alternative', 'fail', 'call_to_action'])
const VALID_ANCHORS = new Set([
  'before_context', 'after_context', 'after_target', 'after_empathy',
  'after_problem', 'after_consequences', 'after_solution', 'after_benefits', 'after_why'
])

async function _ownsVersion(userId, versionId) {
  const [row] = await sql`
    SELECT sv.id FROM story_versions sv
    JOIN stories s ON s.id = sv.story_id
    WHERE sv.id = ${versionId} AND s.user_id = ${userId}
  `
  return !!row
}

async function _ownsExtension(userId, extensionId) {
  const [row] = await sql`
    SELECT se.id FROM story_extensions se
    JOIN story_versions sv ON sv.id = se.story_version_id
    JOIN stories s ON s.id = sv.story_id
    WHERE se.id = ${extensionId} AND s.user_id = ${userId}
  `
  return !!row
}

export default async function extensionRoutes(fastify) {
  const auth = { preHandler: fastify.authenticate }

  // GET /api/stories/:storyId/versions/:versionId/extensions
  fastify.get('/stories/:storyId/versions/:versionId/extensions', auth, async (req, reply) => {
    const { versionId } = req.params
    if (!await _ownsVersion(req.user.sub, versionId)) {
      return reply.code(403).send({ error: 'forbidden', message: 'Access denied.' })
    }
    const extensions = await sql`
      SELECT id, story_version_id, element_type, content, anchor, sort_order, created_at, updated_at
      FROM story_extensions
      WHERE story_version_id = ${versionId}
      ORDER BY anchor, sort_order
    `
    return reply.send(extensions)
  })

  // POST /api/stories/:storyId/versions/:versionId/extensions
  fastify.post('/stories/:storyId/versions/:versionId/extensions', auth, async (req, reply) => {
    const { versionId } = req.params
    if (!await _ownsVersion(req.user.sub, versionId)) {
      return reply.code(403).send({ error: 'forbidden', message: 'Access denied.' })
    }

    const { element_type, content = null, anchor = 'after_why', sort_order } = req.body || {}

    if (!element_type || !VALID_ELEMENT_TYPES.has(element_type)) {
      return reply.code(400).send({ error: 'validation_error', message: 'Invalid element_type.' })
    }
    if (!VALID_ANCHORS.has(anchor)) {
      return reply.code(400).send({ error: 'validation_error', message: 'Invalid anchor.' })
    }

    // Auto-assign sort_order if not provided
    let order = sort_order
    if (order == null) {
      const [max] = await sql`
        SELECT COALESCE(MAX(sort_order), 0) AS max_order
        FROM story_extensions
        WHERE story_version_id = ${versionId} AND anchor = ${anchor}
      `
      order = (max?.max_order ?? 0) + 1
    }

    const [ext] = await sql`
      INSERT INTO story_extensions (story_version_id, element_type, content, anchor, sort_order)
      VALUES (${versionId}, ${element_type}, ${content}, ${anchor}, ${order})
      RETURNING id, story_version_id, element_type, content, anchor, sort_order, created_at, updated_at
    `
    return reply.code(201).send(ext)
  })

  // PATCH /api/extensions/:extensionId
  fastify.patch('/extensions/:extensionId', auth, async (req, reply) => {
    const { extensionId } = req.params
    if (!await _ownsExtension(req.user.sub, extensionId)) {
      return reply.code(403).send({ error: 'forbidden', message: 'Access denied.' })
    }

    const { content, anchor, sort_order } = req.body || {}

    if (anchor !== undefined && !VALID_ANCHORS.has(anchor)) {
      return reply.code(400).send({ error: 'validation_error', message: 'Invalid anchor.' })
    }

    const updates = {}
    if (content !== undefined) updates.content = content
    if (anchor !== undefined) updates.anchor = anchor
    if (sort_order !== undefined) updates.sort_order = sort_order

    if (Object.keys(updates).length === 0) {
      const [ext] = await sql`SELECT id, content, anchor, sort_order, updated_at FROM story_extensions WHERE id = ${extensionId}`
      return reply.send(ext)
    }

    const [ext] = await sql`
      UPDATE story_extensions
      SET
        content    = COALESCE(${updates.content    ?? null}, content),
        anchor     = COALESCE(${updates.anchor     ?? null}::extension_anchor, anchor),
        sort_order = COALESCE(${updates.sort_order ?? null}, sort_order),
        updated_at = now()
      WHERE id = ${extensionId}
      RETURNING id, content, anchor, sort_order, updated_at
    `
    return reply.send(ext)
  })

  // DELETE /api/extensions/:extensionId
  fastify.delete('/extensions/:extensionId', auth, async (req, reply) => {
    const { extensionId } = req.params
    if (!await _ownsExtension(req.user.sub, extensionId)) {
      return reply.code(403).send({ error: 'forbidden', message: 'Access denied.' })
    }
    await sql`DELETE FROM story_extensions WHERE id = ${extensionId}`
    return reply.code(204).send()
  })
}
