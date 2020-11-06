<template>
  <div>
    <el-table v-loading="listLoading" :data="rankingList" element-loading-text="Loading">
      <el-table-column label="排名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ItemTaggingRanking',
  data() {
    return {
      rankingList: []
    }
  },
  created() {
  },
  methods: {}
}
</script>

<style scoped>

</style>
