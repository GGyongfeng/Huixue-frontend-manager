<template>
  <div class="page-content">
    <div class="header">
      <h3>上传订单</h3>
      <!-- PC端标签页 -->
      <div class="draft-tabs" v-if="!isMobile">
        <el-tabs v-model="currentDraftId" class="draft-tabs-container" @tab-remove="handleTabRemove"
          @tab-click="handleTabClick" closable addable @tab-add="createNewDraft">
          <el-tab-pane v-for="draft in draftList" :key="draft.id" :label="draft.data.tutor_code || '未命名草稿'"
            :name="draft.id" />
        </el-tabs>
      </div>
      <!-- 移动端下拉选择 -->
      <el-select v-else v-model="currentDraftId" class="mobile-draft-select" @change="handleDraftChange">
        <el-option v-for="draft in draftList" :key="draft.id" :label="draft.data.tutor_code || '未命名草稿'"
          :value="draft.id">
          <span>{{ draft.data.tutor_code || '未命名草稿' }}</span>
          <el-icon class="close-icon" @click.stop="removeDraft(draft.id)">
            <Close />
          </el-icon>
        </el-option>
        <el-option key="new" label="新建草稿" value="new">
          <el-icon>
            <Plus />
          </el-icon>
          <span> 新建草稿</span>
        </el-option>
      </el-select>
    </div>

    <OrderEditCard v-model="orderForm" ref="orderEditCardRef">
      <template #form-actions>
        <el-form-item class="form-actions">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="submitForm" :loading="loading">
            提交
          </el-button>
        </el-form-item>
      </template>
    </OrderEditCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'
import OrderEditCard from '@/components/Form/OrderForm/OrderEditor/index.vue'
import type { TutorOrder } from '@/types/tutorOrder'
import { useUserStore } from '@/store/modules/user'
import { mutationApis } from '@/api/tutors/mutation'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getDefaultOrderSelection, type City } from '@/types/OrderOptions'
import { Close, Plus } from '@element-plus/icons-vue'
import type { TabsPaneContext, TabPaneName } from 'element-plus'

interface DraftItem {
  id: string
  createTime: number
  expireTime: number
  data: TutorOrder
}

// 常量定义
const DRAFTS_KEY = 'TUTOR_ORDER_DRAFTS'
const CURRENT_DRAFT_KEY = 'CURRENT_DRAFT_ID'
const ONE_DAY = 24 * 60 * 60 * 1000

// refs 和 基础数据
const orderEditCardRef = ref()
const userStore = useUserStore()
const router = useRouter()
const loading = ref(false)
const userCity = (userStore.info.city || '天津') as City

// 初始化表单数据 - 移到前面
const orderForm = reactive<TutorOrder>(getDefaultOrderSelection(userCity))

// 草稿列表
const draftList = ref<DraftItem[]>([])
const currentDraftId = ref('')

// 判断是否为移动端
const { width } = useWindowSize()
const isMobile = computed(() => width.value <= 768)

// 保存草稿列表
const saveDraftList = () => {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(draftList.value))
}

// 监听表单变化自动保存草稿
watch(
  orderForm,
  (newValue) => {
    const index = draftList.value.findIndex(d => d.id === currentDraftId.value)
    if (index > -1) {
      draftList.value[index] = {
        ...draftList.value[index],
        data: { ...newValue },
        expireTime: Date.now() + ONE_DAY
      }
      saveDraftList()
    }
  },
  { deep: true }
)

// 从 localStorage 获取草稿列表
const loadDrafts = () => {
  const stored = localStorage.getItem(DRAFTS_KEY)
  if (stored) {
    try {
      const drafts = JSON.parse(stored) as DraftItem[]
      // 过滤掉过期的草稿
      draftList.value = drafts.filter(draft => draft.expireTime > Date.now())
      // 如果有草稿被过滤掉，更新存储
      if (drafts.length !== draftList.value.length) {
        localStorage.setItem(DRAFTS_KEY, JSON.stringify(draftList.value))
      }
    } catch (error) {
      console.error('解析草稿失败:', error)
      draftList.value = []
    }
  }
}

// 创建新草稿时自动选中并保存
const createNewDraft = () => {
  const newDraft: DraftItem = {
    id: Date.now().toString(),
    createTime: Date.now(),
    expireTime: Date.now() + ONE_DAY,
    data: { ...getDefaultOrderSelection(userCity) }
  }
  draftList.value.push(newDraft)
  saveDraftList()
  switchDraft(newDraft.id)
}

// 切换草稿时更新表单数据
const switchDraft = (draftId: string) => {
  currentDraftId.value = draftId
  const draft = draftList.value.find(d => d.id === draftId)
  if (draft) {
    Object.assign(orderForm, draft.data)
    localStorage.setItem(CURRENT_DRAFT_KEY, draftId)
  }
}

// 删除草稿时自动切换到其他草稿
const removeDraft = (draftId: string) => {
  const index = draftList.value.findIndex(d => d.id === draftId)
  if (index > -1) {
    draftList.value.splice(index, 1)
    saveDraftList()

    if (currentDraftId.value === draftId) {
      if (draftList.value.length > 0) {
        switchDraft(draftList.value[0].id)
      } else {
        createNewDraft()
      }
    }
  }
}

// 清除当前草稿
const clearDraft = () => {
  const index = draftList.value.findIndex(d => d.id === currentDraftId.value)
  if (index > -1) {
    draftList.value.splice(index, 1)
    saveDraftList()
  }
  localStorage.removeItem(CURRENT_DRAFT_KEY)
  // 如果还有其他草稿，切换到第一个，否则创建新草稿
  if (draftList.value.length > 0) {
    switchDraft(draftList.value[0].id)
  } else {
    createNewDraft()
  }
}

// 初始化
onMounted(() => {
  loadDrafts()
  const storedCurrentId = localStorage.getItem(CURRENT_DRAFT_KEY)
  if (storedCurrentId && draftList.value.some(d => d.id === storedCurrentId)) {
    switchDraft(storedCurrentId)
  } else if (draftList.value.length > 0) {
    switchDraft(draftList.value[0].id)
  } else {
    createNewDraft()
  }
})

const formatDate = (date: Date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

const submitForm = async () => {
  try {
    const valid = await orderEditCardRef.value?.validate()
    if (!valid) return

    loading.value = true
    const res = await mutationApis.addTutor(orderForm)

    if (res.code === 200) {
      clearDraft()
      ElMessage.success('创建成功')
      const currentUser = userStore.info
      const currentTime = formatDate(new Date())

      router.push({
        path: '/result/success',
        query: {
          title: '创建成功',
          subTitle: [
            `订单编号：${orderForm.tutor_code}`,
            `创建时间：${currentTime}`,
            `创建人员：${currentUser.name || currentUser.username}`,
            `所在城市：${orderForm.city}${orderForm.district}`,
            `联系电话：${orderForm.phone_number}`
          ].join('\n'),
          extraInfo: '订单创建成功，请返回列表查看',
          backPath: '/tutors/list'
        }
      })
    } else {
      ElMessage.error(res.message || '创建失败')
    }
  } catch (error) {
    console.error('创建订单失败:', error)
    ElMessage.error('创建失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  orderEditCardRef.value?.resetFields()
  clearDraft()
}

// 处理移动端草稿切换
const handleDraftChange = (draftId: string) => {
  if (draftId === 'new') {
    createNewDraft()
  } else {
    switchDraft(draftId)
  }
}

// 处理标签页点击
const handleTabClick = (tab: TabsPaneContext) => {
  switchDraft(String(tab.props.name))
}

// 修改删除草稿的处理函数
const handleTabRemove = (name: TabPaneName) => {
  removeDraft(String(name))
}
</script>

<style lang="scss" scoped>
.page-content {
  width: 100%;
  height: 100%;
  padding: 10px;

  .header {
    display: flex;
    align-items: center;
    padding-bottom: 15px;

    h3 {
      font-size: 18px;
      font-weight: 500;
      margin-right: 20px;
      white-space: nowrap;
    }

    .draft-tabs {
      flex: 1;
      overflow: hidden;
      margin-right: 40px;

      :deep(.draft-tabs-container) {
        .el-tabs__header {
          margin-bottom: 0;
        }

        .el-tabs__nav-wrap {
          &::after {
            height: 1px;
            background-color: var(--el-border-color-light);
          }
        }

        .el-tabs__item {
          &.is-active {
            font-weight: 500;
          }

          .el-icon-close {
            &:hover {
              background-color: var(--el-color-danger);
              color: white;
            }
          }
        }

        .el-tabs__new-tab {
          margin-left: 6px;
          border: none;

          &:hover {
            color: var(--el-color-primary);
            background: var(--el-color-primary-light-9);
          }
        }
      }
    }

    // 移动端下拉框样式保持不变
    .mobile-draft-select {
      width: 140px;
      margin-left: 12px;
    }
  }
}

// 添加新的样式
.form-actions {
  display: flex;
  justify-content: flex-end; // 使按钮靠右对齐

  :deep(.el-form-item__content) {
    justify-content: flex-end; // 确保按钮组件也靠右对齐
    margin-left: 0 !important; // 覆盖 Element Plus 的默认左边距
  }
}
</style>