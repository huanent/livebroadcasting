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
        <el-button
          @click="enterClass(item.classId, item.createUser)"
          type="text"
          class="enter-class-btn"
          >进入课堂</el-button
        >
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
            <div class="item-btn-group">
              <router-link
                :to="{
                  name: 'Classdetail',
                  params: {
                    classId: item.classId,
                    activeName: activeName
                  }
                }"
                >查看详情</router-link
              >
              <router-link
                :to="{ name: 'Liveroom', params: { id: item.classId } }"
                >进入课堂</router-link
              >
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
import { mapMutations } from "vuex";
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
    ...mapMutations("account", ["SET_TX_CLASSID"]),
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
        path: `/detail`,
        query: {
          classId: classId
        }
      });
    },
    enterClass(classId, creater) {
      this.SET_TX_CLASSID(classId);
      this.$router.push({
        path: `/liveroom/${classId}`
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
      // width: 1rem;
      // height: 1rem;
      position: absolute;
      margin-left: 30%;
      z-index: 99;
    }
    .enter-class-btn {
      position: absolute;
      margin-left: 24.5%;
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
          margin: 0.5rem 0.5rem 0;
        }
        .field:nth-child(1) {
          margin: 0 0.5rem;
          font-size: 1.5rem;
          overflow: hidden;
          height: 2rem;
          text-overflow: ellipsis;
        }
        .item-btn-group {
          display: flex;
          justify-content: space-between;
          margin: 0.5rem 0.5rem 0;
        }
      }
    }
  }
}
</style>
