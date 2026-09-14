import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MONTH_NAMES, isCurrentOrFuture } from '../dateRange'
import type { BudgetPeriod } from '../types'

interface PeriodSelectorProps {
  period: BudgetPeriod
  onChange: (period: BudgetPeriod) => void
}

export function PeriodSelector({ period, onChange }: PeriodSelectorProps) {
  const isAnnual = period.month === null

  function goPrev() {
    if (isAnnual) {
      onChange({ year: period.year - 1, month: null })
    } else if (period.month === 0) {
      onChange({ year: period.year - 1, month: 11 })
    } else {
      onChange({ year: period.year, month: (period.month as number) - 1 })
    }
  }

  function goNext() {
    if (isAnnual) {
      onChange({ year: period.year + 1, month: null })
    } else if (period.month === 11) {
      onChange({ year: period.year + 1, month: 0 })
    } else {
      onChange({ year: period.year, month: (period.month as number) + 1 })
    }
  }

  function toggleMode() {
    onChange({ year: period.year, month: isAnnual ? new Date().getMonth() : null })
  }

  const label = isAnnual ? `${period.year}` : `${MONTH_NAMES[period.month as number]} ${period.year}`
  const nextDisabled = isCurrentOrFuture(period)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        <button
          onClick={goPrev}
          aria-label="Periodo anterior"
          className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="min-w-[9rem] text-center font-medium text-charcoal">{label}</span>
        <button
          onClick={goNext}
          disabled={nextDisabled}
          aria-label="Periodo siguiente"
          className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <button
        onClick={toggleMode}
        className="rounded-button border border-bone bg-ivory px-3 py-1.5 text-sm font-medium text-charcoal hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
      >
        {isAnnual ? 'Ver por mes' : 'Ver por año'}
      </button>
    </div>
  )
}