<template>
  <div class="app-main">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <el-autocomplete
          v-model="form.hospitalName"
          class="inline-input"
          style="width: 200px;"
          clearable
          :fetch-suggestions="handleLoadHosNames"
          placeholder="请输入医院名称"
          :trigger-on-focus="false"
        />
        <el-autocomplete
          v-model="form.channelCode"
          class="inline-input"
          style="width: 200px;"
          clearable
          :fetch-suggestions="handleLoadChannelCodes"
          placeholder="请输入渠道代码"
          :trigger-on-focus="false"
        />
        <el-select
          v-model="form.payType"
          style="width: 200px;"
          filterable
          clearable
          placeholder="请选择支付类型"
        >
          <el-option
            v-for="item in payTypes"
            :key="item.payType"
            :label="item.payName"
            :value="item.payType"
          />
        </el-select>
        <el-select
          v-model="form.active"
          style="width: 200px;"
          filterable
          clearable
          placeholder="请选择状态"
        >
          <el-option
            v-for="item in [{ value: 'true',label: '正常' },{ value: 'false',label: '停用' }]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
        :data="channelConfigs"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="#" />
        <el-table-column
          prop="channelCode"
          label="渠道编码"
          width="200"
        />
        <el-table-column
          prop="hospitalName"
          label="医院名称"
          width="200"
        />
        <el-table-column
          prop="appId"
          label="应用ID"
          width="200"
        />
        <el-table-column
          prop="payType"
          label="支付类型"
          width="200"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.payType === '1' ? '微信':'支付宝' }}</span>
          </template>
        </el-table-column>
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
                <el-button icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.active" icon="el-icon-edit" @click="handleStop(scope.row)">停用</el-button>
                <el-button v-else icon="el-icon-edit" @click="handleStart(scope.row)">启用</el-button>
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
    <channel-opt-dialog ref="chnnelOptDialog" :title="channelOptTitle" @handleCompleted="getList" />
  </div>
</template>

<script>
import _ from 'lodash'
import SPagination from '@/components/SPagination/index'
import { getChannelCodes, getChannelConfigs, release, unreleased } from '@/api/channelConfig'
import ChannelOptDialog from '@/views/config/channelOptDialog'
import { getHosNames } from '@/api/hospital'

export default {
  name: 'ChannelList',
  components: { ChannelOptDialog, SPagination },
  data() {
    return {
      optDialogVisible: false,
      channelOptTitle: '',
      listLoading: false,
      channelConfigs: [],
      payTypes: [{ payType: '1', payName: '微信支付' }, { payType: '2', payName: '支付宝' }],
      form: {
        channelCode: '',
        payType: '',
        active: '',
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
      getChannelConfigs(params).then(res => {
        this.channelConfigs = res.data
        this.listQuery.columns = Number(res.columns)
        this.listLoading = false
      })
    },
    handleSearch() {
      this.listQuery.current = 1
      this.getList()
    },
    handleLoadHosNames(val, callback) {
      if (val && val.length >= 2) {
        getHosNames(val).then(res => {
          const array = []
          if (!_.isEmpty(res.data)) {
            for (const u of res.data) {
              array.push({ 'value': u })
            }
          }
          callback(array)
        })
      } else {
        callback([])
      }
    },
    handleLoadChannelCodes(val, callback) {
      if (val && val.length >= 2) {
        getChannelCodes(val).then(res => {
          const array = []
          if (!_.isEmpty(res.data)) {
            for (const u of res.data) {
              array.push({ 'value': u })
            }
          }
          callback(array)
        })
      } else {
        callback([])
      }
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
      this.channelOptTitle = '添加支付渠道信息'
      this.$refs.chnnelOptDialog.show()
    },
    handleEdit({ id }) {
      this.channelOptTitle = '修改支付渠道信息'
      this.$refs.chnnelOptDialog.show(id)
    },
    handleStop(row) {
      this.$confirm('停用支付渠道, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { channelCode } = row
        unreleased(channelCode).then(res => {
          row.active = res.data.active
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handleStart(row) {
      this.$confirm('启用支付渠道, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { channelCode } = row
        release(channelCode).then(res => {
          row.active = res.data.active
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
