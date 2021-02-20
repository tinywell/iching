<template>
  <el-main>
    <div>
      <el-row>
        <el-col :span="12" :offset="6"><label>默念所卜事项</label></el-col>
      </el-row>
      <el-row style="margin: 5px">
        <el-button type="danger" circle @click="submit">卜</el-button>
        <!-- <img
          src="../assets/taiji.png"
          style="height: 30px; width: 30px"
          @click="submit"
        /> -->
      </el-row>
    </div>
    <div style="display: flex; justify-content: center">
      <div style="width: 500px">
        <el-row v-if="show"><BaGua :Gua="gua" :YaoCi="yaoci" /> </el-row>
        <el-row v-if="show"
          ><el-tag type="info"><i class="el-icon-info"></i>{{ tip }}</el-tag>
        </el-row>
      </div>
    </div>
    <div>
      <el-row v-if="show">
        <el-col :span="12" :offset="6">
          <el-row style="text-align: left">
            <span style="width: 100px; font-size: xxx-large"
              >{{ this.name }}{{ this.fu }}</span
            >
            <span>{{ this.ci }}</span>
          </el-row>
          <el-row style="text-align: left"> 彖：{{ this.tuan }} </el-row>
        </el-col></el-row
      >
    </div>
  </el-main>
</template>

<script>
import BaGua from './BaGua.vue';
import GuaCi from '../assets/guaci.json';
import * as iching from '../pkg/iching';

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  components: {
    BaGua,
  },
  data() {
    return {
      gua: {
        shang: { yi: true, change: false },
        wu: { yi: false, change: false },
        si: { yi: true, change: false },
        san: { yi: false, change: false },
        er: { yi: false, change: false },
        chu: { yi: false, change: false },
        id: '101000',
      },
      show: false,
      name: '',
      ci: '',
      tuan: '',
      fu: '',
      yaoci: [],
      tips: [
        '六爻安定的，以本卦卦辞断之。',
        '一爻动，以动爻之爻辞断之。',
        '两爻动者，则取阴爻之爻辞以为断，盖以“阳主过去，阴主未来”故也。所动的两爻如果同是阳爻或阴爻，则取上动之爻断之。',
        '三爻动者，以所动三爻的中间一爻之爻辞为断。',
        '四爻动者，以下静之爻辞断之。',
        '五爻动者，取静爻的爻辞断之。',
        '六爻皆动的卦，如果是乾坤二卦，「用」辞断。乾坤两卦外其余各卦，如果是六爻皆动，则以变卦的彖辞断之。',
      ],
      tip: '',
    };
  },
  methods: {
    submit() {
      // let ServerAddrPre = '/api'; // eslint-disable-line no-unused-vars
      // if (process.env.NODE_ENV === 'development') {
      //   ServerAddrPre = 'http://localhost:8080/api';
      // }
      // const post = `${ServerAddrPre}/bugua`;
      // this.$axios
      //   .get(post)
      //   .then((rsp) => {
      //     // if (rsp.data.code === 200) {
      //     this.handleData(rsp.data);
      //   })
      //   .catch((err) => {
      //     this.$message.error(err.message);
      //   });
      const gua = iching.Gua();
      this.handleData(gua);
    },
    handleData(data) {
      console.log('解析：', data);
      this.gua = data;
      const dataci = GuaCi[this.gua.id];
      this.ci = dataci.guaci;
      this.name = dataci.name;
      this.tuan = dataci.tuan;
      this.yaoci = dataci.yaoci;
      this.fu = dataci.fu;
      const yaos = [data.chu, data.er, data.san, data.si, data.wu, data.shang];
      let bian = 0;
      yaos.forEach((value) => {
        if (value.change) {
          bian += 1;
        }
      });
      this.tip = this.tips[bian];
      this.show = true;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button_qigua {
  background-image: "../assets/taiji.png";
}
</style>
