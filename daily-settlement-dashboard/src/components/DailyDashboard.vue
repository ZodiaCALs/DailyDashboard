<template>
  <div class="page-wrapper">
    <div class="container-xl">
      <!-- 顶部工具栏 -->
      <div class="row g-2 align-items-center mb-3">
        <div class="col">
          <h2 class="page-title">📋 每日结算看板</h2>
        </div>
        <div class="col-auto d-flex gap-2">
          <input type="date" v-model="selectedDate" class="form-control w-auto" />
          <button class="btn btn-primary" @click="addNewRow">+ 新增任务</button>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="card">
        <div class="table-responsive">
          <table class="table table-vcenter card-table table-striped">
            <thead>
              <tr>
                <th style="width:100px">执行人</th>
                <th style="width:80px">状态</th>
                <th style="width:120px">客户</th>
                <th>工作内容</th>
                <th style="width:60px">等级</th>
                <th style="width:90px">开始时间</th>
                <th style="width:90px">结束时间</th>
                <!-- ✅ 拆分为三列 -->
                <th style="width:90px" class="text-end">正常工时</th>
                <th style="width:90px" class="text-end">加班</th>
                <th style="width:90px" class="text-end">总工时</th>
                <th style="width:60px">延期</th>
                <th style="width:60px">取消</th>
                <th style="width:100px">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(task, index) in editableTasks" :key="task._uid">
                <!-- 执行人 -->
                <td>
                  <EditableSelect
                    v-if="task._editing"
                    v-model="task.executor"
                    :options="dynamicOptions.executors"
                    placeholder="选择/输入"
                    @add-option="(val: string) => addDynamicOption('executors', val)"
                  />
                  <span v-else>{{ task.executor }}</span>
                </td>

                <!-- 状态 -->
                <td>
                  <select v-if="task._editing" v-model="task.status" class="form-select form-select-sm">
                    <option value="工作">工作</option>
                    <option value="待命">待命</option>
                    <option value="请假">请假</option>
                  </select>
                  <span v-else class="badge" :class="{
                    'bg-blue-lt text-blue': task.status === '工作',
                    'bg-gray-lt text-gray': task.status === '待命',
                    'bg-yellow-lt text-yellow': task.status === '请假',
                  }">{{ task.status }}</span>
                </td>

                <!-- 客户 -->
                <td>
                  <EditableSelect
                    v-if="task._editing"
                    v-model="task.client"
                    :options="dynamicOptions.clients"
                    placeholder="选择/输入"
                    @add-option="(val: string) => addDynamicOption('clients', val)"
                  />
                  <span v-else>{{ task.client }}</span>
                </td>

                <!-- 工作内容 -->
                <td>
                  <input v-if="task._editing" v-model="task.content" class="form-control form-control-sm" placeholder="工作内容" />
                  <span v-else>{{ task.content }}</span>
                </td>

                <!-- 等级 -->
                <td>
                  <select v-if="task._editing" v-model="task.level" class="form-select form-select-sm">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                  <span v-else class="badge" :class="{
                    'bg-green-lt text-green': task.level === 'A',
                    'bg-blue-lt text-blue': task.level === 'B',
                    'bg-gray-lt text-gray': task.level === 'C',
                  }">{{ task.level }}</span>
                </td>

                <!-- 开始时间 -->
                <td>
                  <input v-if="task._editing" v-model="task.start_time" type="time" class="form-control form-control-sm" />
                  <span v-else>{{ task.start_time }}</span>
                </td>

                <!-- 结束时间 -->
                <td>
                  <input v-if="task._editing" v-model="task.end_time" type="time" class="form-control form-control-sm" />
                  <span v-else>{{ task.end_time }}</span>
                </td>

                <!-- ✅ 正常工时 -->
                <td class="text-end">
                  <span v-if="task._editing" class="text-secondary fst-italic">{{ formatHours(task, 'normal') }}</span>
                  <span v-else>{{ formatHours(task, 'normal') }}</span>
                </td>

                <!-- ✅ 加班（带高亮标识） -->
                <td class="text-end">
                  <span v-if="task._editing" class="fst-italic" :class="hasOvertime(task) ? 'text-orange fw-bold' : 'text-secondary'">
                    {{ formatHours(task, 'overtime') }}
                  </span>
                  <span v-else-if="hasOvertime(task)" class="badge bg-orange-lt text-orange fw-bold" title="超出 10:00-18:30 工作时间范围">
                    🔥 {{ formatHours(task, 'overtime') }}
                  </span>
                  <span v-else class="text-secondary">-</span>
                </td>

                <!-- ✅ 总工时 -->
                <td class="text-end fw-bold">
                  <span v-if="task._editing" class="fst-italic">{{ formatHours(task, 'total') }}</span>
                  <span v-else>{{ formatHours(task, 'total') }}</span>
                </td>

                <!-- 延期 -->
                <td class="text-center">
                  <input v-if="task._editing" v-model="task.is_delayed" type="checkbox" class="form-check-input" />
                  <span v-else-if="task.is_delayed" class="badge bg-red-lt text-red">延期</span>
                  <span v-else class="text-secondary">-</span>
                </td>

                <!-- 取消 -->
                <td class="text-center">
                  <input v-if="task._editing" v-model="task.is_cancelled" type="checkbox" class="form-check-input" />
                  <span v-else-if="task.is_cancelled" class="badge bg-gray-lt text-gray">取消</span>
                  <span v-else class="text-secondary">-</span>
                </td>

                <!-- 操作按钮 -->
                <td>
                  <div class="btn-list flex-nowrap">
                    <button v-if="!task._editing" class="btn btn-sm btn-outline-primary" @click="startEdit(index)">✏️</button>
                    <template v-else>
                      <button class="btn btn-sm btn-success" @click="saveRow(index)">💾</button>
                      <button class="btn btn-sm btn-outline-secondary" @click="cancelEdit(index)">✖</button>
                    </template>
                    <button v-if="!task._editing" class="btn btn-sm btn-outline-danger" @click="deleteRow(index)">🗑</button>
                  </div>
                </td>
              </tr>

              <!-- 空状态 -->
              <tr v-if="editableTasks.length === 0">
                <td colspan="13" class="text-center text-secondary py-4">
                  暂无任务，点击「+ 新增任务」添加
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import EditableSelect from './EditableSelect.vue'

// ==================== 类型定义 ====================
interface DailyTask {
  id?: string
  date: string
  executor: string
  status: '工作' | '待命' | '请假'
  client: string
  content: string
  level: 'A' | 'B' | 'C'
  start_time: string
  end_time: string
  actual_duration: number
  normal_hours: number       // ✅ 新增
  overtime_hours: number     // ✅ 新增
  is_delayed: boolean
  delay_reason?: string
  is_cancelled: boolean
  cancel_reason?: string
  remark?: string
  // 前端运行时字段
  _uid: string
  _editing: boolean
  _backup?: Omit<DailyTask, '_backup'> & { _uid: string; _editing: boolean }
}

// ==================== 工作时间常量 ====================
const WORK_START_MIN = 10 * 60   // 10:00 → 600分钟
const WORK_END_MIN = 18.5 * 60   // 18:30 → 1110分钟

// ==================== 响应式数据 ====================
const selectedDate = ref(new Date().toISOString().slice(0, 10))
const editableTasks = ref<(DailyTask)[]>([])

const dynamicOptions = ref({
  executors: ['张三', '李四', '王五'],
  clients: ['客户A', '客户B', '内部'],
})

// ==================== 安全获取任务（解决TS报错） ====================
const getTask = (index: number): DailyTask => {
  const task = editableTasks.value[index]
  if (!task) throw new Error(`任务索引 ${index} 不存在`)
  return task
}

// ==================== ✅ 核心工时计算引擎 ====================
const calcWorkHours = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) {
    return { total: 0, normal: 0, overtime: 0 }
  }

  const startParts = startTime.split(':').map(Number)
  const endParts = endTime.split(':').map(Number)
  const startMin = (startParts[0] ?? 0) * 60 + (startParts[1] ?? 0)
  const endMin = (endParts[0] ?? 0) * 60 + (endParts[1] ?? 0)

  if (endMin <= startMin) {
    return { total: 0, normal: 0, overtime: 0 }
  }

  // 计算与正常工作时间 [10:00, 18:30] 的交集
  const overlapStart = Math.max(startMin, WORK_START_MIN)
  const overlapEnd = Math.min(endMin, WORK_END_MIN)
  const normalMin = Math.max(0, overlapEnd - overlapStart)
  const totalMin = endMin - startMin

  return {
    total: +(totalMin / 60).toFixed(2),
    normal: +(normalMin / 60).toFixed(2),
    overtime: +((totalMin - normalMin) / 60).toFixed(2),
  }
}

// ✅ 供模板使用的格式化函数
const formatHours = (task: DailyTask, type: 'total' | 'normal' | 'overtime'): string => {
  if (task._editing) {
    const result = calcWorkHours(task.start_time, task.end_time)
    return result[type].toFixed(2) + 'h'
  }
  const key = type === 'total' ? 'actual_duration'
    : type === 'normal' ? 'normal_hours'
      : 'overtime_hours'
  return (task[key] ?? 0).toFixed(2) + 'h'
}

// ✅ 判断当前行是否有加班（用于样式控制）
const hasOvertime = (task: DailyTask): boolean => {
  if (task._editing) {
    return calcWorkHours(task.start_time, task.end_time).overtime > 0
  }
  return (task.overtime_hours ?? 0) > 0
}

// ==================== UID 生成 ====================
let uidCounter = 0
const generateUid = () => `_uid_${Date.now()}_${++uidCounter}`

// ==================== CRUD 操作 ====================
const addNewRow = () => {
  editableTasks.value.push({
    date: selectedDate.value,
    executor: '',
    status: '工作',
    client: '',
    content: '',
    level: 'B',
    start_time: '10:00',
    end_time: '18:30',
    actual_duration: 0,
    normal_hours: 0,
    overtime_hours: 0,
    is_delayed: false,
    is_cancelled: false,
    _uid: generateUid(),
    _editing: true,
  })
}

const startEdit = (index: number) => {
  const task = getTask(index)
  task._backup = JSON.parse(JSON.stringify(task))
  task._editing = true
}

const cancelEdit = (index: number) => {
  const task = getTask(index)
  if (task._backup) {
    Object.assign(task, task._backup)
  } else {
    editableTasks.value.splice(index, 1)
    return
  }
  task._editing = false
  delete task._backup
}

const saveRow = async (index: number) => {
  const task = getTask(index)

  if (!task.executor || !task.content || !task.client) {
    alert('请填写执行人、客户和工作内容')
    return
  }

  // ✅ 使用新引擎计算三项工时
  const hours = calcWorkHours(task.start_time, task.end_time)
  task.actual_duration = hours.total
  task.normal_hours = hours.normal
  task.overtime_hours = hours.overtime

  // TODO: 替换为真实API调用
  // const payload = { ...task };
  // delete payload._uid; delete payload._editing; delete payload._backup;
  // await fetch(task.id ? `/api/tasks/${task.id}` : '/api/tasks', {
  //   method: task.id ? 'PUT' : 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });

  task._editing = false
  delete task._backup
  console.log('✅ 已保存:', task)
}

const deleteRow = async (index: number) => {
  const task = getTask(index)
  if (!confirm(`确定删除 ${task.executor} 的任务「${task.content}」？`)) return

  // TODO: await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })

  editableTasks.value.splice(index, 1)
}

const addDynamicOption = (key: keyof typeof dynamicOptions.value, val: string) => {
  if (val && !dynamicOptions.value[key].includes(val)) {
    dynamicOptions.value[key].push(val)
  }
}
</script>