import { computed } from 'vue'
import {
  dayMs,
  generateContributions,
  buildGrid,
  computeStats,
  monthLabels,
} from '@/utils/contributionSkyline'

/**
 * Builds the data model and every derived display value for the skyline:
 * the cell grid, stats, formatters and the four stat blocks.
 *
 * @param {object} props component props (reactive)
 * @param {import('vue').ComputedRef<object>} L merged label dictionary
 */
export function useSkylineModel(props, L) {
  const model = computed(() => {
    const dates = (props.data ?? []).map((d) => dayMs(d.date)).filter(Number.isFinite)
    const end = props.endDate != null ? dayMs(props.endDate) : dates.length ? Math.max(...dates) : dayMs(new Date())
    const days = props.data ?? generateContributions(end, props.seed)
    const grid = buildGrid(days, end, props.weekStart)
    return { ...grid, stats: computeStats(grid.cells), months: monthLabels(grid.cells, grid.weeks, props.locale) }
  })

  const nf = computed(() => new Intl.NumberFormat(props.locale))
  const df = computed(() => new Intl.DateTimeFormat(props.locale, { month: 'short', day: 'numeric', timeZone: 'UTC' }))
  const dfy = computed(() =>
    new Intl.DateTimeFormat(props.locale, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
  )
  const dfl = computed(() =>
    new Intl.DateTimeFormat(props.locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }),
  )

  const plural = computed(() => props.labels.unitPlural ?? L.value.unitPlural)
  const unit = computed(() => props.labels.unit ?? L.value.unit)
  const noun = (n) => (n === 1 ? unit.value : plural.value)

  const stats = computed(() => model.value.stats)

  function range(a, b, withYear = false) {
    if (!a || !b) return '-'
    const f = withYear ? dfy.value : df.value
    return f.format(dayMs(a)) + ' - ' + f.format(dayMs(b))
  }

  function describe(i) {
    const c = model.value.cells[i]
    if (!c) return ''
    const count = c.count ? nf.value.format(c.count) + ' ' + noun(c.count) : L.value.none.replace('{unit}', plural.value)
    return count + ' ' + L.value.onDate + ' ' + dfl.value.format(dayMs(c.date))
  }

  const statBlocks = computed(() => {
    const s = stats.value
    const dayUnit = (n) => (n === 1 ? L.value.day : L.value.days)
    return [
      {
        label: L.value.yearTotal,
        value: nf.value.format(s.total),
        unit: noun(s.total),
        sub: range(s.first, s.last, true),
      },
      {
        label: L.value.busiestDay,
        value: nf.value.format(s.busiest.count),
        unit: noun(s.busiest.count),
        sub: s.busiest.date ? df.value.format(dayMs(s.busiest.date)) : '-',
      },
      {
        label: L.value.longestStreak,
        value: nf.value.format(s.longest.days),
        unit: dayUnit(s.longest.days),
        sub: range(s.longest.start, s.longest.end),
      },
      {
        label: L.value.currentStreak,
        value: nf.value.format(s.current.days),
        unit: dayUnit(s.current.days),
        sub: range(s.current.start, s.current.end),
      },
    ]
  })

  const titleNum = computed(() => nf.value.format(stats.value.total))
  const titleRest = computed(() => (L.value.titleTemplate.split('{n}')[1] ?? '').replace('{unit}', noun(stats.value.total)))

  return {
    model,
    stats,
    nf,
    df,
    dfy,
    dfl,
    plural,
    unit,
    noun,
    range,
    describe,
    statBlocks,
    titleNum,
    titleRest,
  }
}
