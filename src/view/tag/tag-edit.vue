<template>
  <el-dialog :append-to-body="true" :before-close="handleClose" :visible.sync="visible">
    <div style="margin-top:-25px;">
      <div class="dialog-title">
        <span>{{ isCreate ? '添加标签' : '更新标签' }}</span>
      </div>

      <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
        <el-form-item label="名称" prop="name">
          <el-input size="medium" v-model="form.name" placeholder="请填写标签的名称"></el-input>
        </el-form-item>

        <el-form-item label="上线状态" prop="online">
          <el-switch
            v-model="display"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="上线"
            inactive-text="下线"
          ></el-switch>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer" style="padding-left:5px;">
      <el-button type="primary" @click="submitForm" v-permission="{ permission: '更新标签', type: 'disabled' }"
        >确 定</el-button
      >

      <el-button @click="resetForm('form')">重 置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Tag from '@/model/tag'

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
    tagId: {
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
      display: true, // 标签上线状态默认值
      form: {
        name: '',
        online: 1,
      },
    }
  },
  watch: {
    // 监听标签上线状态切换
    display(val) {
      this.form.online = val ? 1 : 0
    },
  },
  async mounted() {
    // 更新标签时回显数据
    if (!this.isCreate) {
      const res = await Tag.getTagById(this.tagId)
      this.form = res
      this.display = res.online === 1
    }
  },
  methods: {
    // 提交表单
    async submitForm() {
      const form = { ...this.form }
      let res
      if (this.isCreate) {
        res = await Tag.createTag(form)
      } else {
        res = await Tag.updateTagById(this.tagId, form)
      }
      if (res.code < window.MAX_SUCCESS_CODE) {
        this.$message.success(`${res.message}`)
        this.$emit('dialogClose')
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
