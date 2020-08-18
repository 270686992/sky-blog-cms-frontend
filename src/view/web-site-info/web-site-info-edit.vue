<template>
  <div>
    <div class="title">
      <span>更新站点信息</span>
      <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
      <el-divider></el-divider>
    </div>

    <div class="container">
      <div class="wrap">
        <el-row>
          <el-col :lg="24" :md="24" :sm="24" :xs="24">
            <el-form :model="form" status-icon ref="form" label-width="150px" v-loading="loading" @submit.native.prevent>
              <el-form-item label="站点名称" prop="name" required>
                <el-input size="medium" v-model="form.name" placeholder="请填写站点的名称"/>
              </el-form-item>

              <el-form-item label="个性标题" prop="title" required>
                <el-input size="medium" v-model="form.title" placeholder="请填写站点的个性标题"/>
              </el-form-item>

              <el-form-item label="个性签名" prop="signature" required>
                <el-input size="medium" v-model="form.signature" placeholder="请填写站点的个性签名"/>
              </el-form-item>

              <el-form-item label="版权时间" prop="copyright_time" required>
                <el-input size="medium" v-model="form.copyright_time" placeholder="请填写站点的版权时间,如 2020-2020"/>
              </el-form-item>

              <el-form-item label="版本号" prop="version_number" required>
                <el-input size="medium" v-model="form.version_number" placeholder="请填写站点的版本号,如 V1.0.0"/>
              </el-form-item>

              <el-form-item label="ICP 备案号" prop="icp_number" required>
                <el-input size="medium" v-model="form.icp_number" placeholder="请填写 ICP 备案号"/>
              </el-form-item>

              <el-form-item label="作者昵称" prop="nickname" required>
                <el-input size="medium" v-model="form.nickname" placeholder="请填写用于前台展示的作者昵称"/>
              </el-form-item>

              <el-form-item label="站点图标" prop="icon" required>
                <upload-imgs ref="uploadEle1" :value="iconInitData" :rules="rules" :max-num="1"/>
              </el-form-item>

              <el-form-item label="作者头像" prop="author_avatar" required>
                <upload-imgs ref="uploadEle2" :value="authorAvatarInitData" :rules="rules" :max-num="1"/>
              </el-form-item>

              <el-form-item label="游客默认头像" prop="commentator_avatar" required>
                <upload-imgs ref="uploadEle3" :value="commentatorAvatarInitData" :rules="rules" :max-num="1"/>
              </el-form-item>

              <el-form-item label="友链申请说明" prop="application_explain">
                <el-input type="textarea" :rows="8" size="medium" v-model="form.application_explain" placeholder="请填写友链申请说明"/>
              </el-form-item>

              <el-form-item label="关于我" prop="about_me_explain">
                <el-input type="textarea" :rows="8" size="medium" v-model="form.about_me_explain" placeholder="请填写关于我的说明"/>
              </el-form-item>

              <el-form-item label="关于站点" prop="about_site_explain">
                <el-input type="textarea" :rows="8" size="medium" v-model="form.about_site_explain" placeholder="请填写关于站点的说明"/>
              </el-form-item>

              <el-form-item label="关于版权" prop="about_copyright_explain">
                <el-input type="textarea" :rows="8" size="medium" v-model="form.about_copyright_explain" placeholder="请填写关于版权的说明"/>
              </el-form-item>

              <el-form-item label="特别说明" prop="special_explain">
                <el-input type="textarea" :rows="8" size="medium" v-model="form.special_explain" placeholder="请填写特别说明"/>
              </el-form-item>

              <el-form-item label="站点公告" prop="announcement">
                <el-input type="textarea" :rows="8" size="medium" v-model="form.announcement" placeholder="请填写站点公告"/>
              </el-form-item>

              <el-form-item class="submit">
                <el-button
                  v-permission="{ permission: '更新站点信息', type: 'disabled' }"
                  type="primary"
                  @click="submitForm('form')"
                  :loading="submitLoading"
                >保 存</el-button
                >

                <el-button @click="resetForm('form')">重 置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import WebSiteInfo from '@/model/web-site-info'
import UploadImgs from '@/component/base/upload-image'

export default {
  components: {
    UploadImgs,
  },
  props: {
    webSiteInfoId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loading: false, // 是否显示加载数据动画
      submitLoading: false, // 是否显示加载数据动画(提交按钮)
      iconInitData: [], // 站点图标初始数据
      authorAvatarInitData: [], // 作者头像初始数据
      commentatorAvatarInitData: [], // 游客默认头像初始数据
      // 上传图片的规则
      rules: {
        minWidth: 10,
        minHeight: 10,
        maxSize: 5,
      },
      form: {
        name: '',
        title: '',
        signature: '',
        copyright_time: '',
        version_number: '',
        icp_number: '',
        nickname: '',
        icon: '',
        author_avatar: '',
        commentator_avatar: '',
        application_explain: '',
        about_me_explain: '',
        about_site_explain: '',
        about_copyright_explain: '',
        special_explain: '',
        announcement: '',
      },
    }
  },
  async mounted() {
    // 更新站点信息时回显数据
    this.loading = true
    const res = await WebSiteInfo.getWebSiteInfoById(this.webSiteInfoId)
    this.form = res
    this.iconInitData = [{ display: res.icon }]
    this.authorAvatarInitData = [{ display: res.author_avatar }]
    this.commentatorAvatarInitData = [{ display: res.commentator_avatar }]
    this.loading = false
  },
  methods: {
    // 提交表单
    async submitForm() {
      try {
        await this.getValue()
        const form = { ...this.form }

        this.submitLoading = true
        const res = await WebSiteInfo.updateWebSiteInfoById(this.webSiteInfoId, form)
        this.submitLoading = false

        if (res.code < window.MAX_SUCCESS_CODE) {
          this.$message.success(`${res.message}`)
          this.$emit('editClose')
        } else {
          this.$message.error(`${res.message}`)
        }
      } catch (error) {
        this.submitLoading = false
        console.log(error)
      }
    },
    // 获取上传图片信息
    async getValue() {
      const val1 = await this.$refs.uploadEle1.getValue()
      if (val1 && val1.length > 0) {
        this.form.icon = val1[0].display
      }

      const val2 = await this.$refs.uploadEle2.getValue()
      if (val2 && val2.length > 0) {
        this.form.author_avatar = val2[0].display
      }

      const val3 = await this.$refs.uploadEle3.getValue()
      if (val3 && val3.length > 0) {
        this.form.commentator_avatar = val3[0].display
      }
    },
    // 重置表单
    resetForm(formName) {
      this.iconInitData = []
      this.authorAvatarInitData = []
      this.commentatorAvatarInitData = []
      this.$refs[formName].resetFields()
    },
    // 监听返回站点信息列表页
    back() {
      this.$emit('editClose')
    },
  },
}
</script>
<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
}

.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
