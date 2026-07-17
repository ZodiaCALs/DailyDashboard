<template>
  <div class="page-wrapper">
    <div class="container-xl">
      <div class="row g-2 align-items-center mb-4">
        <div class="col"><h2 class="page-title">📈 年度人员效能统计</h2></div>
        <div class="col-auto">
          <select v-model="selectedYear" class="form-select w-auto">
            <option v-for="y in availableYears" :key="y" :value="y">{{ y }} 年</option>
          </select>
        </div>
      </div>

      <!-- 汇总卡片 -->
      <div class="row row-deck row-cards mb-4">
        <div class="col-sm-6 col-lg-3">
          <div class="card"><div class="card-body">
            <div class="subheader">团队总工时</div>
            <div class="h1 mb-0">{{ teamSummary.totalHours.toFixed(1) }}h</div>
          </div></div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card"><div class="card-body">
            <div class="subheader">总加班时长</div>
            <div class="h1 mb-0 text-orange">{{ teamSummary.totalOvertime.toFixed(1) }}h</div>
          </div></div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card"><div class="card-body">
            <div class="subheader">延期任务总数</div>
            <div class="h1 mb-0 text-red">{{ teamSummary.totalDelayed }}</div>
          </div></div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card"><div class="card-body">
            <div class="subheader">请假人次</div>
            <div class="h1 mb-0 text-yellow">{{ teamSummary.totalLeave }}</div>
          </div></div>
        </div>
      </div>

      <!-- 人员明细表 -->
      <div class="card">
        <div class="card-header"><h3 class="card-title">执行人年度明细</h3></div>
        <div class="table-responsive">
          <table class="table table-vcenter card-table table-striped">
            <thead>
              <tr>
                <th>执行人</th>
                <th class="text-end">完成任务数</th>
                <th class="text-end">正常工时</th>
                <th class="text-end">加班时长</th>
                <th class="text-center">等级分布 (A/B/C)</th>
                <th class="text-end">延期次数</th>
                <th class="text-end">取消次数</th>
                <th class="text-end">请假天数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in reportRows" :key="row.executor">
                <td class="fw-bold">{{ row.executor }}</td>
                <td class="text-end">{{ row.completedTasks }}</td>
                <td class="text-end">{{ row.normalHours.toFixed(1) }}h</td>
                <td class="text-end">
                  <span :class="row.overtimeHours > 0 ? 'badge bg-orange-lt text-orange' : 'text-secondary'">
                    {{ row.overtimeHours.toFixed(1) }}h
                  </span>
                </td>
                <td class="text-center">
                  <span class="badge bg-green-lt text-green me-1">A:{{ row.levelA }}</span>
                  <span class="badge bg-blue-lt text-blue me-1">B:{{ row.levelB }}</span>
                  <span class="badge bg-gray-lt text-gray">C:{{ row.levelC }}</span>
                </td>
                <td class="text-end text-red">{{ row.delayedCount }}</td>
                <td class="text-end text-secondary">{{ row.cancelledCount }}</td>
                <td class="text-end text-yellow">{{ row.leaveDays }}</td>
              </tr>
              <tr v-if="reportRows.length === 0">
                <td colspan="8" class="text-center text-secondary py-4">{{ selectedYear }} 年暂无数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface AnnualRow {
  executor: string;
  completedTasks: number;
  normalHours: number;
  overtimeHours: number;
  levelA: number; levelB: number; levelC: number;
  delayedCount: number;
  cancelledCount: number;
  leaveDays: number;
}

const selectedYear = ref(new Date().getFullYear());
const availableYears = computed(() => {
  const current = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => current - i);
});

// TODO: 替换为真实API调用
const allTasks = ref<any[]>([]);

onMounted(async () => {
  // const res = await fetch(`/api/daily-tasks?year=${selectedYear.value}`);
  // allTasks.value = await res.json();
  
  // 临时Mock数据用于验证UI
//   allTasks.value = [
//     { executor: '张三', status: '工作', level: 'A', is_delayed: false, is_cancelled: false, normal_hours: 7, overtime_hours: 1.5, date: '2026-01-15' },
//     { executor: '张三', status: '工作', level: 'B', is_delayed: true, is_cancelled: false, normal_hours: 8, overtime_hours: 0, date: '2026-02-20' },
//     { executor: '李四', status: '请假', level: 'A', is_delayed: false, is_cancelled: false, normal_hours: 0, overtime_hours: 0, date: '2026-03-01' },
//     { executor: '李四', status: '工作', level: 'A', is_delayed: false, is_cancelled: true, normal_hours: 6, overtime_hours: 2, date: '2026-03-15' },
//   ];
// });

const filteredTasks = computed(() => 
  allTasks.value.filter(t => t.date?.startsWith(String(selectedYear.value)))
);

const reportRows = computed<AnnualRow[]>(() => {
  const map = new Map<string, AnnualRow>();
  
  for (const t of filteredTasks.value) {
    if (!map.has(t.executor)) {
      map.set(t.executor, {
        executor: t.executor, completedTasks: 0,
        normalHours: 0, overtimeHours: 0,
        levelA: 0, levelB: 0, levelC: 0,
        delayedCount: 0, cancelledCount: 0, leaveDays: 0,
      });
    }
    const row = map.get(t.executor)!;
    
    if (t.status === '请假') {
      row.leaveDays++;
    } else if (!t.is_cancelled) {
      row.completedTasks++;
      row.normalHours += t.normal_hours ?? 0;
      row.overtimeHours += t.overtime_hours ?? 0;
      if (t.level === 'A') row.levelA++;
      else if (t.level === 'B') row.levelB++;
      else row.levelC++;
      if (t.is_delayed) row.delayedCount++;
    }
    if (t.is_cancelled) row.cancelledCount++;
  }
  
  return Array.from(map.values()).sort((a, b) => b.completedTasks - a.completedTasks);
});

const teamSummary = computed(() => ({
  totalHours: reportRows.value.reduce((s, r) => s + r.normalHours + r.overtimeHours, 0),
  totalOvertime: reportRows.value.reduce((s, r) => s + r.overtimeHours, 0),
  totalDelayed: reportRows.value.reduce((s, r) => s + r.delayedCount, 0),
  totalLeave: reportRows.value.reduce((s, r) => s + r.leaveDays, 0),
}));
</script>