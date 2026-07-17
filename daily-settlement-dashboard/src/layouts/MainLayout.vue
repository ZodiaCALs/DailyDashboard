<template>
  <div class="page">
    <!-- ✅ 主内容区（已移除整个 aside 侧边栏） -->
    <div class="page-wrapper">
      <!-- ✅ 顶部导航栏：右上角页面切换按钮 -->
      <header class="navbar navbar-expand-md navbar-light d-print-none border-bottom bg-white sticky-top">
        <div class="container-xl w-100">
          <!-- 左侧标题 -->
          <h1 class="navbar-brand navbar-brand-autodark m-0 fs-5">📊 项目管理</h1>

          <!-- 右侧切换按钮组 -->
          <div class="btn-list">
            <router-link
              to="/"
              class="btn btn-sm"
              :class="$route.path === '/' ? 'btn-primary' : 'btn-outline-primary'"
            >
              📋 每日结算
            </router-link>
            <router-link
              to="/annual-report"
              class="btn btn-sm"
              :class="$route.path === '/annual-report' ? 'btn-primary' : 'btn-outline-primary'"
            >
              📈 年度统计
            </router-link>
          </div>
        </div>
      </header>

      <div class="page-body">
        <router-view v-slot="{ Component }">
          <keep-alive :include="['DailyDashboard']">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>