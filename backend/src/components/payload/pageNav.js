export const ADMIN_PAGES = [{ href: '/admin/globals/pages', slug: 'pages', label: 'Pages' }]

export function isAdminPagePath(pathname = '') {
  return pathname === '/admin/globals/pages' || pathname.startsWith('/admin/globals/pages/')
}
