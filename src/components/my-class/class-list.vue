<template>
  <div class="classlist">
    <el-row type="flex" v-if="classList.length > 0" class="class-container">
      <div class="class-card" v-for="item in classList" :key="item._id">
        <el-button
          v-if="type === 'creator' && !isSearching"
          @click="handleDelete(item.classId)"
          type="text"
          class="delete-btn"
          :title="$t('class.deleteClass')"
          ><i class="el-icon-close"></i
        ></el-button>
        <el-button
          v-if="type === 'participant' && !isSearching"
          @click="handleQuit(item.classId)"
          type="text"
          class="delete-btn"
          :title="$t('class.quitClass')"
          ><i class="el-icon-close"></i
        ></el-button>
        <div class="card-container">
          <div class="card-left">
            <div class="live-status on" v-if="item.status === 1">
              {{ $t("class.liveStreaming") }}
            </div>
            <div class="live-status close" v-if="item.status === 2">
              {{ $t("class.liveFinished") }}
            </div>
            <div class="live-status expired" v-if="item.status === 3">
              {{ $t("class.liveExpired") }}
            </div>
            <img
              :src="
                item.url ? item.url : require('../../assets/images/cover.png')
              "
              :alt="$t('class.classCover')"
            />
          </div>
          <div class="detail-content">
            <div class="field" :title="item.title">
              <span>{{ item.title }}</span>
            </div>
            <div class="field">
              <label>{{ $t("class.startTime") }}：</label
              ><span>{{ item.startTime | timeFormat }}</span>
            </div>
            <div class="field">
              <label>{{ $t("class.endTime") }}：</label
              ><span>{{ item.endTime | timeFormat }}</span>
            </div>
            <div class="item-btn-group">
              <span class="btn-apply" @click="viewDetail(item.classId)">{{
                $t("class.viewDetail")
              }}</span>
              <span
                v-if="isSearching && !item.isJoined"
                class="btn-apply"
                @click="handleJoinClass(item.classId)"
              >
                {{ $t("class.joinClass") }}
              </span>
              <span @click="toLiveRoomPage(item)" v-else class="btn-apply">{{
                $t("class.enterClass")
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-row>
    <template v-else>
      <div class="nodata">{{ textTips }}</div>
    </template>
  </div>
</template>

<script>
import dayjs from "dayjs";
import classApi from "@api/class";
import { mapState } from "vuex";

export default {
  name: "ClassList",

  props: {
    classList: Array,
    isSearching: Boolean,
    type: String
  },
  computed: {
    ...mapState("device", ["isMobile"]),
    nodataTips() {
      return this.type === "creator"
        ? this.$t("class.noCreateClassTips")
        : this.$t("class.noJoinClassTips");
    },
    textTips() {
      return this.isSearching
        ? this.$t("class.hasNoSearchResult")
        : this.nodataTips;
    }
  },
  filters: {
    timeFormat(timestamp) {
      return dayjs(parseInt(timestamp)).format("YYYY/MM/DD HH:mm");
    }
  },
  methods: {
    viewDetail(classId) {
      this.$emit("detail", classId);
    },
    handleDelete(classId) {
      this.$confirm(this.$t("class.deleteTips"), this.$t("text.tips"), {
        confirmButtonText: this.$t("button.yes"),
        cancelButtonText: this.$t("button.cancel"),
        type: "warning"
      })
        .then(async () => {
          const result = await classApi.classRemove(classId);
          if (result.data.success) {
            this.$message.success(this.$t("class.deleteSuccess"));
            this.$emit("refresh");
          }
        })
        .catch(() => {});
    },
    handleQuit(classId) {
      this.$confirm(this.$t("class.quitTips"), this.$t("text.tips"), {
        confirmButtonText: this.$t("button.yes"),
        cancelButtonText: this.$t("button.cancel"),
        type: "warning"
      })
        .then(async () => {
          const result = await classApi.classQuit(classId);
          if (result.data.success) {
            this.$message.success(this.$t("class.quitSuccess"));
            this.$emit("refresh");
          }
        })
        .catch(() => {});
    },
    toLiveRoomPage(classInfo) {
      // 课堂已经结束
      if (classInfo.status === 2) {
        this.$message.info(this.$t("class.classIsOver"));
        return;
      }
      // 课堂已经结束
      if (classInfo.status === 3) {
        this.$message.info(this.$t("class.classIsExpired"));
        return;
      }
      // 还没到开始时间前半个小时
      const dateNow = new Date().getTime();
      const startTime = Number(classInfo.startTime) - 30 * 60 * 1000;
      if (dateNow < startTime) {
        this.$message.info(this.$t("class.enterClassLimitedBy30Min"));
        return;
      }

      let routName = this.isMobile ? "mobileLiveRoom" : "Liveroom";
      this.$router.push({
        name: routName,
        query: {
          id: classInfo.classId
        }
      });
    },
    handleJoinClass(id) {
      classApi
        .classApply(id)
        .then(res => {
          if (res.data.success) {
            this.$message.success(this.$t("class.joinSuccess"));
            this.$emit("refresh");
          } else {
            this.$message.error(this.$t("class.joinFailed"));
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
.classlist {
  overflow: auto;
  margin: 15px 0;
  .addclass-btn {
    margin-left: calc(100% - 8rem);
  }
  .nodata {
    font-size: 1.5rem;
    padding: 20px 0;
    color: #0a818c;
    text-align: center;
  }
  .el-pagination {
    margin-top: 1rem;
  }
  .class-container {
    flex-wrap: wrap;
    width: 100%;
    @media screen and (max-width: 767px) {
      justify-content: center;
    }
    .delete-btn {
      position: absolute;
      z-index: 99;
      right: 4px;
      top: 0;
      font-size: 18px;
    }
    .enter-class-btn {
      position: absolute;
      margin-left: 24.5%;
      z-index: 99;
    }
    .class-card {
      position: relative;
      width: 32%;
      min-width: 320px;
      @media screen and (max-width: 1200px) {
        width: 48%;
      }
      @media screen and (max-width: 767px) {
        width: 92%;
      }
      height: fit-content;
      background: white;
      margin: 0.5%;
      .card-container {
        display: flex;
        align-items: center;
        padding: 1rem;
        justify-content: space-between;
      }
      &:hover {
        box-shadow: 0px 0px 5px -1px #888888;
      }
      .card-left {
        position: relative;
        width: 30%;
        max-height: 100px;
        min-height: 100px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        .live-status {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 9;
          box-sizing: border-box;
          font-size: 12px;
          color: #fff;
          line-height: 18px;
          text-align: center;
          width: 51px;
          height: 18px;
          border-radius: 2px;
          &.on {
            background-color: #ff5e90;
          }
          &.close {
            background-color: #0a818c;
          }
          &.expired {
            background-color: #252434;
          }
        }
        img {
          width: 100%;
          max-height: 7rem;
          border-radius: 2px;
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .field:nth-child(1) {
          margin: 0 0.5rem;
          font-size: 1.4rem;
          height: 2rem;
        }
        .item-btn-group {
          display: flex;
          justify-content: space-between;
          margin: 0.5rem 0.5rem 0;
          .btn-apply {
            color: #409eff;
            cursor: pointer;
            &:hover {
              color: #66b1ff;
            }
          }
        }
      }
    }
  }
}
</style>
