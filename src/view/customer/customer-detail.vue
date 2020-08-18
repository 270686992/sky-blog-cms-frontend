<template>
  <div>
    <sticky-top>
      <div class="title">
        <span>用户详情</span>

        <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>

        <el-divider></el-divider>
      </div>
    </sticky-top>

    <div class="container">
      <div class="wrap">
        <el-row>
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
              <el-form-item label="用户名" prop="username">
                <el-input disabled size="medium" v-model="form.username"></el-input>
              </el-form-item>

              <el-form-item label="昵称" prop="nickname">
                <el-input disabled size="medium" v-model="form.nickname"></el-input>
              </el-form-item>

              <el-form-item label="头像" prop="avatar">
                <el-avatar
                  :size="100"
                  :src="form.avatar && form.avatar"
                  @error="errorHandler">
                </el-avatar>
              </el-form-item>

              <el-form-item label="邮箱" prop="email">
                <el-input disabled size="medium" v-model="form.email"></el-input>
              </el-form-item>

              <el-form-item label="状态" prop="state">
                <el-switch
                  v-model="display"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="正常"
                  inactive-text="封禁"
                  disabled
                ></el-switch>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Customer from '@/model/customer'
import StickyTop from '@/component/base/sticky-top/sticky-top'

export default {
  components: {
    StickyTop,
  },
  props: {
    // 获取用户详情的用户 ID
    userId: {
      type: Number
    },
  },
  data() {
    return {
      form: {
        username: '',
        nickname: '',
        email: '',
        state: 1,
        avatar: '',
      },
      display: true, // 用户状态值
    }
  },
  async created() {
    this.$nextTick(async () => {
      this.getCustomer()
    })
  },
  methods: {
    /**
     * 获取博客用户详情
     */
    async getCustomer() {
      const res = await Customer.getCustomerById(this.userId)
      this.display = res.state === 1
      this.form = res
    },
    /**
     * 返回博客用户列表
     */
    back() {
      this.$emit('editClose')
    },
    errorHandler() {
      return true
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

.display_img {
  max-width: 100px;
  max-height: 100px;
  width: auto;
  height: auto;
}

.tree-view-item-key {
  color: red;
}
</style>
