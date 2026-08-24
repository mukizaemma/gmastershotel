export const HANDOVER_TABS = [
  { id: 'overview', label: 'What was delivered' },
  { id: 'access', label: 'How to sign in' },
  { id: 'settings', label: 'Hotel details' },
  { id: 'pages', label: 'Website pages' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'amenities', label: 'Hotel facilities' },
  { id: 'activities', label: 'Things to do' },
  { id: 'menu', label: 'Restaurant menu' },
  { id: 'gallery', label: 'Photos' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'reviews', label: 'Guest reviews' },
  { id: 'audit', label: 'Is the site ready?' },
  { id: 'feedback', label: 'Send a note' },
]

export const HANDOVER_CREDENTIALS = {
  email: 'admin@gmastershotel.com',
  password: 'Gmasters@202!',
}

export const HANDOVER_SECTIONS = {
  overview: {
    title: 'What was delivered',
    lead: 'GMasters Boutique Hotel has a public website for guests and a staff desk for the team. Share this page — it is public and does not require a login.',
    blocks: [
      {
        heading: 'Public website',
        body: 'Guests can browse without logging in. These pages are live:',
        steps: [
          'Home — hero, welcome points, rooms, restaurant spotlight, location, and a booking call to action.',
          'Accommodation — room cards with View room and Book now. Book now opens available dates; after check-in and check-out the guest goes to the booking form.',
          'Room page — photos, description, selected amenities, and a stay calendar.',
          'Bar & Restaurant — page copy plus the live menu.',
          'Things to do — activities. A price shows only if you entered one.',
          'Gallery — photos you marked to appear on the public gallery.',
          'About, Contact, Book a stay, Reviews, and Booking policy.',
        ],
      },
      {
        heading: 'Guest booking and contact',
        body: 'The stay calendar is the same on the room card, room page, booking page, and contact form.',
        steps: [
          'First calendar click is check-in. The next later click is check-out. Nights in between stay highlighted.',
          'Check-in and check-out fields sit under the calendar and fill in after those clicks.',
          'On Contact, General enquiry is only name, phone, email, and a message. Book a room asks for the room first, then shows that room’s available dates.',
          'Special requests on the booking guest step is an open box — no extra click.',
        ],
      },
      {
        heading: 'How you manage content',
        body: 'Two doors, same account and same content.',
        steps: [
          'Staff desk at /staff — simpler screens for rooms, pages, photos, menu, activities, and reservations.',
          'Full admin at /admin — the same content, plus the live site audit and handover notes.',
          'Use the contents list on this page for a step-by-step guide to each area.',
        ],
      },
    ],
  },
  access: {
    title: 'How to sign in',
    lead: 'Use the property admin account below. Change the password after you take over if you want a private one.',
    blocks: [
      {
        heading: 'Staff desk (everyday)',
        body: 'Open /staff, enter the email and password, then use the left menu. This is the usual place to add rooms, photos, and page text.',
        steps: [
          'Go to the Staff desk link in the box above.',
          'Sign in with the email and password shown on this page.',
          'Pick a section on the left and edit in the modal or form.',
          'Save. The public website updates from that content.',
        ],
      },
      {
        heading: 'Full admin',
        body: 'Open /admin with the same email and password if you prefer those screens, or to read Site audit and Handover notes.',
        steps: [
          'Open the Admin link in the box above.',
          'Sign in with the same account.',
          'Use the hotel menu: Site setting, Pages, Rooms, Bookings, and the rest.',
        ],
      },
      {
        heading: 'If you forget the password',
        body: 'On the login screen use Forgot password. A reset link is emailed to admin@gmastershotel.com. After handover, change the password in My account if you do not want this public page to remain the only copy.',
      },
    ],
  },
  settings: {
    title: 'Hotel details',
    lead: 'Hotel name, logo, phones, email, address, map, social links, and guest-review links all live here.',
    blocks: [
      {
        heading: 'Where to edit',
        body: 'Staff desk → Site setting, or Admin → Site setting.',
        steps: [
          'Open Site setting.',
          'Fill hotel name, logo, phone, WhatsApp, email, and address.',
          'Add a Google Maps link or embed so guests can get directions.',
          'Add social profile links you want in the footer.',
          'Under Guest reviews, paste the Google and TripAdvisor write and read links. Those power the public /reviews page and the footer “Leave a review” link.',
          'Save.',
        ],
      },
      {
        heading: 'What this controls',
        body: 'Footer, contact page, booking messages, and review links all read from Site setting. Empty phone or map fields show as gaps on the Site audit tab.',
      },
    ],
  },
  pages: {
    title: 'Website pages',
    lead: 'All public page copy sits in one Pages screen, with a tab per page. A default header image is used when a page has no header of its own.',
    blocks: [
      {
        heading: 'Where to edit',
        body: 'Staff desk → Pages, or Admin → Pages.',
        steps: [
          'Open Pages.',
          'Set Default header first — a photo used when a page has no header image.',
          'Open the tab for the page you want (Home, About, Accommodation, Bar & Restaurant, Things to do, Gallery, Contact, Booking).',
          'Edit the headline, intro, and any extra sections for that page.',
          'Add or replace the header image if this page should not use the default.',
          'Save.',
        ],
      },
      {
        heading: 'Home page',
        body: 'Home includes hero slides (photo and headline), welcome features, the rooms heading, restaurant spotlight, location copy, and the booking call to action. Restaurant photos that appear on Home are edited on the Bar & Restaurant tab, in the Home page section.',
      },
    ],
  },
  rooms: {
    title: 'Rooms',
    lead: 'Each room type needs a name, nightly rate, how many physical rooms, a description, photos, bed and occupancy, and in-room amenities.',
    blocks: [
      {
        heading: 'Add or edit a room',
        body: 'Staff desk → Accommodation, or Admin → Rooms.',
        steps: [
          'Click Add room (or Edit on an existing type).',
          'Enter name, price per night, and how many physical rooms of this type you have.',
          'Write the description.',
          'Add photos. You can select several files at once — they upload together. Or pick from the media library. The first photo is the main photo.',
          'Fill size, bed, guests, view, smoking, and breakfast if you use those.',
          'Below the form, tick the 3-star amenities that apply (Wi-Fi, AC, ensuite, desk, and so on). Add a new amenity if it is missing — it stays on the list for the next room.',
          'Save. The room appears on Accommodation and can be booked.',
        ],
      },
      {
        heading: 'What guests see',
        body: 'The accommodation list, the room page (amenities and gallery), and Book now on the card. Missing photos or fewer than three amenities lower the Site audit score for that room.',
      },
    ],
  },
  amenities: {
    title: 'Hotel facilities',
    lead: 'These are property-wide extras (parking, restaurant, front desk), not the in-room ticks on each room.',
    blocks: [
      {
        heading: 'Where to edit',
        body: 'Staff desk → Amenities, or Admin → Amenities.',
        steps: [
          'Click Add amenity.',
          'Enter a name, a short description, and a photo.',
          'Optionally pick an icon and a sort number (lower numbers appear first).',
          'Save. Aim for at least three facilities.',
        ],
      },
    ],
  },
  activities: {
    title: 'Things to do',
    lead: 'Activities are optional extras guests can browse. A price is not required.',
    blocks: [
      {
        heading: 'Where to edit',
        body: 'Staff desk → Things to do, or Admin → Things to do.',
        steps: [
          'Click Add activity.',
          'Enter a name, description, and photo.',
          'Leave Price blank if you do not want a price on the website. If you add a number, it shows as “From $…” on Things to do.',
          'Save.',
        ],
      },
    ],
  },
  menu: {
    title: 'Restaurant menu',
    lead: 'Each dish lives under Menu items. The Bar & Restaurant page only holds the menu heading and restaurant copy.',
    blocks: [
      {
        heading: 'Where to edit',
        body: 'Staff desk → Menu items, or Admin → Menu items.',
        steps: [
          'Click Add item.',
          'Enter name, price, category, photo, ingredients, and any allergens or dietary tags.',
          'Save. The Bar & Restaurant page lists dishes in a grid. Guests can send an order on WhatsApp with prices and a total.',
        ],
      },
    ],
  },
  gallery: {
    title: 'Photos',
    lead: 'Media Gallery is the library. The public Gallery page only shows files you mark for it.',
    blocks: [
      {
        heading: 'Upload and reuse',
        body: 'Staff desk → Media Gallery, or Admin → Media Gallery.',
        steps: [
          'Upload photos here once.',
          'On any page, room, or amenity, choose From library or upload a new file.',
          'When picking into a field, click a thumbnail to insert it. You can tick several and insert them together.',
        ],
      },
      {
        heading: 'Show a photo on the public gallery',
        body: 'Open the file and set Gallery category to Rooms, Bar & Restaurant, Property & views, or Amenities. Leave it on None to keep the file in the library only.',
      },
    ],
  },
  bookings: {
    title: 'Bookings',
    lead: 'New reservations appear on the admin home and under Bookings. Availability closes nights when the hotel or a room type is full or closed.',
    blocks: [
      {
        heading: 'How a guest books',
        body: 'From a room card they tap Book now, pick dates on the calendar, then fill guest details. From Contact they choose Book a room, pick the room, then the same calendar.',
      },
      {
        heading: 'Daily use',
        body: 'Staff desk → Reservations, or Admin → Bookings.',
        steps: [
          'Open a booking to see dates, room, guest, and special requests.',
          'Reply on WhatsApp or email — whichever the guest chose.',
          'Paste guest replies on the thread so the conversation stays on that reservation.',
        ],
      },
      {
        heading: 'Close dates',
        body: 'Staff desk → Availability. Close the whole hotel or selected rooms for a date range. The website stops those bookings. Open the dates again when you can take guests.',
      },
      {
        heading: 'Payments',
        body: 'Guests can pay on arrival. Card and Mobile Money only work after those accounts are connected.',
      },
    ],
  },
  reviews: {
    title: 'Guest reviews',
    lead: 'Reviews are not stored in this website. Guests leave them on Google or TripAdvisor. You only keep the links.',
    blocks: [
      {
        heading: 'Where to edit',
        body: 'Site setting → Guest reviews.',
        steps: [
          'Paste the write-a-review links (Google and TripAdvisor).',
          'Paste the links where people can read existing reviews.',
          'Save. The public /reviews page and the footer “Leave a review” link use those URLs. After a booking, guests can be pointed there too.',
        ],
      },
    ],
  },
  audit: {
    title: 'Is the site ready?',
    lead: 'This score is calculated from live content. It is not a manual checklist you tick by hand.',
    blocks: [
      {
        heading: 'How to use it',
        body: 'Work through anything marked as still needed.',
        steps: [
          'Read the score and the list below.',
          'Open the staff or admin link beside an item.',
          'Add the missing photo, text, or price.',
          'Refresh this page. The score updates from the website itself.',
        ],
      },
    ],
  },
  feedback: {
    title: 'Tell us what to improve',
    lead: 'If something is missing, unclear, or should work differently, send a note. Ireme can read it in admin under Handover notes.',
    blocks: [],
  },
}
