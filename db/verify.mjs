// Verify DB rows and the /api/portfolio handler output shape.
// Usage: node --env-file=.env db/verify.mjs

import portfolioHandler from '../api/portfolio.js'

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k, v) {
      this.headers[k] = v
    },
    status(code) {
      this.statusCode = code
      return this
    },
    json(data) {
      this.body = data
      return this
    },
    end() {
      return this
    },
  }
  return res
}

const req = { method: 'GET', query: {}, headers: {} }
const res = mockRes()

await portfolioHandler(req, res)

console.log('status:', res.statusCode)
if (res.statusCode !== 200) {
  console.error('body:', res.body)
  process.exit(1)
}

const d = res.body
const summary = {
  profile: d.profile,
  skills: d.skills.length,
  skillCategories: d.skillCategories.length,
  projects: d.projects.length,
  projectCategories: d.projectCategories.length,
  education: d.education.length,
  experience: d.experience.length,
  contactChannels: d.contactChannels.length,
  statsConfig: d.statsConfig,
  contentEnHero: d.content.en.hero,
  contentEnBio: d.content.en.about?.bio?.length,
  contentIdBio: d.content.id.about?.bio?.length,
  contactCardsEn: Object.keys(d.content.en.contactCards || {}),
}

console.log(JSON.stringify(summary, null, 2))
console.log('\nFirst project:', JSON.stringify(d.projects[0], null, 2))
console.log('\nFirst experience EN points:', JSON.stringify(d.experience[0]?.en?.points, null, 2))
console.log('\nEducation EN:', JSON.stringify(d.education[0]?.en, null, 2))
console.log('\nContact card EN gmail:', JSON.stringify(d.content.en.contactCards?.gmail, null, 2))
