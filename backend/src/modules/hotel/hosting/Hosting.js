import { dataForSave, kigaliToday, reconcile } from './logic.js'

const isLoggedIn = ({ req }) => Boolean(req.user)
const canWrite = ({ req }) => Boolean(req.user) && req.user.role !== 'editor'

export const Hosting = {
  slug: 'hosting',
  label: 'Hosting',
  access: {
    read: isLoggedIn,
    update: canWrite,
  },
  admin: {
    group: false,
    description:
      'Domain, server, and annual hosting invoices. Set the dollar rate here or in the staff desk. Only a super admin can confirm an invoice as paid.',
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc, context }) => {
        const sourceInvoices = originalDoc?.invoices?.length ? originalDoc.invoices : data?.invoices
        const stored = reconcile(
          {
            usdRate: data?.usdRate === undefined ? originalDoc?.usdRate : data?.usdRate,
            invoices: sourceInvoices,
          },
          {
            today: kigaliToday(),
            markPaid: context?.markPaid || null,
            reminder: context?.reminder || null,
          },
        )
        return dataForSave(stored)
      },
    ],
  },
  fields: [
    {
      name: 'serviceStatus',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
      ],
      admin: {
        readOnly: true,
        description: 'Active until 1 August. Expired after that date while the renewal invoice is still unpaid.',
      },
    },
    {
      name: 'usdRate',
      type: 'number',
      min: 0,
      admin: {
        description: 'Rwandan francs for 1 US dollar. The next invoice uses $80 times this rate, plus 500,000 RWF support.',
      },
    },
    {
      name: 'invoices',
      type: 'array',
      labels: { singular: 'Invoice', plural: 'Invoices' },
      admin: {
        readOnly: true,
        description: 'Annual invoices. Payment is confirmed by a super admin from the staff desk Hosting page.',
      },
      fields: [
        { name: 'invoiceNumber', type: 'text', admin: { readOnly: true, width: '25%' } },
        { name: 'billingTo', type: 'text', admin: { readOnly: true, width: '25%' } },
        { name: 'periodStart', type: 'text', admin: { readOnly: true, width: '25%' } },
        { name: 'periodEnd', type: 'text', admin: { readOnly: true, width: '25%' } },
        { name: 'flat', type: 'checkbox', admin: { readOnly: true, width: '25%' } },
        { name: 'hostingFeeUsd', type: 'number', admin: { readOnly: true, width: '25%' } },
        { name: 'hostingFeeRwf', type: 'number', admin: { readOnly: true, width: '25%' } },
        { name: 'supportFeeRwf', type: 'number', admin: { readOnly: true, width: '25%' } },
        { name: 'totalRwf', type: 'number', admin: { readOnly: true, width: '25%' } },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Paid', value: 'paid' },
            { label: 'Active', value: 'active' },
            { label: 'Pending', value: 'pending' },
          ],
          admin: { readOnly: true, width: '25%' },
        },
        { name: 'issuedOn', type: 'text', admin: { readOnly: true, width: '25%' } },
        { name: 'paidAt', type: 'text', admin: { readOnly: true, width: '25%' } },
        { name: 'rateSnapshot', type: 'number', admin: { readOnly: true, width: '25%', description: 'Dollar rate locked when the invoice was marked paid.' } },
        { name: 'reminder30', type: 'checkbox', label: '30-day reminder sent', admin: { readOnly: true, width: '25%' } },
        { name: 'reminder15', type: 'checkbox', label: '15-day reminder sent', admin: { readOnly: true, width: '25%' } },
        { name: 'reminder0', type: 'checkbox', label: 'Expiry-day reminder sent', admin: { readOnly: true, width: '25%' } },
      ],
    },
  ],
}
