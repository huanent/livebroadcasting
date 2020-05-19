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
          <div class="detail-image">
            <img :src="item.url" :alt="$t('class.classCover')" />
          </div>
          <div class="detail-content">
            <div class="field">
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
              <router-link
                :to="{
                  name: 'Classdetail',
                  query: {
                    classId: item.classId
                  }
                }"
                >{{ $t("class.viewDetail") }}</router-link
              >
              <span
                v-if="isSearching"
                class="btn-apply"
                @click="handleJoinClass(item.classId)"
                >{{ $t("class.joinClass") }}</span
              >
              <router-link
                v-else
                :to="{
                  name: 'Liveroom',
                  query: { createUser: item.createUser, id: item.classId }
                }"
                >{{ $t("class.enterClass") }}</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </el-row>
    <template v-else>
      <div class="nodata" v-if="!isSearching">
        {{ nodataTips }}
      </div>
      <div class="nodata" v-else>
        {{ $t("class.hasNoSearchResult") }}
      </div>
    </template>
  </div>
</template>

<script>
import dayjs from "dayjs";
import classApi from "@api/class";

export default {
  name: "ClassList",

  props: {
    classList: Array,
    isSearching: Boolean,
    type: String
  },
  computed: {
    nodataTips() {
      return this.type === "creator"
        ? this.$t("class.noCreateClassTips")
        : this.$t("class.noJoinClassTips");
    }
  },
  filters: {
    timeFormat(timestamp) {
      return dayjs(parseInt(timestamp)).format("YYYY/MM/DD HH:mm");
    }
  },
  methods: {
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
      .detail-image {
        width: 30%;
        max-height: 100px;
        min-height: 100px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
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
          .btn-apply {
            color: #0a818c;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
