import { forwardRef, type InputHTMLAttributes } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, ...inputProps }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-slate">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className="rounded-input border border-bone bg-warm-white px-4 py-3 text-charcoal
                     placeholder:text-stone
                     focus:outline-none focus:ring-2 focus:ring-slate/40
                     disabled:cursor-not-allowed disabled:opacity-60"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...inputProps}
        />
        {error && (
          <p id={`${id}-error`} className="text-sm text-error">
            {error}
          </p>
        )}
      </div>
    )
  },
)

FormField.displayName = 'FormField'