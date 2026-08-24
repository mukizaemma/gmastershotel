import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { staffClient, mediaId } from '../api/staffClient'
import MediaField from '../components/MediaField'
import { SOCIAL_PLATFORMS, emptySocials, normalizeSocials } from '@features/hotel/socials'
import '../staff.css'

const empty = {
  name: '',
  tagline: '',
  logo: '',
  phone: '',
  whatsapp: '',
  email: '',
  phoneSecondary: '',
  address: '',
  distanceFromKigali: '',
  mapUrl: '',
  mapEmbed: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  socials: emptySocials(),
  reviews: {
    googleWriteUrl: '',
    googleReadUrl: '',
    tripadvisorWriteUrl: '',
    tripadvisorReadUrl: '',
  },
}

export default function StaffSettings() {
  const [form, setForm] = useState(empty)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    staffClient
      .get('/api/globals/company?depth=1')
      .then((res) =>
        setForm({
          ...empty,
          ...res.data,
          socials: normalizeSocials(res.data.socials),
        }),
      )
      .catch(() => toast.error('Could not load site settings.'))
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
    if (!loaded || window.location.hash !== '#seo') return
    document.getElementById('seo')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [loaded])

  async function save(event) {
    event.preventDefault()
    try {
      await staffClient.post('/api/globals/company', {
        ...form,
        logo: mediaId(form.logo) || undefined,
        socials: normalizeSocials(form.socials),
      })
      toast.success('Site settings saved.')
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.message || 'Could not save settings.')
    }
  }

  if (!loaded) return <p>Loading…</p>

  return (
    <div className="staffPage">
      <h1>Site settings</h1>
      <form onSubmit={save} className="staffCard" style={{ padding: '1.1rem' }}>
        <div className="formGrid">
          <label className="staffField col-3">
            Property name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label className="staffField col-6">
            Tagline
            <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </label>
          <label className="staffField col-3">
            Location note
            <input value={form.distanceFromKigali} onChange={(e) => setForm({ ...form, distanceFromKigali: e.target.value })} />
          </label>
          <label className="staffField col-3">
            Phone
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label className="staffField col-3">
            WhatsApp
            <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          </label>
          <label className="staffField col-3">
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="staffField col-3">
            Second phone
            <input value={form.phoneSecondary} onChange={(e) => setForm({ ...form, phoneSecondary: e.target.value })} />
          </label>
          <label className="staffField col-6">
            Address
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </label>
          <label className="staffField col-6">
            Map URL
            <input
              value={form.mapUrl}
              onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
              placeholder="Used by Get directions on Home"
            />
          </label>
          <label className="staffField col-6">
            Map embed — shown on the Home location section
            <textarea
              value={form.mapEmbed}
              onChange={(e) => setForm({ ...form, mapEmbed: e.target.value })}
              placeholder="Google Maps → Share → Embed a map → paste the iframe"
            />
          </label>
          <label id="seo" className="staffField col-3">
            SEO title
            <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
          </label>
          <label className="staffField col-3">
            SEO keywords
            <input value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} />
          </label>
          <label className="staffField col-6">
            SEO description
            <textarea value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
          </label>
          <div className="mediaSlot">
            <MediaField label="Logo" value={form.logo} onChange={(logo) => setForm({ ...form, logo })} />
          </div>
          <div className="full">
            <strong>Guest reviews</strong>
            <p className="staffLead" style={{ margin: '0.35rem 0 0.6rem' }}>
              Reviews stay on Google and TripAdvisor. Share <code>/reviews</code> with guests.
            </p>
            <div className="formGrid">
              <label className="staffField col-6">
                Google — write a review
                <input
                  placeholder="https://"
                  value={form.reviews?.googleWriteUrl || ''}
                  onChange={(e) =>
                    setForm({ ...form, reviews: { ...form.reviews, googleWriteUrl: e.target.value } })
                  }
                />
              </label>
              <label className="staffField col-6">
                Google — see reviews
                <input
                  placeholder="https://"
                  value={form.reviews?.googleReadUrl || ''}
                  onChange={(e) =>
                    setForm({ ...form, reviews: { ...form.reviews, googleReadUrl: e.target.value } })
                  }
                />
              </label>
              <label className="staffField col-6">
                TripAdvisor — write a review
                <input
                  placeholder="https://"
                  value={form.reviews?.tripadvisorWriteUrl || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      reviews: { ...form.reviews, tripadvisorWriteUrl: e.target.value },
                    })
                  }
                />
              </label>
              <label className="staffField col-6">
                TripAdvisor — see reviews
                <input
                  placeholder="https://"
                  value={form.reviews?.tripadvisorReadUrl || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      reviews: { ...form.reviews, tripadvisorReadUrl: e.target.value },
                    })
                  }
                />
              </label>
            </div>
          </div>
          <div className="full">
            <strong>Social profiles</strong>
            <p className="staffLead" style={{ margin: '0.35rem 0 0.6rem' }}>
              Paste a URL for each network. Blank or invalid links stay off the public site.
            </p>
            <div className="formGrid">
              {SOCIAL_PLATFORMS.map(({ name, label }) => (
                <label key={name} className="staffField col-3">
                  {label}
                  <input
                    placeholder="https://"
                    value={form.socials?.[name] || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socials: { ...emptySocials(), ...form.socials, [name]: e.target.value },
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="formActions">
          <button type="submit" className="staffBtn">
            Save settings
          </button>
        </div>
      </form>
    </div>
  )
}
