<template xmlns:el-form-item="http://www.w3.org/1999/html">
  <div class="app-main">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix" style="text-align: center">
        <span style="font-size: 18px;font-weight: 600">交易详情</span>
      </div>
      <el-form ref="form" :model="form" label-width="120px" label-position="left">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="交易流水:">
              <span>{{ form.tradeNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="院内流水:">
              <span>{{ form.outTradeNo }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态:">
              <span>{{ form.stateLabel }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="医院名称:">
              <span>{{ form.hospitalName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="渠道代码:">
              <span>{{ form.channelCode }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付类型:">
              <span>{{ form.payType === '1' ? '微信': '支付宝' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="渠道交易ID:">
              <span>{{ form.transactionId }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间:">
              <span>{{ form.receiveTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="客户端编号:">
              <span>{{ form.clientId }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="姓名:">
              <span>{{ form.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证:">
              <span>{{ form.idCard }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号:">
              <span>{{ form.phone }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="交易说明:">
              <span>{{ form.transIntroduce }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交易详情:">
              <span>{{ form.transDetail }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收费项:">
              <span>{{ form.subject }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="总金额:">
              <span>{{ form.totalAmount }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实收金额:">
              <span>{{ form.receiptAmount }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付金额:">
              <span>{{ form.payAmount }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="退费金额:">
              <span>{{ form.refundAmount }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退费时间:">
              <span>{{ form.refundTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退费说明:">
              <span>{{ form.refundDesc }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="交易开始时间:">
              <span>{{ form.timeStartLabel }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交易结束时间:">
              <span>{{ form.timeEndLabel }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付方式:">
              <span>{{ form.tradeType }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getTradeDetail } from '@/api/trade'

export default {
  name: 'TradeDetialDialog',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getTradeDetail(this.id).then(res => {
        this.form = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
