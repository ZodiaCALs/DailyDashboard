<template>
  <div class="page">
    <div class="page-wrapper">
      <header class="navbar navbar-expand-md navbar-light d-print-none border-bottom bg-white sticky-top">
        <div class="container-xl w-100">
          <h1 class="navbar-brand navbar-brand-autodark m-0 fs-5"> 项目管理</h1>

          <div class="btn-list">
            <router-link
              to="/"
              class="btn btn-sm"
              :class="$route.path === '/' ? 'btn-primary' : 'btn-outline-primary'"
            >
            </router-link>
            <router-link
              to="/annual-report"
              class="btn btn-sm"
              :class="$route.path === '/annual-report' ? 'btn-primary' : 'btn-outline-primary'"
            >
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