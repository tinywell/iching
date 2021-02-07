<template>
  <el-main>
    <div>
      <el-row>
        <el-col :span="12" :offset="6"
          ><el-input placeholder="请输入问题"></el-input
        ></el-col>
      </el-row>
      <el-row style="margin: 5px">
        <el-button type="danger" round @click="submit">开始</el-button>
      </el-row>
    </div>
    <div style="display: flex; justify-content: center">
      <div style="width: 500px">
        <el-row v-if="show"><BaGua :Gua="gua" /> </el-row>
      </div>
    </div>
    <div>
      <el-row>
        <el-col :span="12" :offset="6">
          <el-row style="text-align: left">
            <span style="width: 100px; font-size: xxx-large">{{
              this.name
            }}</span>
            <span>{{ this.ci }}</span>
          </el-row>
          <el-row style="text-align: left">
            {{ this.tuan }}
          </el-row>
        </el-col></el-row
      >
    </div>
  </el-main>
</template>

<script>
import BaGua from './BaGua.vue';
import GuaCi from '../assets/guaci.json';

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
        wu: { yi: true, change: false },
        si: { yi: true, change: false },
        san: { yi: true, change: false },
        er: { yi: false, change: false },
        chu: { yi: true, change: false },
        id: '111101',
      },
      show: false,
      name: '',
      ci: '',
      tuan: '',
    };
  },
  methods: {
    submit() {
      let ServerAddrPre = '/api'; // eslint-disable-line no-unused-vars
      if (process.env.NODE_ENV === 'development') {
        ServerAddrPre = 'http://localhost:8080/api';
      }
      const post = `${ServerAddrPre}/bugua`;
      this.$axios
        .get(post)
        .then((rsp) => {
          // if (rsp.data.code === 200) {
          this.handleData(rsp);
          // } else {
          //   this.$message({
          //     message: `请求数据出错：${rsp.data.msg}`,
          //     type: 'warnning',
          //   });
          // }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    handleData(data) {
      console.log('解析：', data);
      this.gua = data.data;
      const dataci = GuaCi[this.gua.id];
      this.ci = dataci.guaci;
      this.name = dataci.name;
      this.tuan = dataci.tuan;
      this.show = true;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
