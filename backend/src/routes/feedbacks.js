/* routes/feedbacks.js — StoryFeedback CRUD
   Lean Storytelling v0.4.0
*/

import sql from '../db/client.js'

async function _ownsVersion(userId, versionId) {
  const [row] = await sql`
    SELECT sv.id FROM story_versions sv
    JOIN stories s ON s.id = sv.story_id
    WHERE sv.id = ${versionId} AND s.user_id = ${userId}
  `
  return !!row
}

async function _ownsFeedback(userId, feedbackId) {
  const [row] = await sql`
    SELECT sf.id FROM story_feedbacks sf
    JOIN story_versions sv ON sv.id = sf.story_version_id
    JOIN stories s ON s.id = sv.story_id
    WHERE sf.id = ${feedbackId} AND s.user_id = ${userId}
  `
  return !!row
}

export default async function feedbackRoutes(fastify) {
  const auth = { preHandler: fastify.authenticate }

  // GET /api/stories/:storyId/versions/:versionId/feedbacks
  fastify.get('/stories/:storyId/versions/:versionId/feedbacks', auth, async (req, reply) => {
    const { versionId } = req.params
    if (!await _ownsVersion(req.user.sub, versionId)) {
      return reply.code(403).send({ error: 'forbidden', message: 'Access denied.' })
    }
    const feedbacks = await sql`
      SELECT id, story_version_id, third_party, self_impression, created_at, updated_at
      FROM story_feedbacks
      WHERE story_version_id = ${versionId}
      ORDER BY created_at DESC
    `
    return reply.send(feedbacks)
  })

  // POST /api/stories/:storyId/versions/:versionId/feedbacks
  fastify.post('/stories/:storyId/versions/:versionId/feedbacks', auth, async (req, reply) => {
    const { versionId } = req.params
    if (!await _ownsVersion(req.user.sub, versionId)) {
      return reply.code(403).send({ error: 'forbidden', message: 'Access denied.' })
    }

    const { third_party = null, self_impression = null } = req.body || {}

    const [feedback] = await sql`
      INSERT INTO story_feedbacks (story_version_id, third_party, self_impression)
      VALUES (${versionId}, ${third_party}, ${self_impression})
      RETURNING id, story_version_id, third_party, self_impression, created_at, updated_at
    `
    return reply.code(201).send(feedback)
  })

  // PATCH /api/feedbacks/:feedbackId
  fastify.patch('/feedbacks/:feedbackId', auth, async (req, reply) => {
    const { feedbackId } = req.params
    if (!await _ownsFeedback(req.user.sub, feedbackId)) {
      return reply.code(403).send({ error: 'forbidden', message: 'Access denied.' })
    }

    const { third_party, self_impression } = req.body || {}

    const [feedback] = await sql`
      UPDATE story_feedbacks
      SET
        third_party     = CASE WHEN ${third_party     !== undefined} THEN ${third_party     ?? null} ELSE third_party     END,
        self_impression = CASE WHEN ${self_impression !== undefined} THEN ${self_impression ?? null} ELSE self_impression END,
        updated_at      = now()
      WHERE id = ${feedbackId}
      RETURNING id, third_party, self_impression, updated_at
    `
    return reply.send(feedback)
  })

  // DELETE /api/feedbacks/:feedbackId
  fastify.delete('/feedbacks/:feedbackId', auth, async (req, reply) => {
    const { feedbackId } = req.params
    if (!await _ownsFeedback(req.user.sub, feedbackId)) {
      return reply.code(403).send({ error: 'forbidden', message: 'Access denied.' })
    }
    await sql`DELETE FROM story_feedbacks WHERE id = ${feedbackId}`
    return reply.code(204).send()
  })
}
