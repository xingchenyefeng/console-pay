<template>
  <div class="app-main">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <el-input v-model="form.name" placeholder="请输入医院名称" style="width: 200px;" clearable />
        <el-date-picker
          v-model="form.createdStartAt"
          type="datetime"
          placeholder="注册起始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
        -
        <el-date-picker
          v-model="form.createdEndAt"
          type="datetime"
          placeholder="注册截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
        />
        <el-button style="margin-left: 40px;" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button icon="el-icon-close" plain type="info" @click="handleReset">重置</el-button>
        <el-button icon="el-icon-plus" style="margin-left: 50px;" plain @click="handleAdd">添加</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="hospitals"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="#" />
        <el-table-column
          prop="hospitalCode"
          label="医院编码"
          width="200"
        />
        <el-table-column
          prop="hospitalName"
          label="医院名称"
          width="200"
        />
        <el-table-column
          prop="contactName"
          label="联系人"
          width="200"
        />
        <el-table-column
          prop="contactPhone"
          label="联系人电话"
          width="200"
        />
        <el-table-column
          prop="active"
          label="状态"
          width="200"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.active" size="small" type="success">正常</el-tag>
            <el-tag v-else size="small" type="danger">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdAt"
          width="200"
          label="注册时间"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <template>
              <div>
                <el-button icon="el-icon-medal" @click="handleEdit(scope.row)">编辑</el-button>
              </div>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <s-pagination
        :total="listQuery.columns"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.pagesize"
        style="text-align: center"
        @pagination="getList"
      />
    </el-card>
    <hos-opt-dialog ref="hosOptDialog" :title="hosOptTitle" @handleCompleted="getList" />
  </div>
</template>

<script>
import _ from 'lodash'
import SPagination from '@/components/SPagination/index'
import { getHospitals } from '@/api/hospital'
import HosOptDialog from '@/views/config/hosOptDialog'

export default {
  name: 'HospitalList',
  components: { HosOptDialog, SPagination },
  data() {
    return {
      optDialogVisible: false,
      hosOptTitle: '',
      listLoading: false,
      hospitals: [],
      form: {
        hospitalName: '',
        createdStartAt: '',
        createdEndAt: ''
      },
      listQuery: {
        current: 1,
        pagesize: 20,
        columns: 0
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      const params = _.clone(this.form)
      params.current = this.listQuery.current
      params.pagesize = this.listQuery.pagesize
      getHospitals(params).then(res => {
        this.hospitals = res.data
        this.listQuery.columns = Number(res.columns)
        this.listLoading = false
      })
    },
    handleSearch() {
      this.listQuery.current = 1
      this.getList()
    },
    handleReset() {
      this.listQuery.current = 1
      this.form = {
        hospitalName: '',
        createdStartAt: '',
        createdEndAt: ''
      }
      this.getList()
    },
    handleAdd() {
      this.hosOptTitle = '添加医院信息'
      this.$refs.hosOptDialog.show()
    },
    handleEdit({ id }) {
      this.hosOptTitle = '修改医院信息'
      this.$refs.hosOptDialog.show(id)
    }
  }
}
</script>

<style scoped>

</style>
