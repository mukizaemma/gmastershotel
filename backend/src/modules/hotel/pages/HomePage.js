import { buttonsBlock, headerImageBlock, previewUpload, textContentBlock } from '../../../core/fields/pageHero.js'

const FEATURE_ICONS = [
  { label: 'Breakfast / coffee', value: 'coffee' },
  { label: 'Wi-Fi', value: 'wifi' },
  { label: 'Location', value: 'map-pin' },
  { label: 'Rooms / bed', value: 'bed' },
  { label: 'Parking', value: 'parking' },
  { label: 'Restaurant', value: 'utensils' },
  { label: 'Pool', value: 'waves' },
  { label: 'Concierge', value: 'bell' },
]

function unnamedGroup(name, fields, extra = {}) {
  return {
    name,
    type: 'group',
    label: false,
    ...extra,
    fields,
  }
}

export const HomePage = {
  slug: 'home-page',
  label: 'Home',
  admin: {
    group: false,
    description: 'Same sections as the public home page, in the same order.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          description: 'Top slider. The two buttons appear on every slide.',
          fields: [
            unnamedGroup('hero', [
              {
                name: 'slides',
                type: 'array',
                minRows: 1,
                labels: { singular: 'Slide', plural: 'Slides' },
                fields: [
                  textContentBlock([
                    { name: 'eyebrow', type: 'text', admin: { width: '25%' } },
                    {
                      name: 'headline',
                      type: 'text',
                      required: true,
                      admin: { width: '75%', className: 'hero-headline' },
                    },
                    { name: 'subline', type: 'richText' },
                  ]),
                  headerImageBlock(
                    previewUpload('image', {
                      admin: {
                        description: 'Leave empty to use the default header image on Pages.',
                      },
                    }),
                  ),
                ],
              },
              buttonsBlock([
                {
                  name: 'cta',
                  type: 'group',
                  label: 'Primary button',
                  admin: { width: '50%', className: 'hero-cta-card' },
                  fields: [
                    { name: 'label', type: 'text', defaultValue: 'Book your stay', admin: { width: '50%' } },
                    { name: 'link', type: 'text', defaultValue: '/book', admin: { width: '50%' } },
                  ],
                },
                {
                  name: 'secondaryCta',
                  type: 'group',
                  label: 'Secondary button',
                  admin: { width: '50%', className: 'hero-cta-card' },
                  fields: [
                    { name: 'label', type: 'text', defaultValue: 'Explore rooms', admin: { width: '50%' } },
                    { name: 'link', type: 'text', defaultValue: '/accommodation', admin: { width: '50%' } },
                  ],
                },
              ]),
            ]),
          ],
        },
        {
          label: 'Features',
          description: 'Four short highlights directly under the hero.',
          fields: [
            {
              name: 'features',
              type: 'array',
              label: false,
              labels: { singular: 'Feature', plural: 'Features' },
              admin: { initCollapsed: false },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  defaultValue: 'wifi',
                  admin: { width: '25%' },
                  options: FEATURE_ICONS,
                },
                { name: 'title', type: 'text', required: true, admin: { width: '75%' } },
                { name: 'text', type: 'textarea', admin: { width: '100%' } },
              ],
            },
          ],
        },
        {
          label: 'Welcome',
          admin: { hidden: true },
          fields: [
            unnamedGroup('welcome', [
              { name: 'eyebrow', type: 'text' },
              { name: 'headline', type: 'text' },
              { name: 'body', type: 'richText' },
              {
                name: 'cta',
                type: 'group',
                fields: [
                  { name: 'label', type: 'text' },
                  { name: 'path', type: 'text' },
                ],
              },
              previewUpload('primaryImage'),
              previewUpload('secondaryImage'),
              {
                name: 'reviewBadges',
                type: 'array',
                fields: [
                  { name: 'source', type: 'text' },
                  { name: 'score', type: 'number' },
                  { name: 'tier', type: 'text' },
                  { name: 'reviewCount', type: 'number' },
                ],
              },
            ]),
          ],
        },
        {
          label: 'Rooms',
          description: 'Heading only. Individual rooms are edited under Rooms.',
          fields: [
            unnamedGroup('roomsSection', [
              { name: 'eyebrow', type: 'text', defaultValue: 'Stay', admin: { width: '25%' } },
              {
                name: 'headline',
                type: 'text',
                defaultValue: 'Rooms made for real rest',
                admin: { width: '75%' },
              },
              {
                name: 'intro',
                type: 'textarea',
                defaultValue: 'Quiet nights, thoughtful details, and space to unwind by Lake Kivu.',
                admin: { width: '100%' },
              },
            ]),
          ],
        },
        {
          label: 'Stay points',
          description:
            'Short lines shown in the site footer above the Google map. Paste the map in Site setting → Address & map.',
          fields: [
            unnamedGroup('location', [
              {
                name: 'highlights',
                type: 'array',
                labels: { singular: 'Stay point', plural: 'Stay points' },
                fields: [{ name: 'text', type: 'text', required: true }],
              },
              { name: 'eyebrow', type: 'text', admin: { hidden: true } },
              { name: 'headline', type: 'text', admin: { hidden: true } },
              { name: 'body', type: 'richText', admin: { hidden: true } },
              {
                name: 'cta',
                type: 'group',
                admin: { hidden: true },
                fields: [
                  { name: 'label', type: 'text' },
                  { name: 'path', type: 'text' },
                ],
              },
              previewUpload('image', { admin: { hidden: true } }),
            ]),
          ],
        },
        {
          label: 'Closing banner',
          description: 'Full-screen photo at the bottom of Home, with a large quote and Book Now.',
          fields: [
            unnamedGroup('cta', [
              textContentBlock([
                { name: 'eyebrow', type: 'text', admin: { width: '25%' } },
                {
                  name: 'headline',
                  type: 'text',
                  label: 'Quote',
                  admin: { width: '75%', description: 'Large italic line over the photo. Leave blank to use the default quote.' },
                },
                { name: 'body', type: 'richText', label: 'Supporting text' },
              ]),
              {
                name: 'cta',
                type: 'group',
                label: 'Book Now button',
                admin: { width: '50%', className: 'hero-cta-card' },
                fields: [
                  { name: 'label', type: 'text', defaultValue: 'Book Now', admin: { width: '50%' } },
                  { name: 'path', type: 'text', defaultValue: '/book', admin: { width: '50%' } },
                ],
              },
              previewUpload('backgroundImage'),
            ]),
          ],
        },
      ],
    },
    {
      name: 'barRestaurantSpotlight',
      type: 'group',
      admin: { hidden: true },
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'body', type: 'richText' },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      admin: { hidden: true },
      fields: [
        { name: 'value', type: 'text' },
        { name: 'label', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'amenities',
      type: 'array',
      admin: { hidden: true },
      fields: [
        { name: 'icon', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'richText' },
      ],
    },
    {
      name: 'videoShowcase',
      type: 'group',
      admin: { hidden: true },
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
        { name: 'videoUrl', type: 'text' },
      ],
    },
  ],
}
