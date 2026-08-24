import { normalizeSocials, SOCIAL_PLATFORMS } from './socials.js'
import { previewUpload } from '../fields/pageHero.js'

export const Company = {
  slug: 'company',
  label: 'Site setting',
  admin: {
    group: false,
    description: 'Property name, contacts, SEO, and map.',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data) return data
        data.socials = normalizeSocials(data.socials)
        return data
      },
    ],
    afterRead: [
      ({ doc }) => {
        if (!doc) return doc
        doc.socials = normalizeSocials(doc.socials)
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company',
          fields: [
            { name: 'name', type: 'text', label: 'Property name', required: true, admin: { width: '25%' } },
            { name: 'tagline', type: 'text', admin: { width: '50%' } },
            { name: 'distanceFromKigali', type: 'text', admin: { width: '25%' } },
            previewUpload('logo', { admin: { width: '25%' } }),
          ],
        },
        {
          label: 'Contacts',
          fields: [
            { name: 'phone', type: 'text', admin: { width: '25%' } },
            {
              name: 'whatsapp',
              type: 'text',
              admin: { width: '25%', description: 'WhatsApp number with country code, e.g. 2507…' },
            },
            { name: 'email', type: 'text', admin: { width: '25%' } },
            {
              name: 'phoneSecondary',
              type: 'text',
              admin: { width: '25%', description: 'Optional second line' },
            },
          ],
        },
        {
          label: 'Social media',
          fields: [
            {
              name: 'socials',
              type: 'group',
              admin: {
                description:
                  'Paste a profile URL for each network. Leave a field blank to hide that icon on the website.',
              },
              fields: SOCIAL_PLATFORMS.map(({ name, label }) => ({
                name,
                type: 'text',
                label,
                admin: {
                  width: '25%',
                  description: 'Shown on the site only if this is a valid http(s) link.',
                },
              })),
            },
          ],
        },
        {
          label: 'Guest reviews',
          fields: [
            {
              name: 'reviews',
              type: 'group',
              label: false,
              admin: {
                description:
                  'Guests leave reviews on Google and TripAdvisor — this site does not store reviews. Paste the official links. The public page is /reviews — share that URL with guests.',
              },
              fields: [
                {
                  name: 'googleWriteUrl',
                  type: 'text',
                  label: 'Google — write a review',
                  admin: {
                    width: '50%',
                    description: 'Google Business “Ask for reviews” or Write a review link.',
                  },
                },
                {
                  name: 'googleReadUrl',
                  type: 'text',
                  label: 'Google — see reviews',
                  admin: {
                    width: '50%',
                    description: 'Your Google listing. Leave blank to reuse the write link.',
                  },
                },
                {
                  name: 'tripadvisorWriteUrl',
                  type: 'text',
                  label: 'TripAdvisor — write a review',
                  admin: { width: '50%' },
                },
                {
                  name: 'tripadvisorReadUrl',
                  type: 'text',
                  label: 'TripAdvisor — see reviews',
                  admin: {
                    width: '50%',
                    description: 'Leave blank to reuse the write link or the TripAdvisor social URL.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              admin: {
                width: '25%',
                description: 'Browser tab title for the homepage. Other pages append the company name.',
              },
            },
            {
              name: 'seoKeywords',
              type: 'text',
              admin: { width: '25%', description: 'Comma-separated keywords, e.g. Karongi apartment, Lake Kivu stay' },
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              admin: { width: '50%', description: 'Meta description for search engines and social previews.' },
            },
          ],
        },
        {
          label: 'Address & map',
          fields: [
            { name: 'address', type: 'textarea', admin: { width: '50%' } },
            {
              name: 'mapUrl',
              type: 'text',
              label: 'Directions URL',
              admin: {
                width: '50%',
                description: 'Google Maps link for the Get Directions button under Contact in the footer.',
              },
            },
            {
              name: 'mapEmbed',
              type: 'textarea',
              admin: {
                width: '50%',
                description:
                  'Optional map on the Contact page only. Google Maps → Share → Embed a map, then paste the iframe here.',
              },
            },
          ],
        },
        {
          label: 'Admin accounts',
          fields: [
            {
              name: 'adminAccountsNote',
              type: 'ui',
              admin: {
                components: {
                  Field: './src/components/payload/AdminAccountsNote/index.jsx#AdminAccountsNote',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
