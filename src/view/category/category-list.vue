<template>
  <div class="container">
    <div class="header">
      <div class="title">文章分类列表</div>

      <el-button
        style="margin-left: 30px;"
        @click.prevent="handleAdd"
        type="primary"
        plain
        size="medium"
        v-permission="{ permission: '添加文章分类', type: 'disabled' }"
        >添加文章分类</el-button
      >
    </div>

    <el-table stripe v-loading="loading" :data="tableData">
      <el-table-column prop="id" label="ID" width="200"></el-table-column>

      <el-table-column prop="icon" label="图标" width="200">
        <template v-if="scope.row.icon" slot-scope="scope">
          <el-image class="display_img" :src="scope.row.icon" :preview-src-list="imgSrcList"></el-image>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="200"></el-table-column>

      <el-table-column prop="priority" label="权重" width="200"></el-table-column>

      <el-table-column prop="online" label="状态" min-width="100">
        <template slot-scope="scope">{{ scope.row.online | onlineFormat }}</template>
      </el-table-column>

      <el-table-column fixed="right" width="200" label="操作">
        <template slot-scope="scope">
          <el-button @click.prevent="handleEdit(scope.row)" type="primary" plain size="mini">编辑</el-button>

          <el-button
            @click.prevent="handleDelete(scope.row)"
            type="danger"
            plain
            size="mini"
            v-permission="{ permission: '删除文章分类', type: 'disabled' }"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :background="true"
        :page-size="pageCount"
        :current-page="currentPage"
        v-if="refreshPagination"
        layout="prev, pager, next, jumper"
        :total="totalNums"
      ></el-pagination>
    </div>

    <!--  添加/更新文章分类弹窗  -->
    <category-edit
      v-if="dialogFormVisible"
      :isCreate="isCreate"
      :dialogFormVisible="dialogFormVisible"
      :categoryId="categoryId"
      @dialogClose="dialogClose"
    ></category-edit>
  </div>
</template>

<script>
import Category from '@/model/category'
import CategoryEdit from './category-edit'

export default {
  components: {
    CategoryEdit,
  },
  data() {
    return {
      loading: false, // 是否显示加载数据动画
      tableData: [],
      categoryId: 0,
      imgSrcList: [], // 用于大图预览
      totalNums: 0,
      currentPage: 1,
      pageCount: 10,
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新 Pagination 组件
      dialogFormVisible: false, // 是否显示添加/更新文章分类弹窗
      isCreate: false, // 是否显示添加文章分类弹窗
    }
  },
  async created() {
    this.loading = true
    this.getCategoryList()
    this.loading = false
  },
  filters: {
    onlineFormat(val) {
      return val === 1 ? '上线' : '下线'
    },
  },
  methods: {
    // 获取文章分类列表
    async getCategoryList() {
      const page = this.currentPage - 1
      const count = this.pageCount
      const categoryList = await Category.getCategoryListByPage(page, count)
      this.tableData = categoryList.items
      this.totalNums = categoryList.total
      this.initImgSrcList()
    },
    // 切换 table 页
    async handleCurrentChange(val) {
      this.imgSrcList = []
      this.currentPage = val
      this.loading = true
      this.getCategoryList()
      this.loading = false
    },
    // 初始化用于大图预览的图片 url 列表
    initImgSrcList() {
      this.tableData.forEach(item => {
        if (!item.icon) {
          return
        }
        this.imgSrcList.push(item.icon)
      })
    },
    // 监听添加文章分类
    handleAdd() {
      this.dialogFormVisible = true
      this.isCreate = true
    },
    // 监听更新文章分类
    handleEdit(val) {
      this.categoryId = val.id
      this.isCreate = false
      this.dialogFormVisible = true
    },
    // 监听删除文章分类
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该文章分类，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await Category.deleteCategoryById(val.id)
        } catch (e) {
          this.loading = false
          console.error(e)
        }
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.loading = false
          if (this.totalNums % this.pageCount === 1 && this.currentPage !== 1) {
            this.currentPage--
          }
          this.getCategoryList()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        } else {
          this.loading = false
          this.$message.error(`${res.message}`)
        }
      })
    },
    // 监听添加/更新文章分类弹窗关闭
    dialogClose() {
      this.dialogFormVisible = false
      this.loading = true
      this.getCategoryList()
      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }

  .display_img {
    max-width: 100px;
    max-height: 100px;
    width: auto;
    height: auto;
  }
}
</style>
