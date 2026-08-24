import { getPayload } from 'payload'
import config from '../payload.config.js'

function arg(name, fallback = '') {
  const flag = process.argv.find((item) => item.startsWith(`--${name}=`))
  if (flag) return flag.slice(name.length + 3)
  const index = process.argv.indexOf(`--${name}`)
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1]
  return fallback
}

const email = arg('email', process.env.ADMIN_EMAIL).trim()
const password = arg('password', process.env.ADMIN_PASSWORD)
const firstName = arg('firstName', process.env.ADMIN_FIRST_NAME || 'Admin')
const lastName = arg('lastName', process.env.ADMIN_LAST_NAME || '')

if (!process.env.MONGODB_URI && !process.env.DATABASE_URI) {
  console.error('Missing MONGODB_URI in backend/.env')
  process.exit(1)
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('Missing PAYLOAD_SECRET in backend/.env')
  process.exit(1)
}

if (!email || !password) {
  console.error('Usage: npm run create-admin -- --email you@example.com --password "your-password"')
  process.exit(1)
}

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
  overrideAccess: true,
})

if (existing.totalDocs > 0) {
  console.error(`A user with ${email} already exists in Atlas (gmastershotel.users).`)
  process.exit(1)
}

const user = await payload.create({
  collection: 'users',
  data: {
    email,
    password,
    firstName,
    lastName,
    role: 'admin',
    status: 'active',
  },
  overrideAccess: true,
})

const adminUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001'
console.log(`Created admin ${user.email} (${user.id}) in Atlas database gmastershotel.`)
console.log(`Sign in at ${adminUrl}/admin`)
process.exit(0)
