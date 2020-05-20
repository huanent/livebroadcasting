<template>
  <el-dialog
    class="detail-dialog"
    :title="$t('class.classDetail')"
    :visible.sync="classDetailVisible"
    :append-to-body="true"
    width="600px"
  >
    <div class="detail-wrap">
      <img :src="classInfo.url" :alt="$t('class.classCover')" />
      <div class="class-detail">
        <h1>{{ classInfo.title }}</h1>
        <div class="detail-item">
          <label>{{ $t("class.startTime") }}：</label>
          <span>{{ classInfo.startTime | timeFormat }}</span>
        </div>
        <div class="detail-item">
          <label>{{ $t("class.endTime") }}：</label>
          <span>{{ classInfo.endTime | timeFormat }}</span>
        </div>
        <div class="detail-item">
          <label>{{ $t("class.createTime") }}：</label>
          <span>{{ classInfo.createDate | timeFormat }}</span>
        </div>
        <div class="detail-item">
          <label>{{ $t("class.description") }}：</label
          ><span>{{ classInfo.description }}</span>
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
      <el-button @click="classDetailVisible = false">关闭</el-button>
      <el-button type="primary" v-if="isCreater" @click="handleEdit">
        {{ $t("button.edit") }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import dayjs from "dayjs";
import ClassEdit from "./class-edit";

export default {
  name: "ClassDetail",
  props: {
    classInfo: Object
  },
  data() {
    return {
      classDetailVisible: false
    };
  },
  computed: {
    isCreater() {
      return localStorage.getItem("lb_userId") === this.classInfo.createUser;
    }
  },
  filters: {
    timeFormat(timestamp) {
      return dayjs(parseInt(timestamp)).format("YYYY/MM/DD HH:mm");
    }
  },
  components: {
    ClassEdit
  },
  methods: {
    handleEdit() {
      this.$emit("handleEdit");
    },
    open() {
      this.classDetailVisible = true;
    },
    close() {
      this.classDetailVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-wrap {
  display: flex;
  img {
    max-width: 150px;
    min-width: 150px;
  }
  .class-detail {
    width: 100%;
    padding-left: 24px;
    .detail-item {
      padding: 2px 0;
      label {
        font-weight: bold;
      }
      span {
        white-space: pre;
      }
    }
  }
}
.detail-dialog /deep/ .el-dialog__body {
  padding: 10px 20px;
}
</style>
