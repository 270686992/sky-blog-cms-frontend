<template>
  <el-dialog :append-to-body="true" :before-close="handleClose" :visible.sync="visible">
    <div style="margin-top:-25px;">
      <div class="dialog-title">
        <span>{{ isCreate ? '添加文章分类' : '更新文章分类' }}</span>
      </div>

      <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
        <el-form-item label="名称" prop="name" required>
          <el-input size="medium" v-model="form.name" placeholder="请填写文章分类的名称"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input size="medium" v-model="form.description" placeholder="请填写文章分类的描述"></el-input>
        </el-form-item>

        <el-form-item label="权重" prop="priority" required>
          <el-input
            size="medium"
            type="number"
            v-model="form.priority"
            placeholder="请填写文章分类的权重,权重越低,排名越上"
          ></el-input>
        </el-form-item>

        <el-form-item label="上线状态" prop="online" required>
          <el-switch
            v-model="display"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="上线"
            inactive-text="下线"
          ></el-switch>
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <upload-imgs ref="uploadEle" :max-num="maxNum" :rules="rules" :value="initData" />
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer" style="padding-left:5px;">
      <el-button
        type="primary"
        @click="submitForm"
        v-permission="{ permission: '更新文章分类', type: 'disabled' }"
        :loading="loading"
        >确 定</el-button
      >

      <el-button @click="resetForm('form')">重 置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Category from '@/model/category'
import UploadImgs from '@/component/base/upload-image'

export default {
  components: {
    UploadImgs,
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    isCreate: {
      type: Boolean,
      default: false,
    },
    categoryId: {
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
      display: true, // 文章分类上线状态值
      initData: [], // 文章分类图标初始数据
      maxNum: 1, // 文章分类图标最大数量
      // 上传图片的规则
      rules: {
        minWidth: 10,
        minHeight: 10,
        maxSize: 5,
      },
      form: {
        name: '',
        description: '',
        icon: '',
        online: 1,
        priority: 0,
      },
    }
  },
  watch: {
    // 监听文章分类上线状态切换
    display(val) {
      this.form.online = val ? 1 : 0
    },
  },
  async mounted() {
    // 更新文章分类时回显数据
    if (!this.isCreate) {
      const res = await Category.getCategoryById(this.categoryId)
      this.form = res
      this.display = res.online === 1
      this.initData = [{ display: res.icon }]
    }
  },
  methods: {
    // 提交表单
    async submitForm() {
      try {
        await this.getValue()
        const form = { ...this.form }
        let res
        if (this.isCreate) {
          this.loading = true
          res = await Category.createCategory(form)
          this.loading = false
        } else {
          this.loading = true
          res = await Category.updateCategoryById(this.categoryId, form)
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
    // 获取上传图片信息
    async getValue() {
      const val = await this.$refs.uploadEle.getValue()
      if (val && val.length > 0) {
        this.form.icon = val[0].display
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
