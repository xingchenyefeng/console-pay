<template>
  <div class="app-main">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-card class="box-card" shadow="never">
        <el-form ref="form" :model="form" :rules="rules" label-width="140px" label-position="left">
          <el-form-item label="支付类型:">
            <el-select v-model="form.payType" placeholder="请选择支付类型">
              <el-option
                v-for="item in [{ payType: '1', payName: '微信支付' }, { payType: '2', payName: '支付宝' }]"
                :key="item.payType"
                :label="item.payName"
                :value="item.payType"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="channelId" label="渠道ID:">
            <el-input v-model="form.id" style="width: 220px;" readonly/>
          </el-form-item>
          <el-form-item label="渠道编码:">
            <el-input v-model="form.channelCode" style="width: 220px;" clearable />
          </el-form-item>
          <el-form-item label="接入医院:">
            <el-select
              v-model="form.hospitalCode"
              filterable
              remote
              :remote-method="loadHospitals"
              :loading="loading"
              placeholder="请选择接入医院"
            >
              <el-option
                v-for="item in hospitals"
                :key="item.hospitalCode"
                :label="item.hospitalName"
                :value="item.hospitalCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="应用ID:">
            <el-input v-model="form.appId" style="width: 220px;" clearable/>
          </el-form-item>
          <el-form-item label="商户ID:">
            <el-input v-model="form.sellerId"/>
          </el-form-item>
          <el-form-item v-if="form.payType === '1'" label="应用秘钥:">
            <el-input v-model="form.appKey" type="textarea"/>
          </el-form-item>
          <el-form-item v-if="form.payType === '2'" label="商户私钥:">
            <el-input v-model="form.ownerPrivateKey" type="textarea"/>
          </el-form-item>
          <el-form-item v-if="form.payType === '2'" label="商户公钥:">
            <el-input v-model="form.ownerPublicKey" type="textarea"/>
          </el-form-item>
          <el-form-item v-if="form.payType === '2'" label="支付宝公钥:">
            <el-input v-model="form.alipayPublicKey" type="textarea"/>
          </el-form-item>
          <el-form-item label="回调地址:">
            <el-input v-model="form.notifyUrl" type="textarea"/>
          </el-form-item>
          <el-form-item v-if="form.payType === '2'" label="允许支付的方式">
            <el-select v-model="form.enablePayChannels" multiple placeholder="请选择允许支付的方式">
              <el-option
                v-for="item in payChannels"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.payType === '1'" label="限制支付方式:">
            <el-select v-model="form.enablePayChannels" multiple placeholder="请选择允许支付的方式">
              <el-option
                v-for="item in payChannels"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.payType === '1'" label="证书:">
            <el-upload
              style="display: inline"
              :headers="$getFileUploadHeaders()"
              :action="$fileUploadUrl"
              :show-file-list="true"
              :limit="1"
              :before-upload="beforeUpload"
              :on-success="handleUpload"
            >
              <el-button v-if="(certId && certId!=='0')" size="mini" icon="el-icon-upload">重传</el-button>
              <el-button v-else size="mini" icon="el-icon-upload">上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="证书/秘钥到期时间:">
            <el-date-picker
              v-model="form.certExpire"
              type="datetime"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { getAlipayChannels, getChannelConfigById, saveChannelConfig } from '@/api/channelConfig'
import { getHospitals } from '@/api/hospital'

export default {
  name: 'ChannelOptDialog',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      channelId: '',
      certId: '',
      hospitals: [],
      payChannels: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      form: {
        id: '',
        channelCode: '',
        hospitalCode: '',
        appId: '',
        payType: '',
        appKey: '',
        sellerId: '',
        ownerPrivateKey: '',
        alipayPublicKey: '',
        ownerPublicKey: '',
        notifyUrl: '',
        enablePayChannels: '',
        sysServiceProviderId: '',
        certId: '',
        certExpire: ''
      },
      rules: {
        hospitalCode: { required: true, message: '请输入医院代码', trigger: 'blur' },
        hospitalName: { required: true, message: '请输入医院名称', trigger: 'blur' }
      }
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.form = {
          id: '',
          channelCode: '',
          hospitalCode: '',
          appId: '',
          payType: '',
          appKey: '',
          sellerId: '',
          ownerPrivateKey: '',
          alipayPublicKey: '',
          ownerPublicKey: '',
          notifyUrl: '',
          enablePayChannels: '',
          sysServiceProviderId: '',
          certId: '',
          certExpire: ''
        }
      }
    },
    'form.payType'(val) {
      if (val === '1') {
        this.payChannels = [{ value: 'no_credit', label: '限制信用卡支付' }]
      } else {
        this.loadAlipayChannels()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      getHospitals().then(res => {
        this.hospitals = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    initData() {
      if (!_.isEmpty(this.channelId)) {
        getChannelConfigById(this.channelId).then(res => {
          const { data } = res
          const enablePayChannels = _.split(data.enablePayChannels, ',')
          this.form = data
          this.form.enablePayChannels = enablePayChannels
        })
      }
    },
    handleCancel() {
      this.dialogVisible = false
    },
    handleSave() {
      const { id, channelCode, hospitalCode, appId, payType, appKey, sellerId, ownerPrivateKey, alipayPublicKey, ownerPublicKey, notifyUrl, enablePayChannels, sysServiceProviderId, certExpire } = this.form
      debugger
      const params = {
        id,
        channelCode,
        hospitalCode,
        appId,
        payType,
        appKey,
        sellerId,
        ownerPrivateKey,
        alipayPublicKey,
        ownerPublicKey,
        notifyUrl,
        enablePayChannels: enablePayChannels.join(','),
        sysServiceProviderId,
        certId: this.certId,
        certExpire
      }
      saveChannelConfig(params).then(res => {
        this.dialogVisible = false
        this.$emit('handleCompleted')
      })
    },
    show(channelId) {
      this.dialogVisible = true
      this.channelId = channelId
      this.initData()
    },
    loadHospitals(val) {
      if (!_.isEmpty(val) && val.length >= 2) {
        getHospitals({ hospitalName: val }).then(res => {
          this.hospitals = res.data
        })
      }
    },
    loadAlipayChannels() {
      getAlipayChannels().then(res => {
        this.payChannels = res.data
      })
    },
    handleRowBeforeUpload(row) {
      this.currentRow = row
    },
    beforeUpload(file) {
      this.listLoading = true
      const types = ['application/x-pkcs12']
      const isCert = types.includes(file.type)
      if (!isCert) {
        this.$message.error('上传文件只能是 .p12 格式!')
      }
      const res = isCert
      if (!res) {
        this.listLoading = false
      }
      return res
    },
    handleUpload(response, file, fileList) {
      this.certId = response.data.certId
      debugger
    }
  }
}
</script>

<style scoped>

</style>
