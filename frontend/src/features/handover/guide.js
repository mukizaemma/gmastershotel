export const HANDOVER_TABS = [
  { id: 'overview', label: 'What was delivered' },
  { id: 'access', label: 'Register & sign in' },
  { id: 'manage', label: 'Manage content' },
  { id: 'settings', label: 'Hotel details' },
  { id: 'pages', label: 'Website pages' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'amenities', label: 'Hotel facilities' },
  { id: 'activities', label: 'Things to do' },
  { id: 'menu', label: 'Dining & menu' },
  { id: 'gallery', label: 'Photos' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'availability', label: 'Availability' },
  { id: 'reviews', label: 'Guest reviews' },
  { id: 'hosting', label: 'Hosting' },
  { id: 'audit', label: 'Site audit' },
  { id: 'feedback', label: 'Send a note' },
]

/** Public hosting facts. Support amount matches the staff desk (500,000 RWF). No bank details here. */
export const HANDOVER_HOSTING = {
  registrar: 'namecheap.com',
  registrarUrl: 'https://www.namecheap.com',
  server: 'DigitalOcean Linux server',
  serverUrl: 'https://www.digitalocean.com',
  hostingUsd: 80,
  supportRwf: '500,000',
  renewal: '1 August each year',
  support:
    'Support covers updating the website content you send, keeping the site up and running, and following up on hosting renewals.',
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
          { title: 'Public website', text: 'Home, accommodation, room pages, dining, things to do, gallery, about, contact, booking, reviews, and policy.' },
          { title: 'Online booking', text: 'Guests pick a room, choose dates on the stay calendar, and send a reservation request.' },
          { title: 'Staff desk', text: 'Your team updates hotel details, pages, rooms, photos, dining, activities, and bookings from one place.' },
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
    title: 'Register & sign in',
    lead: 'Create your own account with **Register**. Ireme Tech then assigns **admin access**. Passwords are never listed on this public page.',
    blocks: [
      {
        heading: 'How access works',
        body: 'Registration creates the account only. You cannot open the **Staff desk** until Ireme Tech sets that user as an administrator.',
        steps: [
          'Choose **Register** and enter your name, email, and a private password.',
          'Contact **Ireme Tech** at info@iremetech.com and ask them to assign admin access to that email.',
          'After they confirm, open **Staff desk** and sign in with the email and password you chose.',
          'Use **Forgot password** on the login screen if you need a reset link sent to that email.',
        ],
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
          { title: 'Bookings', text: 'View reservations, update them, and close dates under Availability.' },
          { title: 'Hosting', text: 'Domain, server, annual hosting, and support invoices.' },
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
        crud: [
          { action: 'Create', text: 'The hotel record already exists. Fill any empty field — name, logo, phone, email, address, social link, or review link.' },
          { action: 'View', text: 'Open **Site setting** to read the details currently shown on the website.' },
          { action: 'Update', text: 'Change a field and press **Save**. The header, footer, and contact page pick up the new details.' },
          { action: 'Delete', text: 'Clear a field you no longer want shown, then **Save**. The property record itself stays in place.' },
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
        crud: [
          { action: 'Create', text: 'Inside a page tab, use **Add slide**, **Add feature**, **Add stay point**, or **Add highlight** where that page has a list.' },
          { action: 'View', text: 'Open **Pages**, then the tab for Home, About, Accommodation, Dining, or another page, and read the live copy.' },
          { action: 'Update', text: 'Edit the **headline**, **intro**, or a block, then **Save changes**.' },
          { action: 'Delete', text: 'Remove an extra slide, feature, or highlight with its remove control, then save. The page tab itself stays.' },
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
        crud: [
          { action: 'Create', text: 'Click **Add room**, fill the name, nightly rate, description, photos, and amenities, then **Save**.' },
          { action: 'View', text: 'The rooms list shows every room type. **Edit** opens the full record.' },
          { action: 'Update', text: 'Click **Edit**, change the fields, then **Save changes**. The public room page updates from that record.' },
          { action: 'Delete', text: 'Use the trash icon on the row and confirm. That room type leaves the website.' },
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
        crud: [
          { action: 'Create', text: 'Click **Add amenity**, enter the name, short description, and photo, then **Save**.' },
          { action: 'View', text: 'The amenities list is every facility currently offered to guests.' },
          { action: 'Update', text: 'Click **Edit**, change the text or photo, then **Save changes**.' },
          { action: 'Delete', text: 'Use the trash icon and confirm. The facility is removed from the website.' },
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
        crud: [
          { action: 'Create', text: 'Click **Add activity**, enter the name, description, photo, and an optional price, then **Save**.' },
          { action: 'View', text: 'The list is what guests see under Things to do.' },
          { action: 'Update', text: 'Click **Edit**, change the fields, then **Save changes**.' },
          { action: 'Delete', text: 'Use the trash icon and confirm to remove that activity.' },
        ],
      },
    ],
  },
  menu: {
    title: 'Dining & menu',
    lead: 'The **Dining page** holds the page copy and dish photos. **Menu items** are the dishes guests can browse.',
    blocks: [
      {
        heading: 'Dining page',
        body: 'Staff desk → **Dining page**.',
        steps: [
          'Open **Dining page**.',
          'Edit the headline, intro, and breakfast or dish photos.',
          '**Save**.',
        ],
        crud: [
          { action: 'Create', text: 'Add a photo or text block on the dining page, then **Save**.' },
          { action: 'View', text: 'Open **Dining page** to read the copy guests see.' },
          { action: 'Update', text: 'Change the text or replace a photo, then **Save**.' },
          { action: 'Delete', text: 'Remove a photo or extra block, then **Save**. The dining page itself stays.' },
        ],
      },
      {
        heading: 'Menu items',
        body: 'Staff desk → **Menu items**.',
        crud: [
          { action: 'Create', text: 'Click **Add menu item**, enter the name, description, price, and photo, then **Save**.' },
          { action: 'View', text: 'The menu list is every dish currently stored.' },
          { action: 'Update', text: 'Click **Edit**, change the dish, then **Save changes**.' },
          { action: 'Delete', text: 'Use the trash icon and confirm to remove that dish.' },
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
          'To show a photo on the public gallery, set its **Gallery category** (Rooms, Breakfast & dining, and so on).',
        ],
        crud: [
          { action: 'Create', text: 'In **Media Gallery**, choose files and **Upload**. On **Site Gallery**, use **Add images** or pick from the library.' },
          { action: 'View', text: '**Media Gallery** is the full library. **Site Gallery** is only what the public Gallery page shows.' },
          { action: 'Update', text: 'Change a caption or gallery category, or reorder photos on **Site Gallery**.' },
          { action: 'Delete', text: 'On **Site Gallery**, **Remove** hides a photo from the public gallery. The file stays in **Media Gallery**.' },
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
        crud: [
          { action: 'Create', text: 'Guests create a booking from the website. It appears under **Reservations**.' },
          { action: 'View', text: 'Open a row to read dates, room, guest, and special requests.' },
          { action: 'Update', text: 'Edit the reservation details or status, then save. Reply to the guest by WhatsApp or email.' },
          { action: 'Delete', text: 'Use the trash icon and confirm to remove a reservation you do not want to keep.' },
        ],
      },
    ],
  },
  availability: {
    title: 'Availability',
    lead: 'Close nights when the hotel or a room cannot take bookings. Open them again when you are ready.',
    blocks: [
      {
        heading: 'Where to edit',
        body: 'Staff desk → **Availability**.',
        crud: [
          { action: 'Create', text: 'Click **Close dates**, choose the whole property or selected rooms, set the dates, and save.' },
          { action: 'View', text: 'The table lists every closed range and whether it is still closed.' },
          { action: 'Update', text: 'Click **Open again** on a closed range when those nights can be booked.' },
          { action: 'Delete', text: 'Use the trash icon to remove a closed-date record.' },
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
        crud: [
          { action: 'Create', text: 'Paste a Google or TripAdvisor link into an empty review field.' },
          { action: 'View', text: 'Open **Site setting** → Guest reviews to see the links in use.' },
          { action: 'Update', text: 'Replace a link and **Save**.' },
          { action: 'Delete', text: 'Clear a link and **Save** to hide that button on the website.' },
        ],
      },
    ],
  },
  hosting: {
    title: 'Hosting',
    lead: 'Annual hosting is **$80**. Annual support is **500,000 RWF**, the amount set in the staff desk. The domain is registered at **namecheap.com** and the site runs on a **DigitalOcean Linux server**.',
    blocks: [
      {
        heading: 'What you are paying for',
        body: 'Hosting renews on **1 August** each year. Support covers updating the website content you send, keeping the site up and running, and following up on hosting renewals.',
        features: [
          { title: 'Domain registration', text: 'namecheap.com' },
          { title: 'Hosting server', text: 'DigitalOcean Linux server' },
          { title: 'Annual hosting', text: '$80' },
          { title: 'Annual support', text: '500,000 RWF, as set in the staff desk' },
        ],
      },
      {
        heading: 'Where to see invoices',
        body: 'After Ireme Tech assigns admin access, open Staff desk → **Hosting**.',
        crud: [
          { action: 'Create', text: 'The next annual invoice is created for you when the current one is paid. You do not add invoices by hand.' },
          { action: 'View', text: 'Open **Hosting** to read the domain, server, fees, status, and each year’s invoice.' },
          { action: 'Update', text: 'Enter the current dollar rate and **Save rate**. The next invoice total becomes $80 times that rate, plus 500,000 RWF support. Print or download any invoice.' },
          { action: 'Delete', text: 'Invoices are kept as the annual record. They are not deleted from this page.' },
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
