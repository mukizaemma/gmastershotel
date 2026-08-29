import { applyAutoSlug } from '../../../core/fields/slug.js'
import { previewUpload } from '../../../core/fields/pageHero.js'
import { rowActionsField, withRowActions } from '../../../core/fields/rowActions.js'
import { countRoomImages } from './roomImages.js'

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
    defaultColumns: withRowActions(['image', 'name', 'imageCount', 'units', 'pricePerNight']),
    description: 'Click a room name or Edit to change it. Slug is generated from the name.',
  },
  forceSelect: {
    image: true,
    gallery: true,
  },
  hooks: {
    beforeValidate: [applyAutoSlug],
    beforeChange: [
      ({ data }) => {
        if (data?.image && (!data.gallery || data.gallery.length === 0)) {
          const photo = typeof data.image === 'object' ? data.image.id : data.image
          if (photo) data.gallery = [{ photo }]
        }
        if (data) data.imageCount = countRoomImages(data)
        return data
      },
    ],
    afterRead: [
      ({ doc }) => {
        if (doc && Array.isArray(doc.gallery)) doc.imageCount = countRoomImages(doc)
        return doc
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
      fields: [
        { name: 'size', type: 'text', admin: { width: '25%' } },
        { name: 'bed', type: 'text', admin: { width: '25%' } },
        { name: 'occupancy', type: 'text', admin: { width: '25%' } },
        { name: 'view', type: 'text', admin: { width: '25%' } },
        { name: 'smoking', type: 'text', admin: { width: '25%' } },
        { name: 'breakfast', type: 'text', admin: { width: '25%' } },
      ],
    },
    previewUpload('image', { admin: { width: '25%' } }),
    {
      name: 'gallery',
      type: 'array',
      maxRows: 12,
      admin: {
        width: '100%',
        description: 'Room photos in a grid. Add several at once — files over 700KB are resized first.',
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
