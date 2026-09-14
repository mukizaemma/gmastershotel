import { applyAutoSlug } from '../../../core/fields/slug.js'
import { previewUpload } from '../../../core/fields/pageHero.js'
import { rowActionsField, withRowActions } from '../../../core/fields/rowActions.js'
import { populateRoomCover, mediaId, mediaUrlFrom, syncRoomCover } from './roomImages.js'

export const Rooms = {
  slug: 'rooms',
  labels: {
    singular: 'Room',
    plural: 'Rooms',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: false,
    useAsTitle: 'name',
    defaultColumns: withRowActions(['coverUrl', 'name', 'imageCount', 'units', 'pricePerNight']),
    description: 'Click a room name or Edit to change it. Slug is generated from the name.',
  },
  forceSelect: {
    image: true,
    gallery: true,
    coverUrl: true,
  },
  hooks: {
    beforeValidate: [applyAutoSlug],
    beforeChange: [
      async ({ data, req }) => {
        syncRoomCover(data)
        const id = mediaId(data?.image)
        if (!id) {
          if (data) data.coverUrl = ''
          return data
        }
        try {
          const media = await req.payload.findByID({
            collection: 'media',
            id,
            depth: 0,
            disableErrors: true,
            overrideAccess: true,
          })
          data.coverUrl = mediaUrlFrom(media) || ''
        } catch {
          data.coverUrl = data.coverUrl || ''
        }
        return data
      },
    ],
    afterRead: [
      async ({ doc, req, context }) => {
        context.roomCoverCache = context.roomCoverCache || new Map()
        return populateRoomCover(doc, req, context.roomCoverCache)
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        width: '25%',
        components: {
          Cell: './src/components/payload/ListCells/index.jsx#RoomTitleCell',
        },
      },
    },
    {
      name: 'imageCount',
      type: 'number',
      label: 'Images',
      admin: {
        readOnly: true,
        components: {
          Field: './src/components/payload/ListCells/index.jsx#HiddenField',
          Cell: './src/components/payload/ListCells/index.jsx#ImageCountCell',
        },
      },
    },
    {
      name: 'pricePerNight',
      type: 'number',
      required: true,
      admin: { width: '25%' },
    },
    {
      name: 'units',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      admin: {
        width: '25%',
        description: 'How many physical rooms of this type. The website keeps the last room back when you have more than one, so OTAs or walk-ins can still take it.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      admin: { description: 'Room overview. Use the staff desk editor for a simpler writing toolbar.' },
    },
    {
      name: 'specs',
      type: 'group',
      label: 'At a glance',
      admin: {
        description: 'Short facts shown on the room page. Use everyday wording; leave a box blank if it does not apply.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'size',
              type: 'text',
              label: 'Room size',
              admin: { width: '33%', placeholder: 'e.g. 28 m²' },
            },
            {
              name: 'bed',
              type: 'text',
              label: 'Bed type',
              admin: { width: '33%', placeholder: 'e.g. King bed, or Twin beds' },
            },
            {
              name: 'occupancy',
              type: 'text',
              label: 'Sleeps',
              admin: { width: '34%', placeholder: 'e.g. 2 adults' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'view',
              type: 'text',
              label: 'View from the room',
              admin: { width: '33%', placeholder: 'e.g. Garden, lake, or city' },
            },
            {
              name: 'smoking',
              type: 'text',
              label: 'Smoking',
              admin: { width: '33%', placeholder: 'e.g. No smoking' },
            },
            {
              name: 'breakfast',
              type: 'text',
              label: 'Breakfast',
              admin: { width: '34%', placeholder: 'e.g. Included, or extra' },
            },
          ],
        },
      ],
    },
    {
      name: 'coverUrl',
      type: 'text',
      label: 'Cover',
      admin: {
        readOnly: true,
        description: 'Taken from Cover photo. Shown in this table so you can check it matches the room type.',
        components: {
          Field: './src/components/payload/ListCells/index.jsx#HiddenField',
          Cell: './src/components/payload/ListCells/index.jsx#CoverUrlCell',
        },
      },
    },
    previewUpload('image', {
      label: 'Cover photo',
      admin: {
        width: '50%',
        description: 'This is the photo in the rooms table and the first photo guests see.',
      },
    }),
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Photo', plural: 'Gallery' },
      maxRows: 12,
      admin: {
        width: '100%',
        description: 'Extra room photos. Add, remove, or reorder them. Files over 700KB are resized first.',
        components: {
          Field: './src/components/payload/MediaGridField/index.jsx#MediaGridField',
        },
      },
      fields: [
        previewUpload('photo', { required: true, admin: { width: '50%' } }),
      ],
    },
    {
      name: 'features',
      label: 'Amenities',
      type: 'text',
      hasMany: true,
      admin: {
        width: '100%',
        description: 'Tick what this room type offers. Add a custom amenity if it is not listed.',
        components: {
          Field: './src/components/payload/RoomAmenitiesField/index.jsx#RoomAmenitiesField',
        },
      },
    },
    rowActionsField,
  ],
}
