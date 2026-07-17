import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface DailyTask {
  id?: string;
  date: string;
  executor: string;
  status: '工作' | '待命' | '请假';
  client: string;
  content: string;
  level: 'A' | 'B' | 'C';
  start_time: string;
  end_time: string;
  actual_duration: number;
  normal_hours: number;
  overtime_hours: number;
  is_delayed: boolean;
  is_cancelled: boolean;
  completed: boolean;
}

export const useDailyTasksStore = defineStore('dailyTasks', () => {
  const tasks = ref<DailyTask[]>([]);

  // 供 DailyDashboard 调用：保存/删除/完成任务后同步到 store
  const setTasks = (newTasks: DailyTask[]) => { tasks.value = newTasks; };
  const addTask = (task: DailyTask) => { tasks.value.push(task); };
  const updateTask = (index: number, task: Partial<DailyTask>) => {
    Object.assign(tasks.value[index], task);
  };
  const removeTask = (index: number) => { tasks.value.splice(index, 1); };

  return { tasks, setTasks, addTask, updateTask, removeTask };
});