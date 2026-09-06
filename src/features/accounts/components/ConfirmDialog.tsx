interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Eliminar',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-modal bg-warm-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-charcoal">
          {title}
        </h2>
        <p className="mt-2 text-sm text-taupe">{message}</p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-button border border-bone bg-ivory px-4 py-2 text-sm font-medium text-charcoal hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-button bg-error px-4 py-2 text-sm font-medium text-warm-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}