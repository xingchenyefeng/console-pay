<template>
  <div class="app-container" />
</template>
<script>
import _ from 'lodash'

export default {

  data() {
    return {
      errorCode: '',
      state: '',
      avatar: '',
      name: '',
      userId: ''
    }
  },

  created() {
    this.errorCode = this.$route.query.errorCode
    this.token = this.$route.query.token
    this.avatar = this.$route.query.avatar
    this.name = this.$route.query.name
    this.userId = this.$route.query.userId
    const params = {
      errorCode: this.errorCode,
      token: this.token,
      avatar: this.avatar,
      name: this.name,
      userId: this.userId
    }
    console.log(JSON.stringify(params))
    if (!_.isEmpty(this.errorCode) && !_.isEmpty(this.token)) {
      this.$store.dispatch('user/loginCallback', params).then((res) => {
        console.log(`登入成功， 准备跳转到dashboard`)
        this.loading = false
        this.$router.push({ path: this.redirect || '/' })
      }).catch(() => {
        this.loading = false
        this.$router.push({ path: this.redirect || '/405' })
      })
    } else {
      this.$router.push({ path: this.redirect || '/404' })
    }
  }
}
</script>
