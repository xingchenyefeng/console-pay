<template>
  <div class="app-main">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-card class="box-card" shadow="never">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
          <el-form-item v-if="hosId" label="ID" prop="hospitalName">
            <el-input v-model="form.id" style="width: 220px;" readonly/>
          </el-form-item>
          <el-form-item label="医院名称" prop="hospitalName">
            <el-input v-model="form.hospitalName" style="width: 220px;" clearable/>
          </el-form-item>
          <el-form-item label="医院代码" prop="hospitalCode">
            <el-input v-model="form.hospitalCode" style="width: 220px;" clearable/>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="form.contactName" style="width: 220px;" clearable/>
          </el-form-item>
          <el-form-item label="联系人电话">
            <el-input v-model="form.contactPhone" style="width: 220px;" clearable/>
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
import { getHosInfoById, saveHospitalConfig } from '@/api/hospital'

export default {
  name: 'HosOptDialog',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      hosId: '',
      form: {
        id: '',
        hospitalCode: '',
        hospitalName: '',
        contactName: '',
        contactPhone: ''
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
          hospitalCode: '',
          hospitalName: '',
          contactName: '',
          contactPhone: ''
        }
      }
    }
  },
  methods: {
    handleCancel() {
      this.dialogVisible = false
    },
    handleSave() {
      const { id, hospitalCode, hospitalName, contactName, contactPhone } = this.form
      const params = {
        id, hospitalCode, hospitalName, contactName, contactPhone
      }
      params.id = this.hosId
      saveHospitalConfig(params).then(res => {
        this.dialogVisible = false
        this.$emit('handleCompleted')
      })
    },
    show(hosId) {
      this.dialogVisible = true
      this.hosId = hosId
      if (!_.isEmpty(this.hosId)) {
        getHosInfoById(this.hosId).then(res => {
          const { data } = res
          this.form = data
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
