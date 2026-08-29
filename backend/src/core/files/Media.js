import path from 'path'
import { fileURLToPath } from 'url'
import { isUploadedFilename } from './mediaCaption.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media = {
  slug: 'media',
  labels: {
    singular: 'File',
    plural: 'Media Gallery',
  },
  defaultSort: '-updatedAt',
  admin: {
    group: false,
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'showOnGallery', 'updatedAt'],
    description: 'Library of images and videos. Create New accepts several files at once. Gallery category is only for the public Gallery page — not needed when you pick a file for a page field.',
    pagination: {
      defaultLimit: 18,
      limits: [18, 36, 54, 90],
    },
    components: {
      views: {
        list: {
          Component: './src/components/payload/MediaGalleryList/index.jsx#MediaGalleryList',
        },
        edit: {
          default: {
            Component: './src/components/payload/MediaBulkCreate/index.jsx#MediaEditView',
          },
        },
      },
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    staticDir: path.resolve(dirname, '../../../../storage/media'),
    // 1. Allow both image types and video types
    mimeTypes: [
      'image/*', 
      'video/mp4', 
      'video/webm', 
      'video/quicktime' // supports .mov
    ],
    // 2. Point to a fallback icon for videos in the admin view
    adminThumbnail: ({ doc }) => {
      if (doc.mimeType?.startsWith('video/')) return doc.url || null
      return doc.sizes?.thumbnail?.url || doc.url
    },
    imageSizes: [
      { name: 'thumbnail', width: 400, height: undefined, position: 'centre' },
      { name: 'card', width: 900, height: undefined, position: 'centre' },
      { name: 'hero', width: 1600, height: undefined, position: 'centre' },
    ],
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data) return data
        if (data.galleryCategory != null) {
          data.showOnGallery = data.galleryCategory !== 'none'
        }
        if (isUploadedFilename(data.alt, data.filename)) data.alt = ''
        return data
      },
    ],
    afterRead: [
      ({ doc }) => {
        if (doc && isUploadedFilename(doc.alt, doc.filename)) doc.alt = ''
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      label: 'Caption',
      admin: {
        width: '25%',
        description: 'Optional. Shown on the public gallery — not the uploaded file name.',
      },
    },
    {
      name: 'galleryCategory',
      type: 'select',
      defaultValue: 'none',
      admin: {
        width: '25%',
        description: 'Choose None to keep this file in the library only. Any other value publishes it on the Gallery page.',
        components: {
          Field: './src/components/payload/HideInDrawer/index.jsx#GalleryCategoryField',
        },
      },
      options: [
        { label: 'None — do not show on gallery', value: 'none' },
        { label: 'Rooms', value: 'rooms' },
        { label: 'Bar & Restaurant', value: 'bar-restaurant' },
        { label: 'Property & views', value: 'lake-grounds' },
        { label: 'Amenities', value: 'amenities' },
      ],
    },
    {
      name: 'galleryOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        width: '25%',
        description: 'Lower numbers appear first on the Gallery page.',
        components: {
          Field: './src/components/payload/HideInDrawer/index.jsx#GalleryOrderField',
        },
      },
    },
    {
      name: 'showOnGallery',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        width: '25%',
        description: 'Turned on automatically when a gallery category is chosen. None keeps it off the public gallery.',
        components: {
          Field: './src/components/payload/HideInDrawer/index.jsx#ShowOnGalleryField',
        },
      },
    },
  ],
}
