<template>
  <div>
    <el-row v-if="yao.yi == 1">
      <el-card shadow="always" v-bind:style="classObject"></el-card>
    </el-row>
    <el-row v-else :gutter="10">
      <el-col :span="12"
        ><el-card shadow="always" v-bind:style="classObject"></el-card
      ></el-col>
      <el-col :span="12"
        ><el-card shadow="always" v-bind:style="classObject"></el-card
      ></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    yao: Object,
  },
  mounted() {},
  computed: {
    classObject() {
      console.log('conputed class', this.yao.change);
      if (this.yao.change) {
        return {
          'background-color': '#d0b2b2',
        };
      }
      return {};
    },
  },
  updated() {},
};
</script>
