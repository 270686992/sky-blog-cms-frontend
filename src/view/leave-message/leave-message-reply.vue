<template>
  <el-dialog :append-to-body="true" :before-close="handleClose" :visible.sync="visible">
    <div style="margin-top:-25px;">
      <div class="dialog-title">
        <span>回复留言</span>
      </div>

      <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
        <el-form-item label="回复留言" prop="content">
          <el-input size="medium" type="textarea" :rows="8" v-model="form.content" placeholder="请填写留言的回复内容"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer" style="padding-left:5px;">
      <el-button
        type="primary"
        @click="submitForm"
        v-permission="{ permission: '回复留言', type: 'disabled' }"
        :loading="loading"
      >回 复</el-button
      >

      <el-button @click="resetForm('form')">重 置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import LeaveMessage from '@/model/leave-message'

export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    leaveMessageId: {
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
      form: {
        content: '',
      },
    }
  },
  methods: {
    // 提交表单
    async submitForm() {
      try {
        const form = { ...this.form }

        this.loading = true
        const res = await LeaveMessage.replyLeaveMessageById(this.leaveMessageId, form)
        this.loading = false

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
