<template>
  <div class="icon-list">
    <div class="icon-group" v-for="(group, groupName) in iconGroups" :key="groupName">
      <h3>{{ groupName }}</h3>
      <div class="icon-grid">
        <div v-for="icon in group" :key="icon.name" class="icon-item">
          <el-icon><component :is="icon.component" /></el-icon>
          <span class="icon-name">{{ icon.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as ElementPlusIcons from '@element-plus/icons-vue'

// 图标分组
const iconGroups = {
  '常用操作': [
    { name: 'Search', component: ElementPlusIcons.Search },
    { name: 'Setting', component: ElementPlusIcons.Setting },
    { name: 'Edit', component: ElementPlusIcons.Edit },
    { name: 'Delete', component: ElementPlusIcons.Delete },
    { name: 'Plus', component: ElementPlusIcons.Plus },
    { name: 'Close', component: ElementPlusIcons.Close }
  ],
  '导航图标': [
    { name: 'Menu', component: ElementPlusIcons.Menu },
    { name: 'ArrowLeft', component: ElementPlusIcons.ArrowLeft },
    { name: 'ArrowRight', component: ElementPlusIcons.ArrowRight },
    { name: 'ArrowDown', component: ElementPlusIcons.ArrowDown },
    { name: 'ArrowUp', component: ElementPlusIcons.ArrowUp },
    { name: 'Back', component: ElementPlusIcons.Back }
  ],
  '状态图标': [
    { name: 'Loading', component: ElementPlusIcons.Loading },
    { name: 'Success', component: ElementPlusIcons.SuccessFilled },
    { name: 'Warning', component: ElementPlusIcons.WarningFilled },
    { name: 'Error', component: ElementPlusIcons.CircleCloseFilled },
    { name: 'Info', component: ElementPlusIcons.InfoFilled }
  ],
  '文件操作': [
    { name: 'Document', component: ElementPlusIcons.Document },
    { name: 'Folder', component: ElementPlusIcons.Folder },
    { name: 'Upload', component: ElementPlusIcons.Upload },
    { name: 'Download', component: ElementPlusIcons.Download }
  ],
  '其他': [
    { name: 'User', component: ElementPlusIcons.User },
    { name: 'Lock', component: ElementPlusIcons.Lock },
    { name: 'Bell', component: ElementPlusIcons.Bell },
    { name: 'Message', component: ElementPlusIcons.Message },
    { name: 'Star', component: ElementPlusIcons.Star },
    { name: 'Calendar', component: ElementPlusIcons.Calendar }
  ]
}
</script>

<style lang="scss" scoped>
.icon-list {
  padding: 20px;

  .icon-group {
    margin-bottom: 30px;

    h3 {
      margin-bottom: 15px;
      font-size: 18px;
      color: var(--el-text-color-primary);
    }

    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 20px;

      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px;
        cursor: pointer;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        transition: all 0.3s;

        &:hover {
          color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
          border-color: var(--el-color-primary);
        }

        .el-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .icon-name {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}
</style>
