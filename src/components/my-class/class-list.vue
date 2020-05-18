<template>
  <div class="classlist">
    <el-row type="flex" v-if="classList.length > 0" class="class-container">
      <div class="class-card" v-for="item in classList" :key="item._id">
        <el-button
          v-if="type === 'creator'"
          @click="handleDelete(item.classId)"
          type="text"
          class="delete-btn"
          title="删除课堂"
          ><i class="el-icon-close"></i
        ></el-button>
        <div class="card-container">
          <div class="detail-image">
            <img :src="$store.state.account.site + item.url" alt="" />
          </div>
          <div class="detail-content">
            <div class="field">
              <span>{{ item.title }}</span>
            </div>
            <div class="field">
              <label>{{ $t("classform.startTime") }}：</label
              ><span>{{ item.startTime | timeFormat }}</span>
            </div>
            <div class="field">
              <label>{{ $t("classform.endTime") }}：</label
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
                >查看详情</router-link
              >
              <span
                v-if="isSearching"
                class="btn-apply"
                @click="handleJoinClass(item.classId)"
                >加入课堂</span
              >
              <router-link
                v-else
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
      <div class="nodata">
        {{ $t("classform.noCreateClassTips") }}
      </div>
    </template>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { classApply, removeClass } from "@api/class";

export default {
  name: "ClassList",

  props: {
    classList: Array,
    isSearching: Boolean,
    type: String
  },
  filters: {
    timeFormat(timestamp) {
      return dayjs(parseInt(timestamp)).format("YYYY/MM/DD HH:mm");
    }
  },
  methods: {
    handleDelete(id) {},
    handleJoinClass(id) {
      classApply(id)
        .then(res => {
          if (res.data.success) {
            this.$message.success("加入课堂成功");
            this.$emit("refresh");
          } else {
            this.$message.error("加入课堂失败");
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
