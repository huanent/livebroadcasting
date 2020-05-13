<template>
  <div class="classlist">
    <el-button
      v-if="activeName === 'teacher'"
      class="addclass-btn"
      type="primary"
      @click.stop="toClassForm"
      >{{ $t("classform.createClass") }}</el-button
    >
    <div class="search" v-if="activeName === 'student'">
      <el-input
        placeholder="请输入搜索内容"
        v-model="searchContent"
        class="input-with-select"
      >
        <el-select v-model="searchQuery" slot="prepend" placeholder="请选择">
          <el-option label="房间号" value="classId"></el-option>
          <el-option label="标题" value="title"></el-option>
          <el-option label="创建者" value="createUser"></el-option>
        </el-select>
        <el-button
          @click="searchClass()"
          slot="append"
          icon="el-icon-search"
        ></el-button>
      </el-input>
    </div>
    <el-row type="flex" v-if="classList.length > 0" class="class-container">
      <div class="class-card" v-for="item in classList" :key="item._id">
        <el-button
          v-if="activeName == 'teacher'"
          @click="deleteclass(item.classId)"
          type="text"
          class="delete-btn"
          ><i class="el-icon-close"></i
        ></el-button>
        <div class="card-container">
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
                  query: {
                    classId: item.classId
                  }
                }"
                >查看详情</router-link
              >
              <router-link
                :to="{
                  name: 'Liveroom',
                  query: { createUser: item.createUser, id: item.classId }
                }"
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
import {
  removeClassImg,
  classListInit,
  formatDate,
  searchClass
} from "@api/class";
import { mapMutations } from "vuex";
export default {
  name: "ClassList",
  data() {
    return {
      classList: [],
      pageTotal: 1,
      createCacheArr: [],
      mylessonCacheArr: [],
      createPageCache: 1,
      mylessonPageCache: 1,
      currentPageArr: {
        student: 1,
        teacher: 1
      },
      searchContent: "",
      searchQuery: "classId",
      searchMode: false
    };
  },
  props: {
    activeName: String
    // label: String
  },
  created() {
    console.log(this.currentPageArr);
    if (this.createCacheArr.length == 0 && this.mylessonCacheArr.length == 0) {
      this.dataInit(this.activeName);
    } else {
      console.log(1);
    }
  },
  watch: {
    activeName(newActive) {
      if (newActive == "teacher" && this.createCacheArr.length > 0) {
        this.classList = this.createCacheArr[0];
        this.pageTotal = this.createPageCache;
      }
      if (newActive == "student" && this.mylessonCacheArr.length > 0) {
        this.classList = this.mylessonCacheArr[0];
        this.pageTotal = this.mylessonPageCache;
      }
      this.dataInit(newActive);
    }
  },
  methods: {
    ...mapMutations("account", ["SET_TX_CLASSID"]),
    searchClass(pageNum) {
      if (!this.searchContent) {
        return;
      }
      pageNum = pageNum || 1;
      searchClass(this.searchQuery, this.searchContent, pageNum).then(res => {
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
          this.searchMode = true;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    handleCurrentChange(pageNum) {
      if (this.activeName == "student") {
        this.mylessonCacheArr = [];
      }
      if (this.activeName == "teacher") {
        this.createCacheArr = [];
      }
      if (this.searchMode) {
        this.searchClass(pageNum);
        return;
      }
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
    getData(activeName, pageNum, cacheArr) {
      classListInit(activeName, pageNum)
        .then(res => {
          if (res.data.success) {
            cacheArr.push(res.data.data);
            this.classList = res.data.data;
            this.classList.forEach(element => {
              element.url =
                "http://livebroadcasting.jinrui.kooboo.site/" + element.url;
              element.startTime = formatDate(element.startTime);
              element.endTime = formatDate(element.endTime);
              element.createDate = formatDate(element.createDate);
            });
            this.pageTotal = res.data.total;
            if (activeName == "student") {
              this.mylessonPageCache = res.data.total;
            }
            if (activeName == "teacher") {
              this.createPageCache = res.data.total;
            }
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    dataInit(activeName, pageNum) {
      if (this.createCacheArr.length == 0 && this.activeName == "teacher") {
        this.getData(activeName, pageNum, this.createCacheArr);
      } else if (
        this.mylessonCacheArr.length == 0 &&
        this.activeName == "student"
      ) {
        this.getData(activeName, pageNum, this.mylessonCacheArr);
      } else {
        return false;
      }
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
  .search {
    margin-left: 57%;
    width: 40%;
    /deep/ .el-input .el-input--suffix {
      width: 6rem;
    }
    /deep/ .el-input-group__append {
      background: #0a818c;
      color: white;
    }
  }
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
