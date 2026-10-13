<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminFetch } from '@/utils/api'
import { resourceByKey } from '@/data/adminResources'

const props = defineProps({
  resourceKey: { type: String, required: true },
})

const resource = computed(() => resourceByKey(props.resourceKey))
const rows = ref([])
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const editingRow = ref(null) // null = add mode
const formData = ref({})
const formError = ref('')

async function load() {
  loading.value = true
  try {
    const data = await adminFetch(props.resourceKey)
    rows.value = data.rows || []
  } catch (err) {
    formError.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(load)

function openAdd() {
  editingRow.value = null
  formData.value = {}
  showForm.value = true
  formError.value = ''
}

function openEdit(row) {
  editingRow.value = row
  formData.value = { ...row }
  // list fields: parse JSON
  for (const f of resource.value.fields) {
    if (f.type === 'list') {
      try {
        formData.value[f.key] = typeof formData.value[f.key] === 'string'
          ? JSON.parse(formData.value[f.key] || '[]').join('\n')
          : (Array.isArray(formData.value[f.key]) ? formData.value[f.key].join('\n') : '')
      } catch {
        formData.value[f.key] = ''
      }
    }
  }
  showForm.value = true
  formError.value = ''
}

function closeForm() {
  showForm.value = false
  formError.value = ''
}

// Prepare body for API call: convert list fields to arrays, parse numbers, etc.
function prepareBody() {
  const body = {}
  for (const f of resource.value.fields) {
    const val = formData.value[f.key]
    if (f.type === 'checkbox') body[f.key] = !!val
    else if (f.type === 'number') body[f.key] = val === '' || val === null ? null : Number(val)
    else if (f.type === 'list') body[f.key] = String(val || '').split('\n').map((s) => s.trim()).filter(Boolean)
    else body[f.key] = val ?? ''
  }
  return body
}

async function save() {
  saving.value = true
  formError.value = ''
  try {
    const body = prepareBody()
    if (editingRow.value) {
      body.__pk = getPkValue(editingRow.value)
      await adminFetch(props.resourceKey, { method: 'PUT', body })
    } else {
      await adminFetch(props.resourceKey, { method: 'POST', body })
    }
    closeForm()
    await load()
  } catch (err) {
    formError.value = err.message || 'Gagal menyimpan'
  } finally {
    saving.value = false
  }
}

function getPkValue(row) {
  const pk = resource.value.fields.find((f) => f.type === 'pk')
  return pk ? row[pk.key] : row.id
}

async function remove(row) {
  const pk = getPkValue(row)
  if (!confirm(`Yakin hapus ${pk}?`)) return
  try {
    await adminFetch(props.resourceKey, { method: 'DELETE', pk })
    await load()
  } catch (err) {
    formError.value = err.message
  }
}

// Truncate a value for table display.
function displayVal(row, field) {
  let val = row[field.key]
  if (val === null || val === undefined) return '-'
  if (field.type === 'list' && Array.isArray(val)) return `[${val.length} item]`
  if (typeof val === 'object') return JSON.stringify(val).slice(0, 40) + (JSON.stringify(val).length > 40 ? '...' : '')
  const s = String(val)
  return s.length > 40 ? s.slice(0, 40) + '...' : s
}

const visibleFields = computed(() => resource.value.fields.filter((f) => f.key !== 'stack'))
</script>

<template>
  <div>
    <!-- Header + Add button -->
    <div class="flex items-center justify-between mb-4">
      <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ rows.length }} baris</p>
      <button
        v-if="!resource.singleton"
        class="text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        @click="openAdd"
      >
        + Tambah
      </button>
    </div>

    <!-- Loading -->
    <p v-if="loading" class="text-sm text-neutral-500">Memuat...</p>

    <!-- Table -->
    <div v-else-if="rows.length || resource.singleton" class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-neutral-200 dark:border-neutral-800">
            <th v-for="f in visibleFields" :key="f.key" class="text-left font-medium text-neutral-500 dark:text-neutral-400 px-2 py-2">
              {{ f.label }}
            </th>
            <th class="w-20 px-2 py-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in resource.singleton ? [{ id: 1, ...rows[0] || {} }] : rows" :key="row.pk || row.id || i"
              class="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
            <td v-for="f in visibleFields" :key="f.key" class="px-2 py-2 text-neutral-800 dark:text-neutral-200">
              {{ displayVal(row, f) }}
            </td>
            <td class="px-2 py-2 text-right">
              <button class="text-xs text-blue-600 hover:text-blue-700 mr-2" @click="resource.singleton ? openEdit(rows[0]) : openEdit(row)">Edit</button>
              <button v-if="!resource.singleton" class="text-xs text-red-500 hover:text-red-600" @click="remove(row)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-sm text-neutral-500">Belum ada data.</p>

    <!-- Modal form -->
    <Teleport to="body">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-start justify-center pt-20 pb-10 px-4 bg-black/30" @click.self="closeForm">
        <div class="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950 max-h-[80vh] overflow-y-auto">
          <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            {{ editingRow ? 'Edit' : 'Tambah' }} {{ resource.label }}
          </h2>

          <div class="space-y-3">
            <div v-for="f in resource.fields" :key="f.key" v-show="f.type !== 'pk' || !editingRow">
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{{ f.label }}</label>
              <input
                v-if="f.type === 'text' || f.type === 'pk'"
                v-model="formData[f.key]"
                :required="f.required"
                class="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                v-else-if="f.type === 'textarea' || f.type === 'list'"
                v-model="formData[f.key]"
                :required="f.required"
                :rows="f.type === 'list' ? 5 : 3"
                :placeholder="f.type === 'list' ? 'Satu item per baris' : ''"
                class="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <input
                v-else-if="f.type === 'number'"
                v-model.number="formData[f.key]"
                type="number"
                class="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label v-else-if="f.type === 'checkbox'" class="flex items-center gap-2">
                <input type="checkbox" v-model="formData[f.key]" class="rounded border-neutral-300 dark:border-neutral-700" />
                <span class="text-sm text-neutral-600 dark:text-neutral-400">{{ f.label }}</span>
              </label>
              <select
                v-else-if="f.type === 'select'"
                v-model="formData[f.key]"
                :required="f.required"
                class="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Pilih...</option>
                <option v-for="opt in f.options()" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
          </div>

          <p v-if="formError" class="mt-3 text-sm text-red-500">{{ formError }}</p>

          <div class="mt-6 flex items-center gap-3 justify-end">
            <button class="px-4 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900" @click="closeForm">Batal</button>
            <button :disabled="saving" class="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50" @click="save">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
