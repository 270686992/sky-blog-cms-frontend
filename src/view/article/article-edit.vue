<template>
  <div>
    <div class="title">
      <span>更新文章</span>
      <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
      <el-divider></el-divider>
    </div>

    <div class="container">
      <div class="wrap">
        <el-row>
          <el-col :lg="24" :md="24" :sm="24" :xs="24">
            <el-form
              :model="form"
              status-icon
              ref="form"
              label-width="100px"
              v-loading="loading"
              @submit.native.prevent
            >
              <el-form-item label="标题" prop="title" required>
                <el-input size="medium" v-model="form.title" placeholder="请填写文章的标题"></el-input>
              </el-form-item>

              <el-form-item label="权重" prop="priority" required>
                <el-input
                  size="medium"
                  type="number"
                  v-model="form.priority"
                  placeholder="请填写文章的权重,权重越低,排名越上"
                ></el-input>
              </el-form-item>

              <el-form-item label="标签" prop="tagList">
                <el-cascader placeholder="请选择标签(可多选)" v-model="tagList" :props="cascaderProps"></el-cascader>
              </el-form-item>

              <el-form-item label="分类" prop="category_id" required>
                <el-autocomplete
                  @focus="loadCategoryList"
                  popper-class="my-autocomplete"
                  class="inline-input"
                  v-model="categoryName"
                  :fetch-suggestions="queryCategorySearch"
                  placeholder="请选择所属分类"
                  @select="handleCategorySelect"
                >
                  <template slot-scope="{ item }">
                    <span class="name">{{ item.name }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>

              <el-form-item label="文章类型" prop="kind" required>
                <el-select size="medium" v-model="form.kind" placeholder="请选择文章类型">
                  <el-option v-for="item in kindList" :key="item.id" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="发布状态" prop="publish_state" required>
                <el-switch
                  v-model="publish_state_display"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="发布"
                  inactive-text="私密"
                ></el-switch>
              </el-form-item>

              <el-form-item label="评论开关" prop="enable_comment" required>
                <el-switch
                  v-model="enable_comment_display"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="开启"
                  inactive-text="关闭"
                ></el-switch>
              </el-form-item>

              <el-form-item label="封面图" prop="cover_image">
                <upload-imgs ref="uploadEle" :max-num="maxNum" :rules="rules" :value="initData" />
              </el-form-item>

              <el-form-item label="文章简述" prop="description">
                <el-input
                  size="medium"
                  v-model="form.description"
                  type="textarea"
                  :rows="5"
                  placeholder="请填写文章简述"
                >
                </el-input>
              </el-form-item>

              <el-form-item label="文章内容" prop="content" required>
                <div id="editor">
                  <mavon-editor v-model="form.content" ref="md" @imgAdd="$imgAdd" style="height: 100%"></mavon-editor>
                </div>
              </el-form-item>

              <el-form-item class="submit">
                <el-button
                  v-permission="{ permission: '更新文章', type: 'disabled' }"
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
import { mavonEditor } from 'mavon-editor'
import Article from '@/model/article'
import Category from '@/model/category'
import Tag from '@/model/tag'
import UploadImgs from '@/component/base/upload-image'
import 'mavon-editor/dist/css/index.css'

export default {
  components: {
    UploadImgs,
    mavonEditor,
  },
  props: {
    articleId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loading: false, // 是否显示加载数据动画
      submitLoading: false, // 是否显示加载数据动画(提交按钮)
      publish_state_display: true, // 文章发布状态值
      enable_comment_display: true, // 文章评论开关值
      maxNum: 1, // 文章封面图最大数量
      initData: [], // 文章封面图初始数据
      // 上传图片的规则
      rules: {
        minWidth: 10,
        minHeight: 10,
        maxSize: 5,
      },
      form: {
        title: '',
        priority: 0,
        category_id: null,
        kind: 1,
        publish_state: 1,
        enable_comment: 1,
        cover_image: '',
        description: '',
        content: '',
        tag_id_list: [],
      },
      // 供文章选择的文章类型列表
      kindList: [
        {
          id: 1,
          label: '原创',
          value: 1,
        },
        {
          id: 2,
          label: '转载',
          value: 0,
        },
      ],
      tagList: [], // 文章所选的标签列表
      categoryName: '',
      categoryList: [], // 供文章选择的分类列表
      // 供文章选择的标签的信息
      cascaderProps: {
        lazy: true,
        multiple: true,
        async lazyLoad(node, resolve) {
          const { level } = node
          try {
            const tagList = await Tag.getAllTagList()
            const nodes = tagList.map(item => ({
              value: item.id,
              label: `${item.name}`,
              leaf: level >= 0,
            }))
            resolve(nodes)
          } catch (error) {
            this.$message.error('获取标签信息失败,请检查网络!')
          }
        },
      },
    }
  },
  watch: {
    // 监听文章发布状态切换
    publish_state_display(val) {
      this.form.publish_state = val ? 1 : 0
    },
    // 监听文章评论开关切换
    enable_comment_display(val) {
      this.form.enable_comment = val ? 1 : 0
    },
  },
  async mounted() {
    // 更新文章时回显数据
    this.loading = true
    const res = await Article.getArticleById(this.articleId)
    this.form = res
    this.enable_comment_display = res.enable_comment === 1
    this.publish_state_display = res.publish_state === 1
    this.initData = [{ display: res.cover_image }]
    this.tagList = res.tag_id_list.map(item => [item])
    this.categoryName = res.category_name
    this.loading = false
  },
  methods: {
    // 提交表单
    async submitForm() {
      try {
        await this.getValue()
        const form = { ...this.form }
        form.tag_id_list = this.tagList.map(tag => tag[0])

        this.submitLoading = true
        const res = await Article.updateArticleById(this.articleId, form)
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
    // markdown 编辑器图片上传
    // 绑定 @imgAdd event
    $imgAdd(pos, $file) {
      // 第一步,将图片上传到服务器
      const formData = new FormData()
      formData.append('image', $file)
      // eslint-disable-next-line no-undef
      axios({
        url: '/cms/file/',
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(res => {
        // 第二步,将返回的 url 替换到文本原位置 ![...](0) -> ![...](url)
        this.$refs.md.$img2Url(pos, res[0].url)
      })
    },
    // 获取上传图片信息
    async getValue() {
      const val = await this.$refs.uploadEle.getValue()
      if (val && val.length > 0) {
        this.form.cover_image = val[0].display
      }
    },
    queryCategorySearch(queryString, cb) {
      // eslint-disable-next-line
      const categoryList = this.categoryList
      const results = queryString ? categoryList.filter(this.categoryFilter(queryString)) : categoryList
      cb(results)
    },
    categoryFilter(queryString) {
      // eslint-disable-next-line
      return category => {
        return category.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    // 监听分类选择
    handleCategorySelect(item) {
      this.categoryName = item.name
      this.form.category_id = item.id
    },
    // 获取分类信息
    async loadCategoryList() {
      if (this.categoryList.length > 0) {
        return
      }
      try {
        this.categoryList = await Category.getAllCategoryList()
        if (this.categoryList.length === 0) {
          this.$message.error('暂无分类,请先添加!')
        }
      } catch (error) {
        this.$message.error('获取分类信息失败!')
        console.error(error)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.tagList = []
      this.categoryName = ''
      this.initData = []
      this.publish_state_display = true
      this.enable_comment_display = true
      this.$refs[formName].resetFields()
    },
    // 监听返回文章列表页
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

.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;
    display: inline-flex;
    align-content: space-around;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .id {
      margin-right: 15px;
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}

#editor {
  /*margin: auto auto auto 0;*/
  width: 95%;
  height: 580px;
}
</style>
