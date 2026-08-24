import { previewUpload } from '../../../core/fields/pageHero.js'
import { HomePage } from './HomePage.js'
import { AboutPage } from './AboutPage.js'
import { RoomsPage } from './RoomsPage.js'
import { BarRestaurantPage } from './BarRestaurantPage.js'
import { ThingsToDoPage } from './ThingsToDoPage.js'
import { GalleryPage } from './GalleryPage.js'
import { ContactPage } from './ContactPage.js'
import { BookingPage } from './BookingPage.js'
import { PolicyPage } from './PolicyPage.js'

export const PAGE_GROUPS = [
  { key: 'home', slug: 'home-page', label: 'Home' },
  { key: 'about', slug: 'about-page', label: 'About' },
  { key: 'rooms', slug: 'rooms-page', label: 'Accommodation' },
  { key: 'barRestaurant', slug: 'bar-restaurant-page', label: 'Bar & Restaurant' },
  { key: 'thingsToDo', slug: 'things-to-do-page', label: 'Things to do' },
  { key: 'gallery', slug: 'gallery-page', label: 'Gallery' },
  { key: 'contact', slug: 'contact-page', label: 'Contact us' },
  { key: 'booking', slug: 'booking-page', label: 'Booking' },
  { key: 'policy', slug: 'policy-page', label: 'Booking policy' },
]

function pageTab(label, name, fields, description) {
  return {
    label,
    description,
    fields: [
      {
        name,
        type: 'group',
        label: false,
        fields,
      },
    ],
  }
}

export const Pages = {
  slug: 'pages',
  label: 'Pages',
  admin: {
    group: false,
    description: 'All public pages in one place. Set a default header, then override it on any page.',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Default header',
          description: 'Used on every page that does not set its own header image.',
          fields: [
            previewUpload('defaultHeaderImage', {
              admin: {
                width: '50%',
                description:
                  'Shown on About, Accommodation, Gallery, and other pages when that page has no header image.',
              },
            }),
          ],
        },
        pageTab('Home', 'home', HomePage.fields, 'Homepage sections, in the same order as the public site.'),
        pageTab('About', 'about', AboutPage.fields),
        pageTab('Accommodation', 'rooms', RoomsPage.fields),
        pageTab('Bar & Restaurant', 'barRestaurant', BarRestaurantPage.fields),
        pageTab('Things to do', 'thingsToDo', ThingsToDoPage.fields),
        pageTab('Gallery', 'gallery', GalleryPage.fields),
        pageTab('Contact us', 'contact', ContactPage.fields),
        pageTab('Booking', 'booking', BookingPage.fields),
        pageTab('Booking policy', 'policy', PolicyPage.fields),
      ],
    },
  ],
}
