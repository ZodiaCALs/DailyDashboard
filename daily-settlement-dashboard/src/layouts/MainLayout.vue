<template>
  <div class="page">
    <!-- ✅ 侧边栏 -->
    <aside class="navbar navbar-vertical navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebar-menu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <h1 class="navbar-brand navbar-brand-autodark px-3 pt-2">📊 项目管理</h1>
        <div class="collapse navbar-collapse" id="sidebar-menu">
          <ul class="navbar-nav pt-lg-3">
            <li class="nav-item">
              <router-link to="/" class="nav-link" active-class="active" exact>
                <span class="nav-link-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
                <span class="nav-link-title">📋 每日结算</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/annual-report" class="nav-link" active-class="active">
                <span class="nav-link-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></span>
                <span class="nav-link-title">📈 年度统计</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </aside>

    <!-- ✅ 主内容区 -->
  <div class="page-wrapper">
      <div class="page-body">
        <!-- ✅ 用 KeepAlive 包裹 router-view -->
        <router-view v-slot="{ Component }">
          <keep-alive :include="['DailyDashboard']">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>