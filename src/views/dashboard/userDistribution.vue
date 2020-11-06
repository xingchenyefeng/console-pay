<template>
  <div>
    <h3 class="title">{{ msg }}</h3>
    <div class="amap-wrapper">
      <el-amap class="amap-box" :vid="'amap-vue'"></el-amap>
    </div>
  </div>
</template>

<script>
/* 基础地图 */
export default {
  name: 'UserDistribution',
  data() {
    return {
      msg: '基础地图~'
    }
  }
}
</script>

<style scoped>
  .amap-wrapper {
    width: 500px;
    height: 500px;
  }
</style>
