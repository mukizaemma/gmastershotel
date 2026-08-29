import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './src/core/users/Users.js'
import { Media } from './src/core/files/Media.js'
import { Company } from './src/core/settings/Company.js'
import { Navigation } from './src/core/settings/Navigation.js'

import { Rooms } from './src/modules/hotel/rooms/Rooms.js'
import { Experiences } from './src/modules/hotel/experiences/Experiences.js'
import { Bookings } from './src/modules/hotel/reservations/Bookings.js'
import { AvailabilityBlocks } from './src/modules/hotel/reservations/AvailabilityBlocks.js'
import { GalleryPhotos } from './src/modules/hotel/gallery/GalleryPhotos.js'

import { Pages } from './src/modules/hotel/pages/Pages.js'
import { Amenities } from './src/modules/hotel/amenities/Amenities.js'
import { MenuItems } from './src/modules/hotel/menu/MenuItems.js'
import { SiteAudit } from './src/core/settings/SiteAudit.js'
import { UserGuide } from './src/core/settings/UserGuide.js'
import { HandoverFeedback } from './src/modules/hotel/feedback/HandoverFeedback.js'
import { createEmailAdapter } from './src/core/security/email.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URI
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174'
const serverUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001'
const allowedOrigins = [...new Set([
  frontendUrl,
  serverUrl,
  'https://gmastershotel.com',
  'https://www.gmastershotel.com',
  'https://demov2.iremetech.com',
  'https://www.demov2.iremetech.com',
].filter(Boolean))]

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  serverURL: serverUrl,
  db: mongooseAdapter({
    url: mongoUri,
  }),
  editor: lexicalEditor(),
  email: createEmailAdapter(),
  sharp,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '',
      favicon: '/favicon.svg',
    },
    components: {
      graphics: {
        Logo: './src/components/payload/Logo/index.jsx#Logo',
        Icon: './src/components/payload/Icon/index.jsx#Icon',
      },
      beforeDashboard: ['./src/components/payload/BookingsDashboard/index.jsx#BookingsDashboard'],
      beforeNavLinks: ['./src/components/payload/HotelNav/index.jsx#HotelNav'],
      providers: ['./src/components/payload/AdminChrome/index.jsx#AdminChrome'],
    },
  },
  collections: [Users, Media, Rooms, GalleryPhotos, Bookings, AvailabilityBlocks, Experiences, Amenities, MenuItems, HandoverFeedback],
  globals: [
    Company,
    Navigation,
    Pages,
    SiteAudit,
    UserGuide,
  ],
  cors: allowedOrigins,
  csrf: allowedOrigins,
  graphQL: {
    disable: true,
  },
})
