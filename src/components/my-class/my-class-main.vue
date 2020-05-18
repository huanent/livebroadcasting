<template>
  <div class="my-class-main">
    <div class="main-head">
      <el-tabs v-model="activeName" @tab-click="handleTabChange">
        <el-tab-pane label="我的开课" name="creator"></el-tab-pane>
        <el-tab-pane label="我的课堂" name="participant"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="main-area">
      <div class="operation-area">
        <div class="search">
          <el-input
            placeholder="请输入搜索内容"
            v-model="searchValue"
            class="input-with-select"
          >
            <el-select
              v-model="searchQuery"
              slot="prepend"
              placeholder="请选择"
            >
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
        <el-button
          class="addclass-btn"
          type="primary"
          @click.stop="toClassForm"
          >{{ $t("classform.createClass") }}</el-button
        >
      </div>
      <keep-alive>
        <class-list :classList="classList" v-loading="loading" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { getClassList } from "@api/class";
import dayjs from "dayjs";
import ClassList from "./class-list";

export default {
  name: "MyClassMian",
  data() {
    return {
      searchValue: "",
      classList: [],
      total: "",
      loading: false,
      activeName: "creator"
    };
  },
  created() {
    this.getListData(this.activeName);
  },
  methods: {
    getListData(type) {
      this.loading = true;
      getClassList(type).then(res => {
        if (res.data.success) {
          this.total = res.data.total;
          this.classList = res.data.model;
          this.loading = false;
        } else {
          this.$message.error("课堂数据获取失败");
        }
      });
    },
    handleTabChange() {
      this.getListData(this.activeName);
    },
    toClassForm() {
      this.$router.push({ name: "Classform" });
    }
  },
  components: {
    ClassList
  }
};
</script>

<style lang="scss" scoped>
.my-class-main {
  background: #fff;
  margin-bottom: 40px;
  border-bottom: 1px solid #ddd;
  height: 60px;
  text-align: left;
  .main-head {
    width: 1205px;
    margin: 0 auto;
    /deep/ .el-tabs__item {
      height: 60px;
      line-height: 60px;
      font-size: 18px;
    }
    /deep/ .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
  }
  .main-area {
    background-color: #f4f4f4;
    width: 1205px;
    margin: 0 auto;
    .operation-area {
      .search {
        width: 40%;
        /deep/ .el-input .el-input--suffix {
          width: 6rem;
        }
        /deep/ .el-input-group__append {
          background: #0a818c;
          color: white;
        }
      }
    }
  }
}
</style>
