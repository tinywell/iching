<template>
  <div>
    <div>
      <el-row
        ><el-tooltip
          class="item"
          effect="dark"
          :content="YaoCi[5]"
          placement="right"
          ><Yao :yao="Gua.shang"
        /></el-tooltip>
      </el-row>
      <el-row
        ><el-tooltip
          class="item"
          effect="dark"
          :content="YaoCi[4]"
          placement="right"
          ><Yao :yao="Gua.wu" /></el-tooltip
      ></el-row>
      <el-row
        ><el-tooltip
          class="item"
          effect="dark"
          :content="YaoCi[3]"
          placement="right"
          ><Yao :yao="Gua.si" /></el-tooltip
      ></el-row>
      <el-row
        ><el-tooltip
          class="item"
          effect="dark"
          :content="YaoCi[2]"
          placement="right"
          ><Yao :yao="Gua.san" /></el-tooltip
      ></el-row>
      <el-row
        ><el-tooltip
          class="item"
          effect="dark"
          :content="YaoCi[1]"
          placement="right"
          ><Yao :yao="Gua.er" /></el-tooltip
      ></el-row>
      <el-row
        ><el-tooltip
          class="item"
          effect="dark"
          :content="YaoCi[0]"
          placement="right"
          ><Yao :yao="Gua.chu" /></el-tooltip
      ></el-row>
    </div>
  </div>
</template>

<script>
import Yao from './Yao.vue';
// import GuaCi from '../assets/guaci.json';

export default {
  props: {
    guaID: String,
    Gua: Object,
    YaoCi: Array,
  },
  components: {
    Yao,
  },
  data() {
    return {
      yin: {
        yi: false,
        change: false,
      },
      yang: {
        yi: true,
        change: false,
      },
      ci: '',
      yaoci: [],
    };
  },
  mounted() {
    console.log('BaGua:', this.Gua);
    // const dataci = GuaCi[this.Gua.id];
    // console.log(dataci);
    // this.ci = dataci.guaci;
    // this.name = dataci.name;
    // this.yaoci = dataci.yaoci;
  },
  methods: {},
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.yao-ci {
  text-align: left;
}
</style>
