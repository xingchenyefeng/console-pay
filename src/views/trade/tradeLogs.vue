<template>
  <div class="app-main">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <el-autocomplete
          v-model="form.tradeNo"
          class="inline-input"
          style="width: 150px;"
          clearable
          :fetch-suggestions="handleLoadTradeNos"
          placeholder="请输入交易流水"
          :trigger-on-focus="false"
        />
        <el-autocomplete
          v-model="form.outTradeNo"
          class="inline-input"
          style="width: 150px;"
          clearable
          :fetch-suggestions="handleLoadOutTradeNo"
          placeholder="请输入院内流水"
          :trigger-on-focus="false"
        />
        <el-select
          v-model="form.hospitalCode"
          style="width: 150px;"
          filterable
          clearable
          placeholder="请选择医院"
        >
          <el-option
            v-for="item in hospitals"
            :key="item.hospitalCode"
            :label="item.hospitalName"
            :value="item.hospitalCode"
          />
        </el-select>
        <el-autocomplete
          v-model="form.channelCode"
          class="inline-input"
          style="width: 120px;"
          clearable
          :fetch-suggestions="handleLoadChannelCodes"
          placeholder="请输入渠道代码"
          :trigger-on-focus="false"
        />
        <el-select
          v-model="form.payType"
          style="width: 130px;"
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
        <el-input v-model="form.phone" style="width: 130px;" placeholder="手机号" clearable />
        <el-input v-model="form.name" style="width: 100px;" placeholder="姓名" clearable />
        <el-select
          v-model="form.state"
          style="width: 110px;"
          filterable
          clearable
          placeholder="请选择状态"
        >
          <el-option
            v-for="item in tradeStates"
            :key="item.state"
            :label="item.label"
            :value="item.state"
          />
        </el-select>
        <el-date-picker
          v-model="form.createdStartAt"
          type="datetime"
          style="width: 175px;"
          placeholder="付款起始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
        -
        <el-date-picker
          v-model="form.createdEndAt"
          type="datetime"
          style="width: 175px;"
          placeholder="付款截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
        />
        <el-button style="margin-left: 20px;" icon="el-icon-search" @click="handleSearch">详情</el-button>
        <el-button icon="el-icon-close" plain type="info" @click="handleReset">重置</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="logs"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="#" />
        <el-table-column
          prop="tradeNo"
          label="交易流水"
        />
        <el-table-column
          prop="outTradeNo"
          width="100px"
          label="院内单号"
        />
        <el-table-column
          prop="outTradeNo"
          width="100px"
          label="院内单号"
        />
        <el-table-column
          prop="channelCode"
          width="80px"
          label="渠道编码"
        />
        <el-table-column
          prop="payType"
          width="80px"
          label="支付类型"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.payType === '1'">微信</span>
            <span v-else>支付宝</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="hospitalName"
          label="医院名称"
          width="100px"
        />
        <el-table-column
          prop="phone"
          label="电话"
          width="100px"
        />
        <el-table-column
          prop="name"
          label="姓名"
          width="60px"
        />
        <el-table-column
          prop="idCard"
          label="证件号"
          width="85px"
        />
        <el-table-column
          prop="bsType"
          label="业务类型"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.bsType === '1'">挂号</span>
            <span v-else-if="scope.row.bsType === '2'">诊间结算</span>
            <span v-else-if="scope.row.bsType === '3'">住院预交金</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="receiveTime"
          width="92px"
          label="创建时间"
        />
        <el-table-column
          prop="payAmount"
          label="应付金额"
        />
        <el-table-column
          prop="receiptAmount"
          label="实付金额"
        />
        <el-table-column
          prop="refundAmount"
          label="退款金额"
        />
        <el-table-column
          prop="refundTime"
          width="92px"
          label="退款时间"
        />
        <el-table-column
          prop="stateLabel"
          label="状态"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <template>
              <div>
                <el-button icon="el-icon-edit" @click="handleFetch(scope.row)">查询</el-button>
              </div>
              <div>
                <el-button icon="el-icon-edit" style="margin-top: 5px;" @click="handleRefund(scope.row)">退费</el-button>
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
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <trade-detial-dialog :id="currentId" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import SPagination from '@/components/SPagination/index'
import { getTradeRecords, getTradeStates, refund } from '@/api/trade'
import TradeDetialDialog from '@/views/trade/tradeDetialDialog'

export default {
  name: 'TradeLogs',
  components: { TradeDetialDialog, SPagination },
  data() {
    return {
      dialogVisible: false,
      listLoading: false,
      currentId: '',
      form: {
        tradeNo: '',
        outTradeNo: '',
        hospitalCode: '',
        channelCode: '',
        payType: '',
        state: '',
        createdStartAt: '',
        createdEndAt: ''
      },
      logs: [],
      hospitals: [],
      tradeStates: [],
      payTypes: [],
      listQuery: {
        current: 1,
        pagesize: 20,
        columns: 0
      }
    }
  },
  watch: {
    dialogVisible(val) {
      this.getList()
    }
  },
  created() {
    this.getList()
    this.init()
  },
  methods: {
    init() {
      getTradeStates().then(res => {
        this.tradeStates = res.data
      })
    },
    getList() {
      this.listLoading = true
      const params = _.clone(this.form)
      getTradeRecords(params).then(res => {
        this.logs = res.data
        this.listQuery.columns = Number(res.columns)
        this.listLoading = false
      })
    },
    handleLoadTradeNos() {
    },
    handleLoadOutTradeNo() {
    },
    handleLoadChannelCodes() {
    },
    handleSearch() {
      this.listQuery.current = 1
      this.getList()
    },
    handleReset() {
      this.form = {
        tradeNo: '',
        outTradeNo: '',
        hospitalCode: '',
        channelCode: '',
        payType: '',
        state: '',
        createdStartAt: '',
        createdEndAt: ''
      }
      this.listQuery.current = 1
      this.getList()
    },
    handleAdd() {
    },
    handleFetch(row) {
      this.dialogVisible = true
      this.currentId = row.id
    },
    handleRefund(row) {
      this.$confirm('此操作会将费用退回, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        refund(row.id).then(res => {
          this.getList()
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
