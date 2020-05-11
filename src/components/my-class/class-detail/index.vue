<template>
  <div class="main-area">
    <div class="classlist">
      <el-row type="flex" class="detail-container">
        <div class="detail-image">
          <img :src="classList.classImg" alt="" />
        </div>
        <div class="detail-content">
          <div class="detail-title">
            <span>{{ classList.title }}</span>
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
        <el-button
          class="edit-btn"
          type="primary"
          @click="updateDialog($route.params.classId)"
          >编辑</el-button
        >
      </el-row>
      <div class="class-desc">
        <label>课堂描述：</label><span>{{ classList.description }}</span>
      </div>
      <div class="class-desc" v-if="$route.params.activeName == 'teacher'">
        <label>参与学生：</label><span>{{ studentsList }}</span>
      </div>
    </div>
    <!-- <el-button
      class="edit-btn"
      type="primary"
      @click="updateDialog($route.params.classId)"
      >编辑</el-button
    > -->
    <el-dialog title="修改课堂信息" :visible.sync="dialogFormVisible">
      <ClassUpdate
        :classId="classId"
        @setActivityBtn="setActivityBtn"
      ></ClassUpdate>
    </el-dialog>
  </div>
</template>

<script>
import { detailInit, formatDate } from "@api/class";
import ClassUpdate from "./update";
export default {
  name: "ClassDetail",
  components: {
    ClassUpdate
  },
  data() {
    return {
      classList: "",
      studentsList: "",
      classId: "",
      dialogFormVisible: false
    };
  },
  created() {
    this.dataInit();
    // console.log(this.$route.params.activeName);
  },
  methods: {
    updateDialog(classId) {
      this.classId = classId;
      this.dialogFormVisible = true;
    },
    setActivityBtn(data) {
      if (data == false) {
        this.dataInit();
        this.dialogFormVisible = false;
      }
    },
    dataInit() {
      detailInit(this.$route.params.classId)
        .then(res => {
          if (res.data.success) {
            this.classList = res.data.data[0];
            this.classList.classImg =
              "http://livebroadcasting.jinrui.kooboo.site/__kb/kfile/" +
              this.classList.classImg;
            this.classList.startTime = formatDate(this.classList.startTime);
            this.classList.endTime = formatDate(this.classList.endTime);
            this.classList.createDate = formatDate(this.classList.createDate);
            if (res.data.data[0].students) {
              this.studentsList = JSON.parse(
                res.data.data[0].students
              ).toString();
            } else {
              this.studentsList = "暂无学生";
            }
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
  .edit-btn {
    height: 2.5rem;
    position: absolute;
    right: 1rem;
    top: 2rem;
  }
}
.classlist {
  width: 100%;
  .detail-container {
    align-items: center;
  }
  .detail-content {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    font-size: 1.2rem;
    overflow: hidden;
  }
  .detail-title {
    font-size: 2.5rem;
    line-height: 3.5rem;
    overflow-wrap: break-word;
    // max-height: 6rem;
    max-width: 40rem;
    // overflow: hidden;
    padding: 1rem;
    margin-right: 5rem;
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
    padding: 1rem;
    overflow-wrap: break-word;
  }
}
</style>
