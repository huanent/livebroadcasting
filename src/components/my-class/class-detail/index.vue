<template>
  <div class="classlist-page">
    <div class="classlist">
      <el-row type="flex"
        ><el-col :span="24">
          <div class="detail-image">
            <img :src="classList.classImg" alt="" />
          </div> </el-col
      ></el-row>
      <el-row type="flex"
        ><el-col :span="24" class="filed">
          <label>课堂标题：</label><span>{{ classList.title }}</span>
        </el-col></el-row
      >
      <el-row type="flex"
        ><el-col :span="24" class="filed">
          <label>开始时间：</label><span>{{ classList.startTime }}</span>
        </el-col></el-row
      >
      <el-row type="flex"
        ><el-col :span="24" class="filed">
          <label>结束时间：</label><span>{{ classList.endTime }}</span>
        </el-col></el-row
      >
      <el-row type="flex"
        ><el-col :span="24" class="filed">
          <label>创建日期：</label><span>{{ classList.createDate }}</span>
        </el-col></el-row
      >
      <el-row type="flex"
        ><el-col :span="24" class="filed">
          <label>课堂描述：</label><span>{{ classList.description }}</span>
        </el-col></el-row
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "ClassDetail",
  data() {
    return {
      classList: ""
    };
  },
  created() {
    console.log(this.$route.params.classId);
    this.dataInit();
  },
  methods: {
    dataInit() {
      this.axios
        .get("/classform/list?classId=" + this.$route.params.classId)
        .then(res => {
          if (res.data.success) {
            this.classList = res.data.data[0];
            this.classList.classImg =
              "http://livebroadcasting.jinrui.kooboo.site/__kb/kfile/" +
              this.classList.classImg;
            this.classList.startTime = new Date(
              parseInt(this.classList.startTime)
            ).toLocaleString();
            this.classList.endTime = new Date(
              parseInt(this.classList.endTime)
            ).toLocaleString();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.classlist-page {
  width: 100%;
  .classlist {
    width: 100%;
    @media screen and (max-width: 767px) {
      width: 80%;
      max-width: 450px;
    }
  }
}
.detail-image {
  margin: 2rem;
  img {
    height: 200px;
  }
}
.filed {
  margin: 0 2rem 2rem 2rem;
  font-size: 1.5rem;
}
</style>
