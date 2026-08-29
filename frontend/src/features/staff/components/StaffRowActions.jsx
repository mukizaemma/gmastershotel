import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Eye, Pencil, Trash2 } from 'lucide-react'

export default function StaffRowActions({ viewHref, onView, onEdit, onDelete, label = 'this item' }) {
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)

  async function confirm() {
    if (!onDelete || busy) return
    setBusy(true)
    try {
      await onDelete()
      setStep(0)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rowActions">
      {viewHref ? (
        <a className="iconBtn iconView" href={viewHref} target="_blank" rel="noreferrer" aria-label="View" title="View">
          <Eye size={15} />
        </a>
      ) : onView ? (
        <button type="button" className="iconBtn iconView" onClick={onView} aria-label="View" title="View">
          <Eye size={15} />
        </button>
      ) : null}
      {onEdit ? (
        <button type="button" className="iconBtn iconEdit" onClick={onEdit} aria-label="Edit" title="Edit">
          <Pencil size={15} />
        </button>
      ) : null}
      {onDelete ? (
        <button type="button" className="iconBtn iconDelete" onClick={() => setStep(1)} aria-label="Delete" title="Delete">
          <Trash2 size={15} />
        </button>
      ) : null}
      {step > 0 && typeof document !== 'undefined'
        ? createPortal(
            <div className="confirmDelete" role="dialog" aria-modal="true">
              <div className="confirmDeleteCard">
                <p>
                  {step === 1
                    ? `Delete ${label}?`
                    : `Permanently delete ${label}? This cannot be undone.`}
                </p>
                <div className="confirmDeleteActions">
                  <button type="button" className="staffBtn staffBtnGhost" disabled={busy} onClick={() => setStep(0)}>
                    Cancel
                  </button>
                  <button type="button" className="staffBtn staffBtnDanger" disabled={busy} onClick={() => (step === 1 ? setStep(2) : confirm())}>
                    {busy ? 'Deleting…' : step === 1 ? 'Continue' : 'Delete permanently'}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
