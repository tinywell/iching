<template>
  <div>
    <el-row v-if="yao.yi == 1">
      <el-card shadow="always"></el-card>
    </el-row>
    <el-row v-else :gutter="10">
      <el-col :span="12"><el-card shadow="always"></el-card></el-col>
      <el-col :span="12"><el-card shadow="always"></el-card></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    yao: Object,
  },
};
</script>
