<template>
  <div class="classlist">
    <!-- <el-row v-if="classList.length > 0">
      <el-col
        class="class-container"
        v-for="(item, index) in classList"
        :key="index"
      >
        <el-card>
          <el-row type="flex" class="card-row">
            <el-col :span="8"
              ><div class="class-img">
                <img :src="item.classImg" /></div
            ></el-col>
            <el-col :span="16">
              <div class="class-content">
                <div class="filed">
                  <div>课堂标题：</div>
                  <div class="title-content">{{ item.title }}</div>
                </div>
                <div class="filed">
                  <div>开始时间：</div>
                  <div>{{ item.startTime }}</div>
                </div>
                <div class="filed">
                  <div>结束时间：</div>
                  <div>{{ item.endTime }}</div>
                </div>
                <div class="filed">
                  <div>创建日期：</div>
                  <div>{{ item.createDate }}</div>
                </div>
              </div>
              <div class="buttons">
                <el-button
                  v-if="activeName == 'teacher'"
                  type="text"
                  @click="updateDialog(item.classId, item)"
                  >编辑</el-button
                >
                <el-button type="text" @click="getDetail(item.classId)"
                  >详情</el-button
                >
              </div>
              <el-button
                @click="deleteclass(item.classId)"
                type="text"
                class="deleteBtn"
                ><i class="el-icon-close"></i
              ></el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row> -->
    <el-row type="flex" v-if="classList.length > 0" class="class-container">
      <div class="class-card" v-for="(item, index) in classList" :key="index">
        <div class="detail-image">
          <img :src="item.classImg" alt="" />
        </div>
        <div class="detail-content">
          <div>
            <label>课堂标题：</label><span>{{ item.title }}</span>
          </div>
          <div>
            <label>开始时间：</label><span>{{ item.startTime }}</span>
          </div>
          <div>
            <label>结束时间：</label><span>{{ item.endTime }}</span>
          </div>

          <div>
            <label>创建日期：</label><span>{{ item.createDate }}</span>
          </div>
        </div>
        <div class="buttons">
          <el-button
            v-if="activeName == 'teacher'"
            type="text"
            @click="updateDialog(item.classId, item)"
            >编辑</el-button
          >
          <el-button type="text" @click="getDetail(item.classId)"
            >详情</el-button
          >
        </div>
        <el-button
          @click="deleteclass(item.classId)"
          type="text"
          class="deleteBtn"
          ><i class="el-icon-close"></i
        ></el-button>
      </div>
    </el-row>
    <div v-else class="nodata">您还没有创建课堂</div>
    <el-dialog title="修改课堂信息" :visible.sync="dialogFormVisible">
      <ClassUpdate
        :classId="classId"
        @setActivityBtn="setActivityBtn"
      ></ClassUpdate>
    </el-dialog>
  </div>
</template>

<script>
import ClassUpdate from "./update";
export default {
  name: "Classlist",
  components: {
    ClassUpdate
  },
  data() {
    return {
      classId: "",
      classList: [],
      dialogFormVisible: false
    };
  },
  props: {
    activeName: String
  },
  created() {
    this.dataInit(this.activeName);
  },
  watch: {
    activeName(newActive) {
      this.dataInit(newActive);
    }
  },
  methods: {
    setActivityBtn(data) {
      if (data == false) {
        this.dataInit(this.activeName);
        this.dialogFormVisible = false;
      }
    },
    deleteclass(index) {
      removeClassImg(index).then(res => {
        this.$confirm("此操作将删除该课堂, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          if (res.data.success) {
            this.dataInit();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        });
      });
    },
    dataInit(activeName) {
      var apiurl = "";
      if (activeName == "student") {
        apiurl =
          "/classform/list?isstudent=" + window.liveBroadcastService.userId;
      }
      if (activeName == "teacher") {
        apiurl =
          "/classform/list?createUser=" + window.liveBroadcastService.userId;
      }
      this.axios
        .get(apiurl)
        .then(res => {
          if (res.data.success) {
            this.classList = res.data.data;
            this.classList.forEach(element => {
              element.classImg =
                "http://livebroadcasting.jinrui.kooboo.site/__kb/kfile/" +
                element.classImg;
              element.startTime = new Date(
                parseInt(element.startTime)
              ).toLocaleString();
              element.endTime = new Date(
                parseInt(element.endTime)
              ).toLocaleString();
              element.createDate = new Date(
                parseInt(element.createDate)
              ).toLocaleString();
            });
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getDetail(classId) {
      this.$router.push({
        name: "Classdetail",
        params: {
          classId: classId
        }
      });
    },
    updateDialog(classId) {
      this.classId = classId;
      this.dialogFormVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
// .classlist {
//   overflow: auto;
//   width: 100%;
//   display: flex;
//   flex-wrap: wrap;
//   .nodata {
//     font-size: 1.5rem;
//     text-align: center;
//     width: 100%;
//     color: #0a818c;
//     margin-top: 10%;
//   }
//   .el-card {
//     width: 100%;
//   }
//   .class-container {
//     display: flex;
//     justify-content: center;
//     flex-wrap: wrap;
//     width: 48%;
//     margin: 1%;
//     .card-row {
//       align-items: center;
//       .deleteBtn {
//         position: absolute;
//         top: 0;
//         right: 1rem;
//         z-index: 99;
//       }
//       .btnMr {
//         margin: 0 0 0 0.3rem;
//       }
//       .buttons {
//         position: absolute;
//         right: 0;
//         bottom: -5%;
//       }
//       .class-img {
//         margin: 1rem;
//         width: 100%;
//         height: 200px;
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         overflow: hidden;
//         img {
//           width: 100%;
//         }
//       }
//       .class-content {
//         font-size: 0.7rem;
//         height: 100%;
//         margin: 1rem;
//         .filed {
//           padding: 0 0.5rem;
//           margin: 0.5rem 0;
//           .title-content {
//             height: 2rem;
//             word-wrap: break-word;
//             overflow: hidden;
//           }
//         }
//       }
//     }
//   }
// }

.classlist {
  overflow: auto;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .class-container {
    flex-wrap: wrap;
    width: 100%;
    .class-card {
      width: 42%;
      margin: 1%;
      display: flex;
      align-items: center;
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      justify-content: space-between;
      .detail-image {
        width: 30%;
        img {
          width: 100%;
          height: 10rem;
        }
      }
      .detail-content {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 100%;
        width: 60%;
      }
    }
  }
}
</style>
