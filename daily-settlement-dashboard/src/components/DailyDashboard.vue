<template>
  <div class="page-wrapper">
    <div class="container-xl">
      <!-- 顶部操作栏 -->
      <div class="row g-2 align-items-center mb-4">
        <div class="col">
          <h2 class="page-title">每日项目结算看板</h2>
        </div>
        <div class="col-auto d-flex gap-2">
          <input type="date" class="form-control" v-model="selectedDate" />
          <button 
            class="btn btn-primary" 
            @click="addNewRow"
            :disabled="isEditing"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler me-1" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
            新增任务
          </button>
        </div>
      </div>

      <!-- KPI 卡片（保持不变） -->
      <div class="row row-deck row-cards mb-4">
        <div class="col-sm-6 col-lg-3">
          <div class="card"><div class="card-body">
            <div class="subheader">有效任务数</div>
            <div class="h1 mb-0">{{ stats.validTasks }}</div>
          </div></div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card"><div class="card-body">
            <div class="subheader">总实际工时</div>
            <div class="h1 mb-0">{{ stats.totalHours.toFixed(1) }}h</div>
          </div></div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card"><div class="card-body">
            <div class="subheader">延期预警</div>
            <div class="h1 mb-0" :class="stats.delayedCount > 0 ? 'text-red' : ''">{{ stats.delayedCount }}</div>
          </div></div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card"><div class="card-body">
            <div class="subheader mb-2">人员状态</div>
            <div class="d-flex gap-2 flex-wrap">
              <span class="badge bg-green-lt text-green">{{ statusCount.working }} 工作</span>
              <span class="badge bg-blue-lt text-blue">{{ statusCount.standby }} 待命</span>
              <span class="badge bg-yellow-lt text-yellow">{{ statusCount.leave }} 请假</span>
            </div>
          </div></div>
        </div>
      </div>

      <!-- ✅ 可编辑数据表格 -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h3 class="card-title">当日任务明细</h3>
          <span v-if="isEditing" class="badge bg-yellow-lt text-yellow">编辑中...</span>
        </div>
        <div class="table-responsive">
          <table class="table table-vcenter card-table table-striped">
            <thead>
              <tr>
                <th style="width:100px">执行人</th>
                <th style="width:90px">状态</th>
                <th style="width:120px">客户</th>
                <th>工作内容</th>
                <th style="width:70px" class="text-end">数量</th>
                <th style="width:70px">等级</th>
                <th style="width:60px" class="text-center">延期</th>
                <th style="width:60px" class="text-center">取消</th>
                <th style="width:90px">起始时间</th>
                <th style="width:90px">完成时间</th>
                <th style="width:110px">项目执行人</th>
                <th style="width:90px" class="text-end">实际用时</th>
                <th style="width:90px" class="text-end">延期时间</th>
                <th style="width:180px">延期原因</th>
                <th style="width:80px" class="text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(task, index) in editableTasks" :key="task._uid">
                <!-- 执行人 -->
                <td>
                  <EditableSelect 
                    v-model="task.executor" 
                    :options="dynamicOptions.executors"
                    placeholder="选择/添加"
                    @add-option="(val: string) => addDynamicOption('executors', val)"
                    :readonly="!task._editing"
                  />
                </td>
                <!-- 状态 -->
                <td>
                  <EditableSelect 
                    v-model="task.status" 
                    :options="STATUS_OPTIONS"
                    :readonly="!task._editing"
                  />
                </td>
                <!-- 客户 -->
                <td>
                  <EditableSelect 
                    v-model="task.client" 
                    :options="dynamicOptions.clients"
                    placeholder="选择/添加"
                    @add-option="(val: string) => addDynamicOption('executors', val)"
                    :readonly="!task._editing"
                  />
                </td>
                <!-- 工作内容 -->
                <td>
                  <input 
                    v-if="task._editing"
                    v-model="task.content" 
                    class="form-control form-control-sm" 
                    placeholder="输入工作内容"
                  />
                  <span v-else class="text-secondary text-truncate d-block" style="max-width:200px" :title="task.content">{{ task.content }}</span>
                </td>
                <!-- 数量 -->
                <td class="text-end">
                  <input 
                    v-if="task._editing"
                    v-model.number="task.quantity" 
                    type="number" min="0" step="1"
                    class="form-control form-control-sm text-end" 
                  />
                  <span v-else>{{ task.quantity }}</span>
                </td>
                <!-- 等级 -->
                <td>
                  <EditableSelect 
                    v-model="task.level" 
                    :options="LEVEL_OPTIONS"
                    :readonly="!task._editing"
                  />
                </td>
                <!-- 延期 -->
                <td class="text-center">
                  <input 
                    v-if="task._editing"
                    v-model="task.is_delayed" 
                    type="checkbox" 
                    class="form-check-input m-0"
                  />
                  <span v-else>{{ task.is_delayed ? '⚠️' : '-' }}</span>
                </td>
                <!-- 取消 -->
                <td class="text-center">
                  <input 
                    v-if="task._editing"
                    v-model="task.is_cancelled" 
                    type="checkbox" 
                    class="form-check-input m-0"
                  />
                  <span v-else>{{ task.is_cancelled ? '❌' : '-' }}</span>
                </td>
                <!-- 起始/完成时间 -->
                <td>
                  <input v-if="task._editing" v-model="task.start_time" type="time" class="form-control form-control-sm" />
                  <span v-else class="text-secondary">{{ formatTime(task.start_time) }}</span>
                </td>
                <td>
                  <input v-if="task._editing" v-model="task.end_time" type="time" class="form-control form-control-sm" />
                  <span v-else class="text-secondary">{{ formatTime(task.end_time) }}</span>
                </td>
                <!-- 项目执行人 -->
                <td>
                  <EditableSelect 
                    v-model="task.project_manager" 
                    :options="dynamicOptions.managers"
                    placeholder="选择/添加"
                    @add-option="(val: string) => addDynamicOption('executors', val)"
                    :readonly="!task._editing"
                  />
                </td>
                <!-- 实际用时（自动计算，只读） -->
                <td class="text-end fw-bold">
                  {{ calcDuration(task) }}
                </td>
                <!-- 延期时间 -->
                <td class="text-end">
                  <input 
                    v-if="task._editing && task.is_delayed"
                    v-model.number="task.delay_hours" 
                    type="number" min="0" step="0.5"
                    class="form-control form-control-sm text-end border-red" 
                  />
                  <span v-else :class="task.is_delayed ? 'text-red' : 'text-secondary'">
                    {{ task.is_delayed ? (task.delay_hours?.toFixed(2) + 'h') : '-' }}
                  </span>
                </td>
                <!-- 延期原因 -->
                <td>
                  <input 
                    v-if="task._editing && task.is_delayed"
                    v-model="task.delay_reason" 
                    class="form-control form-control-sm border-red" 
                    placeholder="填写延期原因"
                  />
                  <span v-else class="text-secondary text-truncate d-block" style="max-width:180px" :title="task.delay_reason">
                    {{ task.is_delayed ? task.delay_reason : '-' }}
                  </span>
                </td>
                <!-- 操作按钮 -->
                <td class="text-center">
                  <div class="btn-group btn-group-sm">
                    <button 
                      v-if="!task._editing"
                      class="btn btn-outline-primary" 
                      @click="startEdit(index)"
                      title="编辑"
                    >✏️</button>
                    <template v-else>
                      <button class="btn btn-success" @click="saveRow(index)" title="保存">✓</button>
                      <button class="btn btn-outline-danger" @click="cancelEdit(index)" title="取消">✕</button>
                    </template>
                    <button 
                      v-if="!task._editing"
                      class="btn btn-outline-danger" 
                      @click="deleteRow(index)"
                      title="删除"
                    >🗑️</button>
                  </div>
                </td>
              </tr>
              <tr v-if="editableTasks.length === 0">
                <td colspan="15" class="text-center text-secondary py-4">
                  暂无记录，点击右上角「新增任务」添加
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
import { ref, computed, reactive } from 'vue';
import dayjs from 'dayjs';
import EditableSelect from './EditableSelect.vue'

// ==================== 类型定义 ====================
interface DailyTask {
  _uid: string;          // 前端唯一标识
  _editing: boolean;     // 编辑状态标记
  _backup?: DailyTask;   // 编辑前的快照（用于取消恢复）
  id?: string;           // 后端ID（新建时为空）
  date: string;
  executor: string;
  status: '工作' | '待命' | '请假';
  client: string;
  content: string;
  quantity: number;
  level: 'A' | 'B' | 'C';
  is_delayed: boolean;
  is_cancelled: boolean;
  start_time: string;
  end_time: string;
  project_manager: string;
  actual_duration: number;
  delay_hours?: number;
  delay_reason?: string;
}

// ==================== 常量选项 ====================
const STATUS_OPTIONS = ['工作', '待命', '请假'];
const LEVEL_OPTIONS = ['A', 'B', 'C'];

const getTask = (index: number): DailyTask & { _uid: string; _editing: boolean } => {
  const task = editableTasks.value[index];
  if (!task) throw new Error(`任务索引 ${index} 不存在`);
  return task;
};

// ==================== 动态选项管理 ====================
const dynamicOptions = reactive({
  executors: ['张三', '李四', '王五'],
  clients: ['ABC科技', 'XYZ集团'],
  managers: ['李四', '赵六'],
});

const addDynamicOption = (category: keyof typeof dynamicOptions, value: string) => {
  const trimmed = value.trim();
  if (trimmed && !dynamicOptions[category].includes(trimmed)) {
    dynamicOptions[category].push(trimmed);
  }
};

// ==================== 数据状态 ====================
const selectedDate = ref(dayjs().format('YYYY-MM-DD'));
const editableTasks = ref<(DailyTask & { _uid: string; _editing: boolean })[]>([]);
const isEditing = computed(() => editableTasks.value.some(t => t._editing));

// ==================== 编辑操作 ====================
let uidCounter = 0;
const generateUid = () => `_new_${++uidCounter}_${Date.now()}`;

const addNewRow = () => {
  const newRow: DailyTask & { _uid: string; _editing: boolean } = {
    _uid: generateUid(),
    _editing: true,
    date: selectedDate.value,
    executor: '',
    status: '工作',
    client: '',
    content: '',
    quantity: 1,
    level: 'B',
    is_delayed: false,
    is_cancelled: false,
    start_time: '09:00',
    end_time: '18:00',
    project_manager: '',
    actual_duration: 0,
  };
  editableTasks.value.unshift(newRow);
};

const startEdit = (index: number) => {
  const task = getTask(index);
  task._backup = JSON.parse(JSON.stringify(task));
  task._editing = true;
};

const cancelEdit = (index: number) => {
  const task = getTask(index);
  if (task._backup) {
    // 使用 Object.assign 时确保目标不为 undefined
    Object.assign(task, task._backup);
  } else {
    editableTasks.value.splice(index, 1);
    return;
  }
  task._editing = false;
  delete task._backup;
};

const saveRow = async (index: number) => {
  const task = getTask(index);
  
  if (!task.executor || !task.content || !task.client) {
    alert('请填写执行人、客户和工作内容');
    return;
  }

  task.actual_duration = calcDurationValue(task);
  
  // TODO: API 调用...
  
  task._editing = false;
  delete task._backup;
  console.log('✅ 已保存:', task);
};

const deleteRow = async (index: number) => {
  const task = getTask(index);
  if (!confirm(`确定删除 ${task.executor} 的任务「${task.content}」？`)) return;
  
  // TODO: API 删除...
  
  editableTasks.value.splice(index, 1);
};

// ==================== 计算逻辑 ====================
const calcDurationValue = (task: Pick<DailyTask, 'start_time' | 'end_time'>): number => {
  if (!task.start_time || !task.end_time) return 0;
  const startParts = task.start_time.split(':').map(Number);
  const endParts = task.end_time.split(':').map(Number);
  const sh = startParts[0] ?? 0;
  const sm = startParts[1] ?? 0;
  const eh = endParts[0] ?? 0;
  const em = endParts[1] ?? 0;
  const minutes = (eh * 60 + em) - (sh * 60 + sm);
  return Math.max(0, minutes / 60);
};

// ✅ 修改后
const calcDuration = (task: DailyTask): string => {
  if (task._editing) {
    return calcDurationValue(task).toFixed(2) + 'h';
  }
  return (task.actual_duration ?? 0).toFixed(2) + 'h';
};

const formatTime = (val: string) => val || '-';

// ==================== 统计（与之前相同） ====================
const validTasks = computed(() => editableTasks.value.filter(t => !t.is_cancelled));
const stats = computed(() => ({
  validTasks: validTasks.value.length,
  totalHours: validTasks.value.reduce((s, t) => s + (t._editing ? calcDurationValue(t) : (t.actual_duration || 0)), 0),
  delayedCount: validTasks.value.filter(t => t.is_delayed).length,
}));
const statusCount = computed(() => {
  const m = { working: 0, standby: 0, leave: 0 };
  editableTasks.value.forEach(t => {
    if (t.status === '工作') m.working++;
    else if (t.status === '待命') m.standby++;
    else m.leave++;
  });
  return m;
});
</script>