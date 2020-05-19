<template>
  <div class="my-class-main">
    <div class="main-head">
      <el-tabs v-model="activeName" @tab-click="handleTabChange">
        <el-tab-pane
          :label="$t('class.theClassICreated')"
          name="creator"
        ></el-tab-pane>
        <el-tab-pane
          :label="$t('class.theClassIJoined')"
          name="participant"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="main-area">
      <div class="operation-area clearfix">
        <div class="search right">
          <el-input
            v-if="activeName === 'participant'"
            :placeholder="$t('class.searchClass')"
            v-model="searchValue"
            class="input-with-select"
            clearable
          >
            <el-select
              v-model="searchField"
              slot="prepend"
              @change="handleFieldChange"
            >
              <el-option
                :label="$t('class.classId')"
                value="classId"
              ></el-option>
              <el-option
                :label="$t('class.classTitle')"
                value="title"
              ></el-option>
              <el-option
                :label="$t('class.createUser')"
                value="createUser"
              ></el-option>
            </el-select>
            <el-button
              @click="handleSearch(1)"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </div>
        <el-button
          v-if="activeName === 'creator'"
          class="right"
          type="primary"
          @click.stop="toClassForm"
          >{{ $t("class.createClass") }}</el-button
        >
      </div>
      <keep-alive>
        <class-list
          :classList="list"
          v-loading="loading"
          :type="activeName"
          :isSearching="isSearching"
          @refresh="handleRefresh"
        />
      </keep-alive>
      <el-pagination
        :page-size="pageSize"
        :current-page="pageNum"
        @current-change="handlePageChange"
        layout="prev, pager, next"
        :hide-on-single-page="true"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import classApi from "@api/class";
import dayjs from "dayjs";
import ClassList from "./class-list";

export default {
  name: "MyClassMian",
  data() {
    return {
      searchResult: [],
      isSearching: false,
      pageSize: 9,
      pageNum: 1,
      total: 0,
      searchValue: "",
      searchField: "title",
      classList: [],
      loading: false,
      activeName: "creator"
    };
  },
  computed: {
    list() {
      return this.isSearching ? this.searchResult : this.classList;
    }
  },
  created() {
    this.getListData(this.activeName, this.pageNum, this.pageSize);
  },
  methods: {
    getListData(type, pageNum, pageSize) {
      this.loading = true;
      classApi.getClassList(type, pageNum, pageSize).then(res => {
        if (res.data.success) {
          const data = res.data.model;
          this.total = data.total;
          this.classList = data.list;
          this.loading = false;
        } else {
          this.$message.error($t("class.classDataAcquisitionFailed"));
        }
      });
    },
    handleTabChange() {
      this.pageNum = 1;
      this.isSearching = false;
      this.getListData(this.activeName, this.pageNum, this.pageSize);
    },
    handlePageChange(index) {
      this.pageNum = index;
      if (!this.isSearching) {
        this.getListData(this.activeName, this.pageNum, this.pageSize);
      } else {
        this.handleSearch(index);
      }
    },
    handleFieldChange() {
      this.searchValue = "";
    },
    handleRefresh() {
      this.isSearching = false;
      this.pageNum = 1;
      this.searchResult = [];
      this.searchValue = "";
      this.getListData(this.activeName, this.pageNum, this.pageSize);
    },
    handleSearch(pageNum) {
      if (!this.searchField || !this.searchField.trim()) {
        this.$message.info($t("class.searchFieldRequires"));
        return;
      }
      if (!this.searchValue) return;
      this.loading = true;
      this.isSearching = true;
      this.pageNum = pageNum;
      classApi
        .classSearch(
          this.searchField,
          this.searchValue,
          this.pageNum,
          this.pageSize
        )
        .then(res => {
          if (res.data.success) {
            const data = res.data.model;
            this.total = data.total;
            this.searchResult = data.list;
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
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
    @media screen and (max-width: 1200px) {
      width: auto;
    }
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
    @media screen and (max-width: 1200px) {
      width: auto;
    }
    .operation-area {
      .search {
        width: 40%;
        @media screen and (max-width: 1200px) {
          width: auto;
        }
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
