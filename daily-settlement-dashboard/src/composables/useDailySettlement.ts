// // src/composables/useDailySettlement.ts
// import { ref } from 'vue'

// export interface EditableTask {
//   _uid: number | string
//   _editing: boolean
//   executor: string
//   executors: string[]
//   status: string
//   client: string
//   clients: string[]
//   content: string
//   level: string
//   start_time: string
//   end_time: string
//   hours: number
//   is_delayed: boolean
//   is_cancelled: boolean
// }

// export interface DailyRecord {
//   id: string
//   date: string
//   amount: number
//   category: string
//   note?: string
// }

// // ✅ 移除 localStorage 读取，初始化为空数组
// const records = ref<DailyRecord[]>([])

// // ✅ 移除 watch + localStorage.setItem

// export function useDailySettlement() {
//   const selectedDate = ref('')
//   const editableTasks = ref<Record<string | number, EditableTask>>({})
//   const dynamicOptions = ref<string[]>([])

//   const addDynamicOption = (field: string, value: string) => {
//     if (!dynamicOptions.value.includes(value)) {
//       dynamicOptions.value.push(value)
//     }
//   }

//   const addNewRow = () => {
//     const uid = Date.now()
//     editableTasks.value[uid] = {
//       _uid: uid,
//       _editing: true,
//       executor: '',
//       executors: [],
//       status: '',
//       client: '',
//       clients: [],
//       content: '',
//       level: '',
//       start_time: '',
//       end_time: '',
//       hours: 0,
//       is_delayed: false,
//       is_cancelled: false,
//     }
//   }

//   const formatHours = (taskOrHours: EditableTask | number): string => {
//     const h = typeof taskOrHours === 'number' ? taskOrHours : (taskOrHours?.hours ?? 0)
//     return `${h}h`
//   }

//   const hasOvertime = (taskOrHours: EditableTask | number): boolean => {
//     const h = typeof taskOrHours === 'number' ? taskOrHours : (taskOrHours?.hours ?? 0)
//     return h > 8
//   }

//   const startEdit = (id: string | number) => {
//     if (editableTasks.value[id]) editableTasks.value[id]._editing = true
//   }

//   const saveRow = (id: string | number) => {
//     if (editableTasks.value[id]) editableTasks.value[id]._editing = false
//   }

//   const cancelEdit = (id: string | number) => {
//     if (editableTasks.value[id]) editableTasks.value[id]._editing = false
//   }

//   const deleteRow = (id: string | number) => {
//     delete editableTasks.value[id]
//     records.value = records.value.filter(r => r.id !== String(id))
//   }

//   return {
//     records,
//     selectedDate,
//     editableTasks,
//     dynamicOptions,
//     addNewRow,
//     addDynamicOption,
//     formatHours,
//     hasOvertime,
//     startEdit,
//     saveRow,
//     cancelEdit,
//     deleteRow,
//   }
// }