const STORAGE_KEY = 'gv-booking-stay'

export function persistStayDates({ checkIn, checkOut, adults = 2, step = 2 }) {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...parsed,
        step,
        stay: {
          checkIn: '',
          checkOut: '',
          adults: 2,
          children: 0,
          ...(parsed.stay || {}),
          checkIn,
          checkOut,
          adults: Number(adults) || 2,
        },
      }),
    )
  } catch {
    /* Booking page still works if storage is blocked. */
  }
}
