/* routes/deliveries.js — StoryDelivery CRUD
   Lean Storytelling v0.4.0
*/

import sql from '../db/client.js'

const VALID_FORMATS = new Set(['text', 'slides', 'live'])

async function _ownsVersion(userId, versionId) {
  const [row] = await sql`
    SELECT sv.id FROM story_versions sv
    JOIN stories s ON s.id = sv.story_id
    WHERE sv.id = ${versionId} AND s.user_id = ${userId}
  `
  return !!row
}

async function _ownsDelivery(userId, deliveryId) {
  const [row] = await sql`
    SELECT sd.id FROM story_deliveries sd
    JOIN story_versions sv ON sv.id = sd.story_version_id
    JOIN stories s ON s.id = sv.story_id
    WHERE sd.id = ${deliveryId} AND s.user_id = ${userId}
  `
  return !!row
}

export default async function deliveryRoutes(fastify) {
  const auth = { preHandler: fastify.authenticate }

  // GET /api/stories/:storyId/versions/:versionId/deliveries
  fastify.get('/stories/:storyId/versions/:versionId/deliveries', auth, async (req, reply) => {
    const { versionId } = req.params
    if (!await _ownsVersion(req.user.sub, versionId)) {
      return reply.code(403).send({ error: 'forbidden', message: 'Access denied.' })
    }
    const deliveries = await sql`
      SELECT id, story_version_id, audience, context, format, created_at, updated_at
      FROM story_deliveries
      WHERE story_version_id = ${versionId}
      ORDER BY created_at DESC
    `
    return reply.send(deliveries)
  })

  // POST /api/stories/:storyId/versions/:versionId/deliveries
  fastify.post('/stories/:storyId/versions/:versionId/deliveries', auth, async (req, reply) => {
    const { versionId } = req.params
    if (!await _ownsVersion(req.user.sub, versionId)) {
      return reply.code(403).send({ error: 'forbidden', message: 'Access denied.' })
    }

    const { audience = null, context = null, format = null } = req.body || {}

    if (format !== null && !VALID_FORMATS.has(format)) {
      return reply.code(400).send({ error: 'validation_error', message: 'Invalid format.' })
    }

    const [delivery] = await sql`
      INSERT INTO story_deliveries (story_version_id, audience, context, format)
      VALUES (${versionId}, ${audience}, ${context}, ${format})
      RETURNING id, story_version_id, audience, context, format, created_at, updated_at
    `
    return reply.code(201).send(delivery)
  })

  // PATCH /api/deliveries/:deliveryId
  fastify.patch('/deliveries/:deliveryId', auth, async (req, reply) => {
    const { deliveryId } = req.params
    if (!await _ownsDelivery(req.user.sub, deliveryId)) {
      return reply.code(403).send({ error: 'forbidden', message: 'Access denied.' })
    }

    const { audience, context, format } = req.body || {}

    if (format !== undefined && format !== null && !VALID_FORMATS.has(format)) {
      return reply.code(400).send({ error: 'validation_error', message: 'Invalid format.' })
    }

    const [delivery] = await sql`
      UPDATE story_deliveries
      SET
        audience   = CASE WHEN ${audience   !== undefined} THEN ${audience   ?? null} ELSE audience   END,
        context    = CASE WHEN ${context    !== undefined} THEN ${context    ?? null} ELSE context    END,
        format     = CASE WHEN ${format     !== undefined} THEN ${format     ?? null}::delivery_format ELSE format END,
        updated_at = now()
      WHERE id = ${deliveryId}
      RETURNING id, audience, context, format, updated_at
    `
    return reply.send(delivery)
  })

  // DELETE /api/deliveries/:deliveryId
  fastify.delete('/deliveries/:deliveryId', auth, async (req, reply) => {
    const { deliveryId } = req.params
    if (!await _ownsDelivery(req.user.sub, deliveryId)) {
      return reply.code(403).send({ error: 'forbidden', message: 'Access denied.' })
    }
    await sql`DELETE FROM story_deliveries WHERE id = ${deliveryId}`
    return reply.code(204).send()
  })
}
