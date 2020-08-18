<template>
  <el-dialog :append-to-body="true" :before-close="handleClose" :visible.sync="visible">
    <div style="margin-top:-25px;">
      <div class="dialog-title">
        <span>{{ isCreate ? '添加友情链接' : '更新友情链接' }}</span>
      </div>

      <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
        <el-form-item label="名称" prop="name" required>
          <el-input size="medium" v-model="form.name" placeholder="请填写友情链接的名称"></el-input>
        </el-form-item>

        <el-form-item label="URL" prop="url" required>
          <el-input size="medium" v-model="form.url" placeholder="请填写友情链接的 URL"></el-input>
        </el-form-item>

        <el-form-item label="图标地址" prop="icon">
          <el-input size="medium" v-model="form.icon" placeholder="请填写友情链接图标的 URL"></el-input>
        </el-form-item>

        <el-form-item label="权重" prop="priority" required>
          <el-input
            size="medium"
            type="number"
            v-model="form.priority"
            placeholder="请填写友情链接的权重,权重越低,排名越上"
          ></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="kind" required>
          <el-select size="medium" v-model="form.kind" placeholder="请选择友情链接类型">
            <el-option v-for="item in kindList" :key="item.id" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="显示状态" prop="display_state" required>
          <el-switch
            v-model="display"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="显示"
            inactive-text="隐藏"
          ></el-switch>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            size="medium"
            v-model="form.description"
            type="textarea"
            :rows="5"
            placeholder="请填写友情链接的描述"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer" style="padding-left:5px;">
      <el-button
        type="primary"
        @click="submitForm"
        v-permission="{ permission: '更新友情链接', type: 'disabled' }"
        :loading="loading"
      >确 定</el-button
      >

      <el-button @click="resetForm('form')">重 置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FriendLink from '@/model/friend-link'

export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    isCreate: {
      type: Boolean,
      default: false,
    },
    friendLinkId: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    visible: {
      get() {
        return this.dialogFormVisible
      },
      set() {},
    },
  },
  data() {
    return {
      loading: false, // 是否显示加载数据动画
      display: true, // 友情链接显示状态值
      form: {
        priority: 0,
        kind: 0,
        display_state: 1,
        name: '',
        url: '',
        icon: null,
        description: '',
      },
      // 友情链接类型列表
      kindList: [
        {
          id: 1,
          label: '友情链接',
          value: 0,
        },
        {
          id: 2,
          label: '推荐链接',
          value: 1,
        },
        {
          id: 3,
          label: '站长个人链接',
          value: 2,
        },
      ],
    }
  },
  watch: {
    // 监听友情链接显示状态切换
    display(val) {
      this.form.display_state = val ? 1 : 0
    },
  },
  async mounted() {
    // 更新友情链接时回显数据
    if (!this.isCreate) {
      const res = await FriendLink.getFriendLinkById(this.friendLinkId)
      this.form = res
      this.display = res.display_state === 1
    }
  },
  methods: {
    // 提交表单
    async submitForm() {
      try {
        const form = { ...this.form }
        let res
        if (this.isCreate) {
          this.loading = true
          res = await FriendLink.createFriendLink(form)
          this.loading = false
        } else {
          this.loading = true
          res = await FriendLink.updateFriendLinkById(this.friendLinkId, form)
          this.loading = false
        }
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.$message.success(`${res.message}`)
          this.$emit('dialogClose')
        } else {
          this.$message.error(`${res.message}`)
        }
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 监听弹窗关闭
    handleClose(done) {
      done()
      this.$emit('dialogClose')
    },
  },
}
</script>
<style lang="scss" scoped>
.dialog-title {
  color: $parent-title-color;
  font-size: 16px;
  margin-bottom: 20px;
}
</style>
