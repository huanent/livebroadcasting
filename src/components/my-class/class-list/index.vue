<template>
  <div class="classlist">
    <el-button
      v-if="activeName === 'teacher'"
      class="addclass-btn"
      type="primary"
      @click.stop="toClassForm"
      >{{ $t("classform.createClass") }}</el-button
    >
    <el-row type="flex" v-if="classList.length > 0" class="class-container">
      <div class="class-card" v-for="item in classList" :key="item._id">
        <el-button
          v-if="activeName == 'teacher'"
          @click="deleteclass(item.classId)"
          type="text"
          class="delete-btn"
          ><i class="el-icon-close"></i
        ></el-button>
        <div
          class="card-container"
          @click="getDetail(item.classId, activeName)"
        >
          <div class="detail-image">
            <img :src="item.url" alt="" />
          </div>
          <div class="detail-content">
            <div class="field">
              <span>{{ item.title }}</span>
            </div>
            <div class="field">
              <label>{{ $t("classform.startTime") }}：</label
              ><span>{{ item.startTime }}</span>
            </div>
            <div class="field">
              <label>{{ $t("classform.endTime") }}：</label
              ><span>{{ item.endTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-row>
    <template v-else>
      <div v-if="activeName === 'teacher'" class="nodata">
        {{ $t("classform.noCreateClassTips") }}
      </div>
      <div v-if="activeName === 'student'" class="nodata">
        {{ $t("classform.noJoinClassTips") }}
      </div>
    </template>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="9"
      :total="pageTotal"
      hide-on-single-page
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { removeClassImg, classListInit, formatDate } from "@api/class";
export default {
  name: "ClassList",
  data() {
    return {
      classList: [],
      pageTotal: 1
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
    handleCurrentChange(pageNum) {
      this.dataInit(this.activeName, pageNum);
    },
    toClassForm() {
      this.$router.push({ name: "Classform" });
    },
    deleteclass(index) {
      this.$confirm(this.$t("classform.deleteTips"), this.$t("text.tips"), {
        confirmButtonText: this.$t("button.yes"),
        cancelButtonText: this.$t("button.cancel"),
        type: "warning"
      })
        .then(() => {
          removeClassImg(index).then(res => {
            if (res.data.success) {
              this.dataInit(this.activeName);
              this.$message({
                type: "success",
                message: this.$t("text.deleteSuccess")
              });
            }
          });
        })
        .catch(() => {});
    },
    dataInit(activeName, pageNum) {
      classListInit(activeName, pageNum)
        .then(res => {
          if (res.data.success) {
            this.classList = res.data.data;
            this.classList.forEach(element => {
              element.url =
                "http://livebroadcasting.jinrui.kooboo.site/" + element.url;
              element.startTime = formatDate(element.startTime);
              element.endTime = formatDate(element.endTime);
              element.createDate = formatDate(element.createDate);
            });
            this.pageTotal = res.data.total;
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
          classId: classId,
          activeName: this.activeName
        }
      });
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
  justify-content: space-around;
  .addclass-btn {
    margin-left: calc(100% - 8rem);
  }
  .nodata {
    font-size: 1.5rem;
    color: #0a818c;
  }
  .el-pagination {
    margin-top: 1rem;
  }
  .class-container {
    flex-wrap: wrap;
    width: 100%;
    .delete-btn {
      width: 1rem;
      height: 1rem;
      position: absolute;
      margin-left: 30%;
      z-index: 99;
    }
    .class-card {
      width: 32%;
      margin: 0.5%;
      .card-container {
        display: flex;
        align-items: center;
        background: white;
        padding: 1rem;
        justify-content: space-between;
      }
      &:hover {
        cursor: pointer;
        box-shadow: 0px 0px 5px -1px #888888;
      }
      .detail-image {
        width: 30%;
        img {
          width: 100%;
          max-height: 7rem;
        }
      }
      .detail-content {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 100%;
        width: 60%;
        .field {
          margin: 0.5rem;
        }
        .field:nth-child(1) {
          margin: 0.5rem;
          font-size: 1.5rem;
          overflow: hidden;
          height: 2rem;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
