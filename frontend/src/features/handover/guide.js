export const HANDOVER_TABS = [
  { id: 'overview', label: 'What was delivered' },
  { id: 'access', label: 'Demo & sign in' },
  { id: 'manage', label: 'Manage content' },
  { id: 'settings', label: 'Hotel details' },
  { id: 'pages', label: 'Website pages' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'amenities', label: 'Hotel facilities' },
  { id: 'activities', label: 'Things to do' },
  { id: 'menu', label: 'Restaurant menu' },
  { id: 'gallery', label: 'Photos' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'reviews', label: 'Guest reviews' },
  { id: 'audit', label: 'Site audit' },
  { id: 'feedback', label: 'Send a note' },
]

/** Staff desk login only — never expose a separate super-admin door here. */
export const HANDOVER_CREDENTIALS = {
  email: 'admin@gmastershotel.com',
  password: 'Gmasters@202!',
}

export const HANDOVER_SECTIONS = {
  overview: {
    title: 'What was delivered',
    lead: 'A **public website** for guests and a **Staff desk** for your team to manage content. This page is a short handover — not every setting, just what matters.',
    blocks: [
      {
        heading: 'Main features',
        body: 'These are the core pieces live on the demo:',
        features: [
          { title: 'Public website', text: 'Home, accommodation, room pages, restaurant, things to do, gallery, about, contact, booking, reviews, and policy.' },
          { title: 'Online booking', text: 'Guests pick a room, choose dates on the stay calendar, and send a reservation request.' },
          { title: 'Staff desk', text: 'Your team updates hotel details, pages, rooms, photos, menu, activities, and bookings from one place.' },
          { title: 'Availability control', text: 'Close nights for the hotel or selected rooms when you cannot take bookings.' },
          { title: 'Contact & enquiries', text: 'General messages and room booking requests from the contact form.' },
          { title: 'Site audit', text: 'A live readiness score that shows what content is still missing before launch.' },
        ],
      },
      {
        heading: 'About this demo',
        body: 'The **demo URL** is for development and client review only. Content and data you add while testing will be **migrated to the real domain** once this demo is approved.',
        callout: 'demo',
      },
    ],
  },
  access: {
    title: 'Demo & sign in',
    lead: 'Use the links below to open the **demo website** and the **Staff desk**. Sign in only at the Staff desk — that is where you manage content.',
    blocks: [
      {
        heading: 'How to sign in',
        body: 'Open the **Staff desk** login URL, enter the email and password shown above, then use the left menu.',
        steps: [
          'Open **Staff desk** from the box above (or the Login URL).',
          'Sign in with the **login email** and **password**.',
          'Choose a section on the left (Pages, Rooms, Photos, and so on).',
          'Edit, then **Save**. The public demo updates from that content.',
        ],
      },
      {
        heading: 'If you forget the password',
        body: 'On the Staff desk login screen use **Forgot password**. A reset link is emailed to the login address above. After approval and go-live, change the password in **My account** so it is private to your team.',
      },
    ],
  },
  manage: {
    title: 'Manage content',
    lead: 'Everything guests see is edited in the **Staff desk**. Use the list below as a map — open a topic for short steps.',
    blocks: [
      {
        heading: 'Where to work',
        body: 'Always sign in at the **Staff desk**. Pick an item on the left, edit in the form or modal, then save.',
        features: [
          { title: 'Hotel details', text: 'Name, logo, phones, email, address, directions link, social, and review links.' },
          { title: 'Website pages', text: 'Headlines, intros, and header images for Home, About, Accommodation, and the rest.' },
          { title: 'Rooms', text: 'Room types, prices, photos, descriptions, and in-room amenities.' },
          { title: 'Menu & activities', text: 'Restaurant dishes and “Things to do” listings.' },
          { title: 'Photos', text: 'Upload once in Media Gallery, reuse on pages and rooms, mark files for the public gallery.' },
          { title: 'Bookings', text: 'View reservations, reply to guests, and close dates under Availability.' },
        ],
      },
    ],
  },
  settings: {
    title: 'Hotel details',
    lead: 'Your **hotel name**, **logo**, contact info, and review links live in **Site setting**.',
    blocks: [
      {
        heading: 'Where to edit',
        body: 'Staff desk → **Site setting**.',
        steps: [
          'Open **Site setting**.',
          'Update hotel name, logo, phone, WhatsApp, email, and address.',
          'Add the **Directions URL** (Google Maps) so guests can open directions from the footer.',
          'Add social links for the footer.',
          'Under **Guest reviews**, paste Google and TripAdvisor write / read links.',
          '**Save**.',
        ],
      },
    ],
  },
  pages: {
    title: 'Website pages',
    lead: 'Public page copy is edited under **Pages** — one tab per page.',
    blocks: [
      {
        heading: 'Where to edit',
        body: 'Staff desk → **Pages**.',
        steps: [
          'Open **Pages**.',
          'Set a **Default header** image for pages without their own photo.',
          'Open the tab for the page you want (Home, About, Accommodation, and so on).',
          'Edit the **headline**, **intro**, and any extra sections.',
          '**Save**.',
        ],
      },
    ],
  },
  rooms: {
    title: 'Rooms',
    lead: 'Each room type needs a **name**, **nightly rate**, **photos**, and a **description**.',
    blocks: [
      {
        heading: 'Add or edit a room',
        body: 'Staff desk → **Accommodation**.',
        steps: [
          'Click **Add room** or **Edit**.',
          'Enter name, price per night, and how many physical rooms of this type.',
          'Write the description in the text editor.',
          'Add **Room photos** (several at once). The first photo is the cover.',
          'Tick in-room amenities that apply.',
          '**Save**.',
        ],
      },
    ],
  },
  amenities: {
    title: 'Hotel facilities',
    lead: 'Property-wide extras (parking, restaurant, front desk) — not the ticks on each room.',
    blocks: [
      {
        heading: 'Where to edit',
        body: 'Staff desk → **Amenities**.',
        steps: [
          'Click **Add amenity**.',
          'Enter a name, short description, and photo.',
          '**Save**. Aim for at least three facilities.',
        ],
      },
    ],
  },
  activities: {
    title: 'Things to do',
    lead: 'Optional activities guests can browse. A **price** is optional.',
    blocks: [
      {
        heading: 'Where to edit',
        body: 'Staff desk → **Things to do**.',
        steps: [
          'Click **Add activity**.',
          'Enter name, description, and photo.',
          'Leave **Price** blank if you do not want a price shown.',
          '**Save**.',
        ],
      },
    ],
  },
  menu: {
    title: 'Restaurant menu',
    lead: 'Dishes are edited under **Menu items**. The Bar & Restaurant page holds the section heading and copy.',
    blocks: [
      {
        heading: 'Where to edit',
        body: 'Staff desk → **Menu items**.',
        steps: [
          'Click **Add item**.',
          'Enter name, price, category, and photo.',
          '**Save**. Guests see the menu on Bar & Restaurant.',
        ],
      },
    ],
  },
  gallery: {
    title: 'Photos',
    lead: '**Media Gallery** is your library. The public Gallery only shows photos you mark for it.',
    blocks: [
      {
        heading: 'Upload and show',
        body: 'Staff desk → **Media Gallery**.',
        steps: [
          'Upload photos once.',
          'Reuse them on pages, rooms, and amenities via **From library**.',
          'To show a photo on the public gallery, set its **Gallery category** (Rooms, Bar & Restaurant, and so on).',
        ],
      },
    ],
  },
  bookings: {
    title: 'Bookings',
    lead: 'New reservations appear under **Reservations**. Close sold-out nights under **Availability**.',
    blocks: [
      {
        heading: 'Daily use',
        body: 'Staff desk → **Reservations** and **Availability**.',
        steps: [
          'Open a booking to see dates, room, guest, and requests.',
          'Reply by WhatsApp or email.',
          'Use **Availability** to close the hotel or selected rooms for date ranges.',
        ],
      },
    ],
  },
  reviews: {
    title: 'Guest reviews',
    lead: 'Reviews stay on **Google** and **TripAdvisor**. You only keep the links in Site setting.',
    blocks: [
      {
        heading: 'Where to edit',
        body: 'Staff desk → **Site setting** → Guest reviews.',
        steps: [
          'Paste write-a-review and read-reviews links.',
          '**Save**. The public Reviews page and footer use those URLs.',
        ],
      },
    ],
  },
  audit: {
    title: 'Site audit',
    lead: 'This **readiness score** is calculated from live content on the demo. Use it to see what still needs attention before approval.',
    blocks: [
      {
        heading: 'How to use it',
        body: 'Work through anything marked as still needed, then refresh this page.',
        steps: [
          'Read the **score** and the list below.',
          'Open the Staff desk link beside an item.',
          'Add the missing photo, text, or detail.',
          'Refresh — the score updates from the website itself.',
        ],
      },
    ],
  },
  feedback: {
    title: 'Send a note',
    lead: 'If something is missing or should work differently before go-live, send a short note below.',
    blocks: [],
  },
}
