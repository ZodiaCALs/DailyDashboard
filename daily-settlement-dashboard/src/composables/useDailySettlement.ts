// src/composables/useDailySettlement.ts
import { ref, watch } from 'vue'

export interface EditableTask {
  _uid: number | string
  _editing: boolean
  executor: string
  executors: string[]       // ✅ 确保是数组（模板可能用 .length 或 v-for）
  status: string
  client: string
  clients: string[]         // ✅ 确保是数组
  content: string
  level: string
  start_time: string
  end_time: string
  hours: number             // ✅ 新增：formatHours/hasOvertime 需要此字段
  is_delayed: boolean
  is_cancelled: boolean
}

export interface DailyRecord {
  id: string
  date: string
  amount: number
  category: string
  note?: string
}

const STORAGE_KEY = 'daily_settlement_records'

const records = ref<DailyRecord[]>(
  JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
)

watch(records, (newVal) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export function useDailySettlement() {
  const selectedDate = ref('')
  const editableTasks = ref<Record<string | number, EditableTask>>({})
  const dynamicOptions = ref<string[]>([])

  // ✅ 修复1: 支持2个参数 (field, value) —— 对应 L46, L72, L111, L112, L118, L121, L128, L129 的错误
  const addDynamicOption = (field: string, value: string) => {
    if (!dynamicOptions.value.includes(value)) {
      dynamicOptions.value.push(value)
    }
  }

  const addNewRow = () => {
    const uid = Date.now()
    editableTasks.value[uid] = {
      _uid: uid,
      _editing: true,
      executor: '',
      executors: [],
      status: '',
      client: '',
      clients: [],
      content: '',
      level: '',
      start_time: '',
      end_time: '',
      hours: 0,             // ✅ 新增默认值
      is_delayed: false,
      is_cancelled: false,
    }
  }

  // ✅ 修复2: 接受 EditableTask 对象而非 number —— 对应 L117, L120 的错误
  const formatHours = (taskOrHours: EditableTask | number): string => {
    const h = typeof taskOrHours === 'number' ? taskOrHours : (taskOrHours?.hours ?? 0)
    return `${h}h`
  }

  // ✅ 修复3: 同样接受 EditableTask 对象
  const hasOvertime = (taskOrHours: EditableTask | number): boolean => {
    const h = typeof taskOrHours === 'number' ? taskOrHours : (taskOrHours?.hours ?? 0)
    return h > 8
  }

  const startEdit = (id: string | number) => {
    if (editableTasks.value[id]) editableTasks.value[id]._editing = true
  }

  const saveRow = (id: string | number) => {
    if (editableTasks.value[id]) editableTasks.value[id]._editing = false
  }

  const cancelEdit = (id: string | number) => {
    if (editableTasks.value[id]) editableTasks.value[id]._editing = false
  }

  const deleteRow = (id: string | number) => {
    delete editableTasks.value[id]
    records.value = records.value.filter(r => r.id !== String(id))
  }

  return {
    records,
    selectedDate,
    editableTasks,
    dynamicOptions,
    addNewRow,
    addDynamicOption,
    formatHours,
    hasOvertime,
    startEdit,
    saveRow,
    cancelEdit,
    deleteRow,
  }
}