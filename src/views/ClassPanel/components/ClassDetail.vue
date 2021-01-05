<template>
  <el-dialog
    class="detail-dialog"
    :title="$t('class.classDetail')"
    :visible.sync="classDetailVisible"
    :append-to-body="true"
    width="550px"
  >
    <div class="detail-wrap">
      <!-- <img :src="classInfo.url" :alt="$t('class.classCover')" /> -->
      <div class="class-detail">
        <h1>{{ classInfo.title }}</h1>
        <div class="item-wrapper">
          <div class="detail-item">
            <label>{{ $t("class.startTime") }}：</label>
            <span>{{ classInfo.startTime | timeFormat }}</span>
          </div>
          <div class="detail-item">
            <label>{{ $t("class.endTime") }}：</label>
            <span>{{ classInfo.endTime | timeFormat }}</span>
          </div>
        </div>
        <div class="detail-item">
          <label>{{ $t("class.createTime") }}：</label>
          <span>{{ classInfo.createDate | timeFormat }}</span>
        </div>
        <div class="detail-item">
          <label>{{ $t("class.description") }}：</label
          ><span>{{ classInfo.description }}</span>
        </div>
        <div
          class="detail-item file-item-wrapper"
          v-if="classInfo.status === 1 || classInfo.status === 2"
        >
          <label>{{ $t("class.courseFiles") }}：</label>
          <ul class="filelist">
            <li
              v-for="(item, index) in classInfo.files"
              @click="downloadCourseFile(item.url)"
              :key="item._id"
              :href="item.url"
            >
              {{ index + 1 + ".   " + item.filename }}
              <i class="el-icon-download"></i>
            </li>
          </ul>
        </div>
        <div class="detail-item" v-if="isCreater">
          <label>{{ $t("class.students") }}：</label>
          <span v-for="item in classInfo.students" :key="item._id">
            {{ item.userId }}、
          </span>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" v-if="isCreater" @click="handleEdit">
        {{ $t("button.edit") }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "ClassDetail",
  props: {
    classInfo: Object,
  },
  data() {
    return {
      classDetailVisible: false,
    };
  },
  computed: {
    isCreater() {
      return localStorage.getItem("lb_userId") === this.classInfo.createUser;
    },
  },
  filters: {
    timeFormat(timestamp) {
      return dayjs(parseInt(timestamp)).format("YYYY/MM/DD HH:mm");
    },
  },
  methods: {
    handleEdit() {
      this.$emit("handleEdit");
    },
    downloadCourseFile(url) {
      window.open(url, "_blank");
    },
    open() {
      this.classDetailVisible = true;
    },
    close() {
      this.classDetailVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-wrap {
  .class-detail {
    width: 100%;
    padding: 0 20px;
    h1 {
      font-size: 1.25rem;
      font-weight: 400;
      color: #1a1b29;
      margin-bottom: 1rem;
    }
    .item-wrapper {
      display: flex;
      .detail-item {
        margin-right: 40px;
      }
    }
    .detail-item {
      font-size: 0.875rem;
      font-weight: 400;
      color: #1a1b29;
      margin-bottom: 8px;
      .filelist {
        list-style: none;
        li {
          margin-bottom: 4px;
          display: flex;
          align-items: center;
        }
      }
    }
    .file-item-wrapper {
      display: flex;
    }
    .el-icon-download {
      padding-left: 1rem;
      color: #5d5dff;
      font-size: 1rem;
    }
  }
}
</style>
