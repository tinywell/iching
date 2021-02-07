<template>
  <div>
    <div>
      <el-row><Yao :yao="Gua.shang" /> </el-row>
      <el-row><Yao :yao="Gua.wu" /> </el-row>
      <el-row><Yao :yao="Gua.si" /> </el-row>
      <el-row><Yao :yao="Gua.san" /> </el-row>
      <el-row><Yao :yao="Gua.er" /> </el-row>
      <el-row><Yao :yao="Gua.chu" /> </el-row>
    </div>
  </div>
</template>

<script>
import Yao from './Yao.vue';
import GuaCi from '../assets/guaci.json';

export default {
  props: {
    guaID: String,
    Gua: Object,
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
    };
  },
  mounted() {
    console.log(this.Gua);
    const dataci = GuaCi[this.Gua.id];
    console.log(dataci);
    this.ci = dataci.guaci;
    this.name = dataci.name;
  },
  methods: {},
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
