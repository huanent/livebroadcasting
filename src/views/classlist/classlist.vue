<template>
  <div class="classlist-page">
    <div class="classlist">
      <el-row
        ><el-col :span="24"
          ><div class="page-title">classList</div></el-col
        ></el-row
      >
      <el-row>
        <el-col :lg="12" v-for="(item, index) in classList" :key="index">
          <el-card :body-style="{ padding: '0px' }">
            <el-row type="flex" class="card-row">
              <el-col :span="8"
                ><div class="class-img">
                  <img :src="item.classImg" /></div
              ></el-col>
              <el-col :span="16">
                <div class="class-content">
                  <div class="filed">
                    <label>课堂标题：</label><span>{{ item.title }}</span>
                  </div>
                  <div class="filed">
                    <label>开始时间：</label><span>{{ item.startTime }}</span>
                  </div>
                  <div class="filed">
                    <label>结束时间：</label><span>{{ item.endTime }}</span>
                  </div>
                  <div class="filed">
                    <label>创建日期：</label><span>{{ item.createDate }}</span>
                  </div>
                  <div class="filed">
                    <label>课堂描述：</label>
                    <span>{{ item.description }}</span>
                  </div>
                  <div class="buttons bottom clearfix">
                    <el-row>
                      <el-col :span="8"
                        ><el-button type="text" class="button"
                          >编辑</el-button
                        ></el-col
                      >
                      <el-col :span="8"
                        ><el-button
                          type="text"
                          class="button"
                          @click="getDetail(item.classId)"
                          >详情</el-button
                        ></el-col
                      >
                      <el-col :span="8"
                        ><el-button
                          @click="deleteclass(item.classId)"
                          type="text"
                          class="button"
                          >删除</el-button
                        ></el-col
                      >
                    </el-row>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { LiveBroadcastService } from "../../core/live-broadcast/live-broadcast-service";
import { removeClassImg } from "../../core/data/data-service";
export default {
  name: "Classlist",
  data() {
    return {
      userId: "",
      classList: []
    };
  },
  created() {
    this.userId = window.liveBroadcastService.userId;
    this.dataInit();
  },
  methods: {
    deleteclass(index) {
      removeClassImg(index).then(res => {
        this.$confirm("此操作将删除该课堂, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            if (res.data.success) {
              this.dataInit();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      });
    },
    dataInit() {
      this.axios
        .get("/classform/list?createUser=" + this.userId)
        .then(res => {
          if (res.data.success) {
            this.classList = res.data.data;
            this.classList.forEach(element => {
              element.classImg =
                "http://livebroadcasting.jinrui.kooboo.site/__kb/kfile/" +
                element.classImg;
            });
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onFilePreview(img) {
      window.open(img, "_blank");
    },
    getDetail(classId) {
      this.$router.push({
        name: "Classdetail",
        params: {
          classId: classId
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.classlist-page {
  width: 100%;
  .classlist {
    height: 600px;
    overflow: auto;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    padding: 2rem 1.5rem 1rem;
    width: 80%;
    background: $white;
    border-radius: 2px;
    border: 1px solid #e7eaed;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
    @media screen and (max-width: 767px) {
      width: 80%;
      max-width: 450px;
    }
  }
}
.page-title {
  font-size: 5rem;
  text-align: center;
}
.card-row {
  align-items: center;
}
.class-content {
  font-size: 0.7rem;
  height: 100%;
  margin: 1rem;
  .buttons {
    font-size: 0.7rem;
    position: absolute;
    bottom: 0;
    right: 1rem;
  }
  .filed {
    padding: 0 0.5rem;
    margin: 0.5rem 0;
  }
}
.class-img {
  img {
    width: 100%;
  }
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
