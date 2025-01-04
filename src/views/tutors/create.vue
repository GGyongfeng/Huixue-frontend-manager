<template>
  <div class="page-content">
    <div class="header">
      <h3>上传订单</h3>
      <!-- PC端标签页 -->
      <div class="draft-tabs" v-if="!isMobile">
        <el-scrollbar class="tabs-scrollbar">
          <div class="tabs-header">
            <el-tabs v-model="currentDraftId" class="draft-tabs-container" @tab-remove="handleTabRemove"
              @tab-click="handleTabClick" closable addable @tab-add="createNewDraft">
              <el-tab-pane v-for="draft in draftList" :key="draft.id" :label="draft.data.tutor_code || '未命名草稿'"
                :name="draft.id" />
            </el-tabs>
            <el-button v-if="draftList.length > 0" class="clear-all-btn" type="danger" link @click="confirmClearAll">
              清空草稿
            </el-button>
          </div>
        </el-scrollbar>
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
          <div class="button-group">
            <el-button @click="resetForm">重置</el-button>
            <el-button @click="showBatchUpload">一键上传</el-button>
            <el-button @click="submitAllDrafts" :loading="submitAllLoading">提交所有草稿</el-button>
            <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
          </div>
        </el-form-item>
      </template>
    </OrderEditCard>

    <!-- 添加批量上传对话框 -->
    <BatchUploadDialog v-model="batchUploadVisible" @confirm="handleBatchUpload" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted, nextTick } from 'vue'
import { useWindowSize } from '@vueuse/core'
import OrderEditCard from '@/components/Form/OrderForm/OrderEditor2/index.vue'
import type { TutorOrder } from '@/types/tutorOrder'
import { useUserStore } from '@/store/modules/user'
import { mutationApis } from '@/api/tutors/mutation'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { getDefaultOrderSelection, type City } from '@/types/OrderOptions'
import { Close, Plus } from '@element-plus/icons-vue'
import type { TabsPaneContext, TabPaneName } from 'element-plus'
import BatchUploadDialog from '@/components/Tutors/dialogs/BatchUploadDialog.vue'
import { parseMultipleOrders } from '@/utils/orderParser'

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

// 验证城市是否有效
const isValidCity = (city: string): city is City => {
  return ['天津', '北京', '西安', '上海', '南京', '武汉'].includes(city)
}

// 使用验证函数确保城市类型正确
const userCity = computed(() => {
  const city = userStore.info?.userInfo?.city || '天津'
  console.log('userCity', city)
  return isValidCity(city) ? city : '天津'
})

// 初始化表单数据 - 移到前面
const orderForm = ref<TutorOrder>(getDefaultOrderSelection(userCity.value))

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

// 创建新草稿时自选中并保存
const createNewDraft = () => {
  // 获取完全空白的默认表单
  const emptyForm = getDefaultOrderSelection(userCity.value)
  
  const newDraft: DraftItem = {
    id: Date.now().toString(),
    createTime: Date.now(),
    expireTime: Date.now() + ONE_DAY,
    data: { ...emptyForm }  // 使用空白表单
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
    // 完全替换表单数据
    orderForm.value = { ...getDefaultOrderSelection(userCity.value), ...draft.data }
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
  // 如果还有其他草稿，切换到一个，否则创建新草稿
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
    const res = await mutationApis.addTutor(orderForm.value)

    if (res.code === 200) {
      // 只删除当前草稿
      const index = draftList.value.findIndex(d => d.id === currentDraftId.value)
      if (index > -1) {
        draftList.value.splice(index, 1)
        saveDraftList()
      }
      
      // 如果还有其他草稿，切换到第一个
      if (draftList.value.length > 0) {
        switchDraft(draftList.value[0].id)
      } else {
        // 如果没有其他草稿了，创建新草稿
        createNewDraft()
      }
      
      ElMessage.success('创建成功')
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
  // 先重置表单
  orderEditCardRef.value?.resetFields()
  // 重新设置为完全空白的表单
  orderForm.value = getDefaultOrderSelection(userCity.value)
  // 清除草稿
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

// 批量上传相关
const batchUploadVisible = ref(false)

const showBatchUpload = () => {
  batchUploadVisible.value = true
}

const handleBatchUpload = (text: string) => {
  if (!text || typeof text !== 'string') {
    ElMessage.error('无效的输入文本')
    return
  }

  const orders = parseMultipleOrders(text, userCity.value)

  // 如果只有一个订单，直接更新当前表单
  if (orders.length === 1) {
    Object.assign(orderForm.value, orders[0])
    return
  }

  // 如果有多个订单，为每个订单创建一个新草稿
  orders.forEach((order, index) => {
    // 第一个订单更新当前表单
    if (index === 0) {
      Object.assign(orderForm.value, order)
    } else {
      // 其他订单创建新草稿
      const newDraft: DraftItem = {
        id: Date.now() + index.toString(),
        createTime: Date.now(),
        expireTime: Date.now() + ONE_DAY,
        data: {
          ...getDefaultOrderSelection(userCity.value),
          ...order
        }
      }
      draftList.value.push(newDraft)
    }
  })

  // 保存草稿列表
  saveDraftList()
}

// 清空所有草稿确认
const confirmClearAll = () => {
  ElMessageBox.confirm(
    '确定要清空所有草稿吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 清空草稿列表
    draftList.value = []
    // 清除本地存储
    localStorage.removeItem(DRAFTS_KEY)
    localStorage.removeItem(CURRENT_DRAFT_KEY)
    // 创建新草稿
    createNewDraft()
    ElMessage.success('已清空所有草稿')
  }).catch(() => {
    // 取消时不做任何操作
  })
}

// 添加新的 ref
const submitAllLoading = ref(false)

// 添加验证单个草稿的方法
const validateDraft = async (draft: DraftItem): Promise<boolean> => {
  // 切换到要验证的草稿
  switchDraft(draft.id)
  // 等待 DOM 更新
  await nextTick()
  
  try {
    const valid = await orderEditCardRef.value?.validate()
    return valid || false
  } catch (error) {
    return false
  }
}

// 修改提交所有草稿的方法
const submitAllDrafts = async () => {
  if (draftList.value.length === 0) {
    ElMessage.warning('没有可提交的草稿')
    return
  }

  try {
    const confirmResult = await ElMessageBox.confirm(
      `确定要提交所有草稿吗？共 ${draftList.value.length} 个草稿`,
      '提交确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).catch(() => false)

    if (!confirmResult) return

    submitAllLoading.value = true
    const initialDraftCount = draftList.value.length
    
    // 用于统计各种状态
    const stats = {
      formatInvalid: 0,  // 格式验证未通过数量
      submitted: 0,      // 提交数量
      success: 0,        // 成功数量
      duplicated: 0,     // 订单号重复数量
      otherFailed: 0     // 其他失败数量
    }

    // 先进行本地格式验证
    const validDrafts: DraftItem[] = []
    const invalidDrafts: DraftItem[] = []

    for (const draft of [...draftList.value]) {
      const isValid = await validateDraft(draft)
      if (isValid) {
        validDrafts.push(draft)
      } else {
        invalidDrafts.push(draft)
        stats.formatInvalid++
      }
    }

    // 如果有格式验证未通过的草稿，提示用户
    if (invalidDrafts.length > 0) {
      ElMessage.warning(`${invalidDrafts.length} 个草稿未通过格式验证，将被保留`)
    }

    // 提交验证通过的草稿
    stats.submitted = validDrafts.length
    for (const draft of validDrafts) {
      try {
        const res = await mutationApis.addTutor(draft.data)
        if (res.code === 200) {
          stats.success++
          // 从草稿列表中移除
          const index = draftList.value.findIndex(d => d.id === draft.id)
          if (index > -1) {
            draftList.value.splice(index, 1)
            saveDraftList()
          }
        } else {
          // 处理不同类型的失败
          if (res.message?.includes('订单编号已存在')) {
            stats.duplicated++
          } else {
            stats.otherFailed++
          }
          // 保留失败的草稿
          ElMessage.error(`草稿 ${draft.data.tutor_code || '未命名'} 提交失败: ${res.message}`)
        }
      } catch (error) {
        stats.otherFailed++
        console.error('提交草稿失败:', error)
        ElMessage.error(`草稿 ${draft.data.tutor_code || '未命名'} 提交失败`)
      }
    }

    // 只要有成功提交的订单就跳转到结果页面
    if (stats.success > 0) {
      const currentTime = new Date().toLocaleString()
      const currentUser = userStore.info?.userInfo

      // 构建详细的结果信息
      const resultDetails = [
        `草稿总数：${initialDraftCount} 个`,
        `成功上传：${stats.success} 个`
      ]

      // 上传失败的草稿
      if (stats.otherFailed > 0) {
        resultDetails.push(`上传失败：${stats.otherFailed} 个`)
        resultDetails.push(`--原因：订单号已存在`)
      }
      
      // 格式验证未通过的草稿
      if (stats.formatInvalid > 0) {
        const invalidCodes = invalidDrafts
          .map(d => d.data.tutor_code || '未命名')
          .join('、')
        resultDetails.push(`格式验证未通过：${stats.formatInvalid} 个`)
        resultDetails.push(`--具体订单号：${invalidCodes}`)
      }

      // 订单号重复的草稿
      const duplicatedDrafts = validDrafts.filter(d => 
        d.data.tutor_code && !draftList.value.find(vd => vd.id === d.id)
      )
      if (stats.duplicated > 0) {
        const duplicatedCodes = duplicatedDrafts
          .map(d => d.data.tutor_code)
          .join('、')
        resultDetails.push(`订单号重复：${stats.duplicated} 个`)
        resultDetails.push(`具体订单号：${duplicatedCodes}`)
      }


      router.push({
        path: '/result/success',
        query: {
          title: '批量上传完成',
          subTitle: [
            `成功上传数量：${stats.success}个订单`,
            `上传时间：${currentTime}`,
            `上传人员：${currentUser?.realname || currentUser?.username}`,
          ].join('\n'),
          extraInfo: resultDetails.join('\n'),
          backPath: '/tutors/list'
        }
      })
      return
    }

    // 如果一个都没有成功，显示简单的错误信息
    ElMessage.error('没有订单上传成功')

    // 如果还有草稿，切换到第一个，否则创建新草稿
    if (draftList.value.length > 0) {
      switchDraft(draftList.value[0].id)
    } else {
      createNewDraft()
    }

  } catch (error) {
    console.error('批量提交失败:', error)
    ElMessage.error('批量提交失败，请稍后重试')
  } finally {
    submitAllLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as vars;

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

      .tabs-header {
        display: flex;
        align-items: center;
        width: 100%;

        .draft-tabs-container {
          flex: 1;
          overflow: hidden;
        }

        .clear-all-btn {
          margin-left: 16px;
          font-size: 14px;

          &:hover {
            opacity: 0.8;
          }
        }
      }

      .tabs-scrollbar {
        width: 100%;

        :deep(.el-scrollbar__wrap) {
          height: 100%;
        }

        // 美化滚动条
        :deep(.el-scrollbar__bar) {
          opacity: 0;
          transition: opacity 0.3s;

          &.is-vertical {
            width: 4px;
          }

          &:hover {
            opacity: 0.3;
          }
        }
      }

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

        .el-tabs__nav-scroll {
          overflow: visible;
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
          position: sticky;
          right: 0;

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

// 加新的样式
.form-actions {
  display: flex;
  justify-content: flex-end; // 使按钮靠右对齐

  :deep(.el-form-item__content) {
    justify-content: flex-end; // 确保按钮组件也靠右对齐
    margin-left: 0 !important; // 覆盖 Element Plus 的默认左边距
  }
}

.clear-all-btn {
  margin-top: 10px;
  margin-left: 10px;
}

// 平板
@media screen and (max-width: vars.$device-ipad) {
  .page-content {
    padding: 0px;
  }
}

// 手机
@media screen and (max-width: vars.$device-phone) {
  .page-content {
    padding: 0px;
  }
}

.form-actions {
  :deep(.el-form-item__content) {
    display: flex;
    justify-content: flex-end;
    
    .button-group {
      display: flex;
      gap: 12px;
      padding: 24px 0;
      flex-wrap: wrap;  // 允许换行
      
      @media screen and (max-width: $device-phone) {
        width: 100%;
        gap: 8px;  // 减小间距
        padding: 16px 0;
        flex-direction: column;  // 改为垂直排列
        
        .el-button {
          width: 100%;  // 占满整行
          margin: 0;
          padding: 8px 12px;  // 调整内边距
          
          // 处理按钮文字
          :deep(.el-button__content) {
            display: inline-block;
            width: 100%;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>