<template>
  <div class="main-area">
    <div class="classlist">
      <el-row type="flex">
        <div class="detail-image">
          <img :src="classList.classImg" alt="" />
        </div>
        <div class="detail-content">
          <div>
            <label>课堂标题：</label><span>{{ classList.title }}</span>
          </div>
          <div>
            <label>开始时间：</label><span>{{ classList.startTime }}</span>
          </div>
          <div>
            <label>结束时间：</label><span>{{ classList.endTime }}</span>
          </div>

          <div>
            <label>创建日期：</label><span>{{ classList.createDate }}</span>
          </div>
        </div>
      </el-row>
      <div class="class-desc">
        <label>课堂描述：</label><span>{{ classList.description }}</span>
      </div>
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
            console.log(this.classList);
            this.classList.classImg =
              "http://livebroadcasting.jinrui.kooboo.site/__kb/kfile/" +
              this.classList.classImg;
            this.classList.startTime = new Date(
              parseInt(this.classList.startTime)
            ).toLocaleString();
            this.classList.endTime = new Date(
              parseInt(this.classList.endTime)
            ).toLocaleString();
            this.classList.createDate = new Date(
              parseInt(this.classList.createDate)
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
.main-area {
  background-color: #f4f4f4;
  width: 1205px;
  margin: 0 auto;
}
.classlist {
  width: 100%;
  .detail-content {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    font-size: 1.5rem;
  }
  .detail-image {
    margin: 2rem;
    width: 30%;
    img {
      height: 200px;
      width: 100%;
      object-fit: cover;
    }
  }
  .class-desc {
    font-size: 1.3rem;
  }
}
</style>
