import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import SiteAuditBoard from '@features/handover/SiteAuditBoard'
import { staffClient } from '../api/staffClient'
import '../staff.css'

export default function StaffAudit() {
  const [report, setReport] = useState(null)

  useEffect(() => {
    staffClient
      .get('/api/site-audit/report')
      .then((res) => setReport(res.data))
      .catch(() => toast.error('Could not load the site audit.'))
  }, [])

  return (
    <div className="staffPage">
      <h1>Site audit</h1>
      <p className="staffLead">
        Live score of what guests see: company details, rooms, facilities, gallery, and page copy.
        Use <strong>Start here</strong> below, then open each gap. The full handbook is on{' '}
        <Link to="/handover">/handover</Link>.
      </p>
      <SiteAuditBoard report={report} />
    </div>
  )
}
