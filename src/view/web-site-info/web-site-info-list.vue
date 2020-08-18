<template>
  <div>
    <div v-if="!showEdit" class="container">
      <div class="header">
        <div class="title">站点信息列表</div>
      </div>

      <el-table stripe v-loading="loading" :data="tableData">
        <el-table-column prop="id" label="ID" width="100"></el-table-column>

        <el-table-column prop="name" label="站点名称" width="200"></el-table-column>

        <el-table-column prop="title" :show-overflow-tooltip="true" label="个性标题" width="200"></el-table-column>

        <el-table-column prop="signature" :show-overflow-tooltip="true" label="个性签名" width="200"></el-table-column>

        <el-table-column prop="copyright_time" label="版权时间" width="200"></el-table-column>

        <el-table-column prop="version_number" label="版本号" width="200"></el-table-column>

        <el-table-column prop="icp_number" label="ICP 备案号" min-width="150"></el-table-column>

        <el-table-column fixed="right" width="200" label="操作">
          <template slot-scope="scope">
            <el-button @click.prevent="handleEdit(scope.row)" type="primary" plain size="mini">编辑</el-button>

            <el-button
              @click.prevent="handleDelete(scope.row)"
              type="danger"
              plain
              size="mini"
              v-permission="{ permission: '删除站点信息', type: 'disabled' }"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--  更新站点信息页面  -->
    <web-site-info-edit
      v-else
      :webSiteInfoId="webSiteInfoId"
      @editClose="editClose"
    ></web-site-info-edit>
  </div>
</template>

<script>
import WebSiteInfo from '@/model/web-site-info'
import WebSiteInfoEdit from './web-site-info-edit'

export default {
  components: {
    WebSiteInfoEdit,
  },
  data() {
    return {
      loading: false, // 是否显示加载数据动画
      tableData: [],
      showEdit: false, // 是否显示更新站点信息页面
      webSiteInfoId: 0,
    }
  },
  async created() {
    this.loading = true
    this.getWebSiteInfoList()
    this.loading = false
  },
  methods: {
    // 获取站点信息列表
    async getWebSiteInfoList() {
      const webSiteInfoList = await WebSiteInfo.getAllWebSiteInfoList()
      this.tableData = webSiteInfoList
    },
    // 监听更新站点信息
    handleEdit(val) {
      this.webSiteInfoId = val.id
      this.showEdit = true
    },
    // 监听删除站点信息
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该站点信息, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await WebSiteInfo.deleteWebSiteInfoById(val.id)
        } catch (e) {
          this.loading = false
        }
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.loading = false
          this.getWebSiteInfoList()
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
    // 监听更新站点信息页面关闭
    editClose() {
      this.showEdit = false
      this.loading = true
      this.getWebSiteInfoList()
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
}
</style>
