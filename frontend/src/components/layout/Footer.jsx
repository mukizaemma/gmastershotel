import { NavLink } from 'react-router-dom'
import { MapPin, Phone, Mail, MessageCircle, Navigation } from 'lucide-react'
import { useSiteLayout } from '@lib/queries/useSiteLayout'
import { usePages } from '@lib/queries/usePages'
import { LOCATION_HIGHLIGHTS, PUBLIC_CTA, PUBLIC_NAV } from '@features/hotel/brand'
import { brandFromCompany } from '@features/hotel/companyBrand'
import { normalizeSocials, visibleSocials } from '@features/hotel/socials'
import { SOCIAL_ICONS } from '@features/hotel/socialIcons'
import styles from './Footer.module.css'

export default function Footer() {
  const { data } = useSiteLayout()
  const { data: pages } = usePages()
  const company = data.company
  const brand = brandFromCompany(company)
  const socials = visibleSocials(normalizeSocials(company.socials))
  const highlights = (pages?.home?.location?.highlights || [])
    .map((item) => (typeof item === 'string' ? item : item?.text))
    .map((text) => String(text || '').trim())
    .filter(Boolean)
  const points = highlights.length ? highlights : LOCATION_HIGHLIGHTS
  const whatsapp = String(company.whatsapp || company.phone || '').replace(/[^\d]/g, '')
  const directionsUrl = String(company.mapUrl || '').trim()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <NavLink to="/" className={styles.logo}>
              {brand.logo ? <img src={brand.logo} alt="" /> : <span className={styles.mark}>{brand.initials}</span>}
              <strong>{brand.name}</strong>
            </NavLink>
            {brand.tagline ? <p className={styles.tagline}>{brand.tagline}</p> : null}
            {company.address ? <p className={styles.address}>{company.address}</p> : null}
            <NavLink to={PUBLIC_CTA.path} className={styles.bookBtn}>
              {PUBLIC_CTA.label}
            </NavLink>
            {socials.length > 0 ? (
              <div className={styles.socials}>
                {socials.map(({ name, label, href }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={label}
                  >
                    {SOCIAL_ICONS[name]}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <nav className={styles.col} aria-label="Footer">
            <h4 className={styles.colTitle}>Menu</h4>
            <ul>
              {PUBLIC_NAV.map((link) => (
                <li key={link.path}>
                  <NavLink to={link.path} end={link.path === '/'}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contact</h4>
            <ul className={styles.iconList}>
              {company.phone ? (
                <li>
                  <Phone size={16} />
                  <a href={`tel:${company.phone.replace(/\s/g, '')}`}>{company.phone}</a>
                </li>
              ) : null}
              {company.email ? (
                <li>
                  <Mail size={16} />
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </li>
              ) : null}
              {whatsapp ? (
                <li>
                  <MessageCircle size={16} />
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {!company.phone && !company.email && !whatsapp && company.address ? (
                <li>
                  <MapPin size={16} />
                  <span>{company.address}</span>
                </li>
              ) : null}
            </ul>
            {directionsUrl ? (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.directionsBtn}
              >
                <Navigation size={15} />
                Get Directions
              </a>
            ) : null}
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Stay with us</h4>
            <ul className={styles.points}>
              {points.map((item) => (
                <li key={item}>
                  <MapPin size={15} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomInner}`}>
          <p>
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
