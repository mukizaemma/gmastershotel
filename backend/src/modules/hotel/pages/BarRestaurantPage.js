import {
  buttonsBlock,
  headerImageBlock,
  pageCopyFields,
  previewUpload,
  textContentBlock,
} from '../../../core/fields/pageHero.js'

export const BarRestaurantPage = {
  slug: 'bar-restaurant-page',
  label: 'Dining page',
  admin: { group: false },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        textContentBlock(pageCopyFields),
        headerImageBlock(previewUpload('backgroundImage')),
        buttonsBlock(),
        {
          name: 'videoUrl',
          type: 'upload',
          relationTo: 'media',
          displayPreview: true,
          filterOptions: {
            mimeType: {
              contains: 'video/',
            },
          },
          admin: {
            width: '50%',
            description: 'Choose an existing video or upload a new one.',
            components: {
              Cell: './src/components/payload/ListCells/index.jsx#ThumbnailCell',
            },
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Home page section',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'homeSpotlight',
          type: 'group',
          label: false,
          admin: {
            description: 'Headline, highlights, and photos shown on the public home page.',
          },
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Dining', admin: { width: '25%' } },
            {
              name: 'headline',
              type: 'text',
              defaultValue: 'Breakfast, then the dish you have in mind',
              admin: { width: '75%', className: 'hero-headline' },
            },
            {
              name: 'intro',
              type: 'textarea',
              defaultValue:
                'Guests enjoy breakfast as part of a bed-and-breakfast stay. Our chefs can prepare any dish you choose, and a buffet for nearby offices is coming soon.',
              admin: { width: '100%' },
            },
            {
              name: 'features',
              type: 'array',
              maxRows: 3,
              labels: { singular: 'Highlight', plural: 'Highlights' },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  defaultValue: 'coffee',
                  admin: { width: '25%' },
                  options: [
                    { label: 'Breakfast / coffee', value: 'coffee' },
                    { label: 'Chef / cooked to order', value: 'drinks' },
                    { label: 'Food', value: 'food' },
                    { label: 'Buffet / offices', value: 'buffet' },
                  ],
                },
                { name: 'title', type: 'text', required: true, admin: { width: '75%' } },
                { name: 'text', type: 'textarea', admin: { width: '100%' } },
              ],
            },
            {
              name: 'images',
              type: 'array',
              maxRows: 4,
              labels: { singular: 'Photo', plural: 'Photos' },
              admin: {
                description: 'Up to four photos on the home dining section. Add several at once.',
                components: {
                  Field: './src/components/payload/MediaGridField/index.jsx#MediaGridField',
                },
              },
              fields: [previewUpload('image')],
            },
            {
              name: 'cta',
              type: 'group',
              label: 'Button',
              admin: { width: '50%', className: 'hero-cta-card' },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  defaultValue: 'See breakfast & dining',
                  admin: { width: '50%' },
                },
                { name: 'path', type: 'text', defaultValue: '/bar-restaurant', admin: { width: '50%' } },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'hours',
      type: 'array',
      admin: {
        description: 'Leave empty to show breakfast, dishes to order, and buffet coming soon.',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          admin: { width: '25%' },
          options: [
            { label: 'Breakfast', value: 'breakfast' },
            { label: 'Dishes to order', value: 'custom' },
            { label: 'Buffet', value: 'buffet' },
            { label: 'Restaurant & Bar', value: 'restaurant-bar' },
          ],
        },
        { name: 'label', type: 'text', required: true, admin: { width: '25%' } },
        { name: 'hours', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    {
      name: 'panels',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'description', type: 'richText' },
        previewUpload('backgroundImage', { admin: { width: '50%' } }),
      ],
      admin: {
        description: 'Optional extra story panels. Leave empty — the dining gallery covers this.',
      },
    },
    {
      name: 'dining',
      type: 'group',
      admin: {
        description:
          'Public dining story and food photos. There is no guest-facing menu yet. Menu items in the sidebar can wait until the buffet opens.',
      },
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Bed & breakfast', admin: { width: '25%' } },
        {
          name: 'headline',
          type: 'text',
          defaultValue: 'Guests eat well. Tell us what you would like.',
          admin: { width: '75%' },
        },
        {
          name: 'intro',
          type: 'textarea',
          defaultValue:
            'We are not a full restaurant yet. Hotel guests enjoy breakfast, and our chefs can cook any dish you have in mind. A buffet for nearby offices and workers is on the way.',
        },
        {
          name: 'images',
          type: 'array',
          labels: { singular: 'Photo', plural: 'Photos' },
          admin: {
            description: 'Breakfast and dish photos. Add several at once. These appear on the dining page.',
            components: {
              Field: './src/components/payload/MediaGridField/index.jsx#MediaGridField',
            },
          },
          fields: [
            previewUpload('image'),
            { name: 'caption', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      name: 'video',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', admin: { width: '25%' } },
        { name: 'headline', type: 'text', admin: { width: '75%' } },
        { name: 'videoUrl', type: 'text', admin: { width: '50%' } },
        previewUpload('backgroundImage', { admin: { width: '50%' } }),
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        {
          name: 'headline',
          type: 'text',
          defaultValue: 'Tell us what you would like to eat',
          admin: { width: '50%' },
        },
        { name: 'buttonLabel', type: 'text', defaultValue: 'Contact us', admin: { width: '25%' } },
        { name: 'buttonPath', type: 'text', defaultValue: '/contact', admin: { width: '25%' } },
        { name: 'body', type: 'richText' },
      ],
    },
  ],
}
