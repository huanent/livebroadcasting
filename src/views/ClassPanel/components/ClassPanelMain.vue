<template>
  <div class="my-class-main">
    <div class="main-head">
      <div class="head-inner-wrapper">
        <el-tabs v-model="activeName" @tab-click="handleTabChange">
          <el-tab-pane
            :label="$t('class.theClassIJoined')"
            name="participant"
          ></el-tab-pane>
          <el-tab-pane
            :label="$t('class.theClassICreated')"
            name="creator"
          ></el-tab-pane>
        </el-tabs>
        <div class="operation-area clearfix">
          <div class="search right">
            <el-input
              v-if="activeName === 'participant'"
              :placeholder="$t('class.searchClass')"
              v-model="searchValue"
              prefix-icon="el-icon-search"
              class="input-with-select"
              clearable
              @change="handleSearch(1)"
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
              <!-- <el-button
              @click="handleSearch(1)"
              slot="append"
              icon="el-icon-search"
            ></el-button> -->
            </el-input>
          </div>
          <el-button
            v-if="activeName === 'creator'"
            class="right create-class-btn"
            type="primary"
            @click.stop="openCreateForm"
            >{{ $t("class.createClass") }}</el-button
          >
        </div>
      </div>
    </div>
    <div class="main-area">
      <keep-alive>
        <class-list
          :classList="list"
          @detail="viewDetail"
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
    <class-create ref="createDialog" @createSuccess="createSuccess" />
    <class-detail
      ref="detailDialog"
      :classInfo="classInfo"
      @handleEdit="handleEdit"
    />
    <class-edit
      ref="editDialog"
      :classInfo="classInfo"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script>
import classApi from "@api/class";
import dayjs from "dayjs";
import ClassList from "./ClassList";
import ClassCreate from "./ClassCreate";
import ClassDetail from "./ClassDetail";
import ClassEdit from "./ClassEdit";

export default {
  name: "ClassPanelMain",
  data() {
    return {
      searchResult: [],
      classInfo: {},
      isSearching: false,
      pageSize: 9,
      pageNum: 1,
      searchValue: "",
      searchField: "title",
      loading: false,
      activeName: "participant",
      createdDataCache: false,
      classCreatedList: [],
      classCreatedTotal: 0,
      joinedDataCache: false,
      classJoinedList: [],
      classJoinedTotal: 0,
    };
  },
  computed: {
    classList() {
      return this.activeName === "creator"
        ? this.classCreatedList
        : this.classJoinedList;
    },
    total() {
      return this.activeName === "creator"
        ? this.classCreatedTotal
        : this.classJoinedTotal;
    },
    list() {
      return this.isSearching ? this.searchResult : this.classList;
    },
  },
  created() {
    this.getListData(this.activeName, this.pageNum, this.pageSize);
    this.handleDataCache(this.activeName);
  },
  methods: {
    viewDetail(classId) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      classApi
        .classGet(classId)
        .then((res) => {
          if (res.data.success) {
            this.classInfo = res.data.model;
            this.$refs["detailDialog"].open();
            loading.close();
          } else {
            this.$message.error("没有对应的课堂信息");
            loading.close();
          }
        })
        .catch((err) => {
          console.log(err);
          loading.close();
        });
    },
    handleEdit() {
      this.$refs["detailDialog"].close();
      this.$refs["editDialog"].init();
      this.$refs["editDialog"].open();
    },
    handleDataCache(activeName) {
      if (activeName === "creator") {
        this.createdDataCache = true;
      }
      if (activeName === "participant") {
        this.joinedDataCache = true;
      }
    },
    handleEditSuccess(data) {
      this.classInfo = data;
      this.handleRefresh();
      this.$refs["editDialog"].close();
    },
    getListData(type, pageNum, pageSize) {
      this.loading = true;
      classApi.getClassList(type, pageNum, pageSize).then((res) => {
        if (res.data.success) {
          const data = res.data.model;
          if (type === "creator") {
            this.classCreatedList = data.list;
            this.classCreatedTotal = data.total;
          } else {
            this.classJoinedList = data.list;
            this.classJoinedTotal = data.total;
          }
          this.loading = false;
        } else {
          this.$message.error($t("class.classDataAcquisitionFailed"));
        }
      });
    },
    createSuccess() {
      this.pageNum = 1;
      this.getListData(this.activeName, this.pageNum, this.pageSize);
    },
    handleTabChange() {
      this.pageNum = 1;
      this.isSearching = false;
      if (this.activeName === "creator" && this.createdDataCache) return;
      if (this.activeName === "participant" && this.joinedDataCache) return;
      this.getListData(this.activeName, this.pageNum, this.pageSize);
      this.handleDataCache(this.activeName);
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
        .then((res) => {
          if (res.data.success) {
            const data = res.data.model;
            this.total = data.total;
            this.searchResult = data.list;
            this.loading = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openCreateForm() {
      this.$refs["createDialog"].open();
    },
  },
  components: {
    ClassList,
    ClassCreate,
    ClassDetail,
    ClassEdit,
  },
};
</script>

<style lang="scss" scoped>
.my-class-main {
  background: #fff;
  margin-bottom: 40px;
  text-align: left;
  .main-head {
    max-width: 1205px;
    padding: 40px 15px 32px;
    margin: 0 auto;
    @media screen and (max-width: 1200px) {
      width: auto;
    }
    .head-inner-wrapper {
      max-width: 916px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      @media screen and (max-width: 767px) {
        display: block;
        .el-tabs {
          margin-bottom: 1rem;
        }
      }
    }
    /deep/ .el-tabs__nav {
      @media screen and (max-width: 767px) {
        width: 100%;
      }
      .el-tabs__active-bar {
        display: none;
      }
    }
    /deep/ .el-tabs__header {
      margin-bottom: 0;
    }
    /deep/ .el-tabs__item {
      @media screen and (max-width: 767px) {
        width: 50%;
      }
      border: 1px solid #d0cfe6;
      font-size: 16px;
      font-weight: 400;
      color: #8a8a99;
      padding: 16px 32px;
      height: auto;
      line-height: 1.2;
      &.is-active {
        background: #506efa;
        border-color: #506efa;
        color: #ffffff;
      }
      &:nth-child(2) {
        border-radius: 4px 0 0 4px;
        border-right: 0 none;
      }
      &:last-child {
        border-radius: 0 4px 4px 0;
        border-left: 0 none;
      }
    }
    /deep/ .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
    .operation-area {
      .search {
        @media screen and (max-width: 1200px) {
          width: auto;
        }
        @media screen and (max-width: 768px) {
          width: 100%;
        }
        /deep/ {
          .el-input .el-input--suffix {
            width: 5.2rem;
            .el-input__inner {
              padding-left: 0.625rem;
            }
          }
          .el-input-group {
            border-radius: 4px;
            border: 1px solid #506efa;
          }
          .el-input-group__prepend {
            background: #506efa;
            color: #ffffff;
            border-radius: 0;
            border: 0 none;
          }
          .el-select .el-input .el-select__caret {
            color: #ffffff;
          }
          .el-input-group--prepend .el-input__inner {
            border: 0 none;
            height: 2rem;
            line-height: 2rem;
          }
          .el-input__icon {
            line-height: 2rem;
          }
        }
      }
      .create-class-btn {
        height: 53px;
      }
    }
  }
  .main-area {
    max-width: 1205px;
    padding: 0 15px;
    margin: 0 auto;
    @media screen and (max-width: 1200px) {
      width: auto;
    }
  }
}
</style>
