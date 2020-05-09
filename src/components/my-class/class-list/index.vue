<template>
  <div class="classlist">
    <el-row v-if="classList.length > 0">
      <el-col
        class="class-container"
        v-for="(item, index) in classList"
        :key="index"
      >
        <el-card :body-style="{ padding: '0px' }">
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
                <div class="buttons bottom clearfix">
                  <el-row>
                    <el-col :span="12"
                      ><el-button
                        type="text"
                        class="button btnMr"
                        @click="updateDialog(item.classId, item)"
                        >编辑</el-button
                      ></el-col
                    >
                    <el-col :span="12"
                      ><el-button
                        type="text"
                        class="button btnMr"
                        @click="getDetail(item.classId)"
                        >详情</el-button
                      ></el-col
                    >
                  </el-row>
                </div>
              </div>
              <el-button
                @click="deleteclass(item.classId)"
                type="text"
                class="button deleteBtn"
                ><i class="el-icon-close"></i
              ></el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
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
  created() {
    this.dataInit();
  },
  methods: {
    setActivityBtn(data) {
      if (data == false) {
        this.dataInit();
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
    dataInit() {
      this.axios
        .get("/classform/list?createUser=" + window.liveBroadcastService.userId)
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
.classlist {
  overflow: auto;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .nodata {
    font-size: 1.5rem;
    text-align: center;
    width: 100%;
    color: #0a818c;
    margin-top: 10%;
  }
  .el-card {
    width: 100%;
  }
  .class-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 48%;
    margin: 1%;
    .card-row {
      align-items: center;
      .deleteBtn {
        position: absolute;
        top: 0;
        right: 1rem;
      }
      .btnMr {
        margin: 0 0 0 0.3rem;
      }
      .class-img {
        margin: 1rem;
        width: 100%;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .class-content {
        font-size: 0.7rem;
        height: 100%;
        margin: 1rem;
        .buttons {
          font-size: 0.7rem;
          display: flex;
          justify-content: flex-end;
        }
        .filed {
          padding: 0 0.5rem;
          margin: 0.5rem 0;
          .title-content {
            height: 2rem;
            word-wrap: break-word;
            overflow: hidden;
          }
        }
      }
    }
  }
  // @media screen and (max-width: 767px) {
  //   width: 80%;
  //   max-width: 450px;
  // }
}
</style>
