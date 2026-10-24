<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { dayMs, resolvePalette } from '@/utils/contributionSkyline'
import { useSkylineModel } from './skyline/useSkylineModel'
import { useSkylineEngine } from './skyline/useSkylineEngine'
import StatBlock from './skyline/StatBlock.vue'
import { GridIcon, CubeIcon } from './skyline/icons'

const props = defineProps({
  /** One entry per day, "YYYY-MM-DD". Repeated dates add up. Omit for a generated sample year. */
  data: { type: Array, default: undefined },
  /** Last day shown. Defaults to the latest date in `data`, or today. */
  endDate: { type: [String, Date], default: undefined },
  /** Controlled view: "2d" | "3d". */
  view: { type: String, default: undefined },
  /** Uncontrolled starting view. The 3D view rises out of the flat one when it first scrolls into sight. */
  defaultView: { type: String, default: '3d' },
  /** A preset name, four colours, or { light, dark } sets of four. */
  palette: { type: [String, Array, Object], default: 'github' },
  /** Multiplies bar heights in 3D. */
  heightScale: { type: Number, default: 1 },
  /** Morph length, ms. */
  duration: { type: Number, default: 1300 },
  /** 0 puts Sunday on the top row, 1 puts Monday there. */
  weekStart: { type: Number, default: 0 },
  /** Drag to orbit in 3D. */
  orbit: { type: Boolean, default: true },
  showStats: { type: Boolean, default: true },
  showLegend: { type: Boolean, default: true },
  showToggle: { type: Boolean, default: true },
  /** All user facing strings. See DEFAULT_LABELS; merge store.t.skyline over it. */
  labels: { type: Object, default: () => ({}) },
  locale: { type: String, default: 'en-US' },
  /** Seed for the generated sample year. */
  seed: { type: Number, default: 7 },
})

const emit = defineEmits(['viewChange', 'cellClick'])

const DEFAULT_LABELS = {
  titleTemplate: '{n} {unit} in the last year',
  unit: 'contribution',
  unitPlural: 'contributions',
  onDate: 'on',
  yearTotal: '1 year total',
  busiestDay: 'Busiest day',
  longestStreak: 'Longest streak',
  currentStreak: 'Current streak',
  day: 'day',
  days: 'days',
  none: 'No {unit}',
  levels: ['Light', 'Moderate', 'Heavy', 'Heaviest'],
  hintFlat: 'Hover a day for details · arrow keys to explore',
  hintOrbit: 'Drag to orbit · double-click to reset',
  modeFlat: 'Flat heat map',
  mode3d: '3D skyline',
  viewLabel: 'Chart view',
  less: 'Less',
  more: 'More',
  highlight: 'Highlight {level} days',
  ariaChart: '{n} {unit} between {range}, shown as a {mode}. Use the arrow keys to read individual days.',
}

const L = computed(() => ({ ...DEFAULT_LABELS, ...props.labels }))

// --- view state ---
// Phones always get the flat GitHub-style strip: the full year fits there as a
// dense grid, while the 3D skyline and its toggle need the room from sm up.
const mobileMq = window.matchMedia('(max-width: 639px)')
const isMobile = ref(mobileMq.matches)
const onMobileChange = () => {
  isMobile.value = mobileMq.matches
}
onMounted(() => mobileMq.addEventListener('change', onMobileChange))
onBeforeUnmount(() => mobileMq.removeEventListener('change', onMobileChange))

const innerView = ref(props.defaultView)
const view = computed(() => (isMobile.value ? '2d' : (props.view ?? innerView.value)))
const is3d = computed(() => view.value === '3d')
function setView(v) {
  if (props.view === undefined) innerView.value = v
  emit('viewChange', v)
}

const width = ref(0)
const active = ref(-1)
const legendLevel = ref(-1)
const announce = ref('')
const initialPal = resolvePalette(props.palette, false)
const theme = ref({ dark: false, swatches: ['#ebedf0', ...initialPal], accent: initialPal[3] })

// --- model + derived display values ---
const { model, stats, nf, dfy, plural, noun, range, describe, statBlocks, titleNum, titleRest } = useSkylineModel(props, L)

// Stats always live in the row below the graph: floating corner blocks drift
// downward with the morphing stage height and collide with tall bars on desktop.
const showRow = computed(() => props.showStats)
const ease = 'cubic-bezier(0.65, 0, 0.35, 1)'
const levelNames = computed(() => [L.value.none.replace('{unit}', plural.value), ...L.value.levels])
const hint = computed(() => (is3d.value && props.orbit ? L.value.hintOrbit : L.value.hintFlat))
const touchAction = computed(() => (is3d.value && props.orbit ? 'pan-y' : 'auto'))

const ariaLabel = computed(() => {
  const s = stats.value
  return L.value.ariaChart
    .replace('{n}', nf.value.format(s.total))
    .replace('{unit}', noun(s.total))
    .replace('{range}', range(s.first, s.last, true))
    .replace('{mode}', is3d.value ? L.value.mode3d : L.value.modeFlat)
})

function legendAria(i) {
  return L.value.highlight.replace('{level}', levelNames.value[i].toLowerCase())
}

// --- canvas engine ---
const rootRef = ref(null)
const stageRef = ref(null)
const canvasRef = ref(null)
const tipRef = ref(null)

const engine = useSkylineEngine({
  props,
  model,
  view,
  legendLevel,
  active,
  theme,
  width,
  announce,
  describe,
  refs: { rootRef, stageRef, canvasRef, tipRef },
  onCellClick: (d) => emit('cellClick', d),
})

// The tooltip's width is needed to keep it inside the card; measure it when its text changes.
watch([active, model], async ([a]) => {
  await nextTick()
  const tip = tipRef.value
  if (tip && a >= 0) engine.value?.tipWidth(tip.offsetWidth)
})
</script>

<template>
  <section
    ref="rootRef"
    class="relative w-full rounded-2xl border border-neutral-200 p-3 font-sans sm:p-5 dark:border-neutral-800"
  >
    <header class="mb-3 hidden flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:flex">
      <h3 class="m-0 text-[15px] font-normal leading-snug text-black dark:text-white">
        <slot name="title">
          <span class="font-semibold tabular-nums">{{ titleNum }}</span>
          {{ titleRest }}
        </slot>
      </h3>
      <div
        v-if="showToggle && !isMobile"
        role="group"
        :aria-label="L.viewLabel"
        class="relative inline-flex rounded-md border border-neutral-200 p-0.5 dark:border-neutral-700"
      >
        <span
          aria-hidden="true"
          class="absolute top-0.5 bottom-0.5 left-0.5 w-9 rounded bg-neutral-900 transition-transform duration-500 motion-reduce:transition-none sm:w-8 dark:bg-neutral-100"
          :style="{ transform: is3d ? 'translateX(100%)' : 'translateX(0)', transitionTimingFunction: ease }"
        />
        <button
          v-for="v in ['2d', '3d']"
          :key="v"
          type="button"
          :aria-pressed="view === v"
          :aria-label="v === '2d' ? L.modeFlat : L.mode3d"
          :title="v === '2d' ? L.modeFlat : L.mode3d"
          class="relative z-10 grid h-8 w-9 cursor-pointer place-items-center rounded border-0 bg-transparent p-0 transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none sm:h-7 sm:w-8"
          :style="{ transitionTimingFunction: ease }"
          @click="setView(v)"
        >
          <span :class="view === v ? 'text-white dark:text-black' : 'text-black dark:text-white'">
            <GridIcon v-if="v === '2d'" />
            <CubeIcon v-else />
          </span>
        </button>
      </div>
    </header>

    <div class="relative">
      <div class="relative px-3 pt-3 sm:px-4 sm:pt-4">
        <div
          ref="stageRef"
          class="relative w-full overflow-hidden rounded-md outline-offset-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-solid"
          style="height: 150px; outline-color: currentColor"
        >
          <canvas
            ref="canvasRef"
            tabindex="0"
            role="img"
            :aria-label="ariaLabel"
            class="absolute top-0 left-0 block outline-none"
            :style="{ maxWidth: 'none', touchAction }"
          />

        </div>

        <div
          ref="tipRef"
          role="tooltip"
          :aria-hidden="active < 0"
          class="pointer-events-none absolute top-3 left-3 z-20 whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1.5 text-[12px] leading-none text-white shadow-lg transition-opacity duration-150 sm:top-4 sm:left-4 motion-reduce:transition-none dark:bg-neutral-100 dark:text-black"
          :style="{ opacity: active >= 0 ? 1 : 0 }"
        >
          <template v-if="active >= 0 && model.cells[active]">
            <strong class="font-semibold">
              {{
                model.cells[active].count
                  ? nf.format(model.cells[active].count) + ' ' + noun(model.cells[active].count)
                  : L.none.replace('{unit}', plural)
              }}
            </strong>
            <span> {{ dfy.format(dayMs(model.cells[active].date)) }}</span>
          </template>
          <template v-else>&nbsp;</template>
          <span
            aria-hidden="true"
            class="absolute top-full h-0 w-0 border-x-[5px] border-t-[5px] border-x-transparent border-t-neutral-900 dark:border-t-neutral-100"
            style="left: var(--arrow, 50%); margin-left: -5px"
          />
        </div>
      </div>

      <div
        v-if="showStats"
        :aria-hidden="!showRow"
        class="grid transition-[grid-template-rows,opacity] motion-reduce:transition-none"
        :style="{
          gridTemplateRows: showRow ? '1fr' : '0fr',
          opacity: showRow ? 1 : 0,
          transitionDuration: duration + 'ms',
          transitionTimingFunction: ease,
        }"
      >
        <div class="min-h-0 overflow-hidden">
          <div class="grid grid-cols-2 gap-x-3 gap-y-3 px-3 pt-4 pb-1 sm:gap-x-4 sm:px-4 md:grid-cols-4">
            <StatBlock v-for="b in statBlocks" :key="b.label" v-bind="b" :size="28" />
          </div>
        </div>
      </div>

      <div
        class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-3 pt-3 pb-3 text-[11px] text-black sm:px-4 sm:text-[12px] dark:text-white"
      >
        <span class="relative grid min-w-0 w-full flex-1 grid-cols-1">
          <span
            :aria-hidden="hint !== L.hintFlat"
            class="[grid-area:1/1] transition-opacity duration-500 motion-reduce:transition-none"
            :style="{ opacity: hint === L.hintFlat ? 1 : 0 }"
          >
            {{ L.hintFlat }}
          </span>
          <span
            :aria-hidden="hint !== L.hintOrbit"
            class="[grid-area:1/1] transition-opacity duration-500 motion-reduce:transition-none"
            :style="{ opacity: hint === L.hintOrbit ? 1 : 0 }"
          >
            {{ L.hintOrbit }}
          </span>
        </span>
        <div v-if="showLegend" class="flex shrink-0 items-center gap-1.5" @mouseleave="legendLevel = -1">
          <span class="mr-0.5">{{ L.less }}</span>
          <button
            v-for="(c, i) in theme.swatches"
            :key="i"
            type="button"
            :aria-label="legendAria(i)"
            :aria-pressed="legendLevel === i"
            :title="levelNames[i]"
            class="h-[11px] w-[11px] cursor-pointer rounded-[2px] border-0 p-0 transition-[background-color,transform] duration-500 hover:scale-125 focus-visible:outline-2 focus-visible:outline-offset-1 motion-reduce:transition-none"
            :style="{ background: c, boxShadow: 'inset 0 0 0 1px rgba(127,127,127,0.12)' }"
            @mouseenter="legendLevel = i"
            @focus="legendLevel = i"
            @blur="legendLevel = -1"
            @click="legendLevel = legendLevel === i ? -1 : i"
          />
          <span class="ml-0.5">{{ L.more }}</span>
        </div>
      </div>
    </div>

    <p aria-live="polite" class="sr-only">{{ announce }}</p>
  </section>
</template>
