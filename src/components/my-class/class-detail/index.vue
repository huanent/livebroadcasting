<template>
  <div class="main-area">
    <div class="classlist">
      <el-row type="flex" class="detail-container">
        <div class="detail-image">
          <img :src="classInfo.url" alt="" />
        </div>
        <div class="detail-content">
          <div class="detail-title">
            <span>{{ classInfo.title }}</span>
          </div>
          <div>
            <label>{{ $t("classform.startTime") }}：</label
            ><span>{{ classInfo.startTime | timeFormat }}</span>
          </div>
          <div>
            <label>{{ $t("classform.endTime") }}：</label
            ><span>{{ classInfo.endTime | timeFormat }}</span>
          </div>

          <div>
            <label>{{ $t("classform.createTime") }}：</label
            ><span>{{ classInfo.createDate | timeFormat }}</span>
          </div>
        </div>
        <el-button
          v-if="isCreater"
          class="edit-btn"
          type="primary"
          @click="updateDialog(parseInt($route.query.classId))"
          >{{ $t("classform.edit") }}</el-button
        >
      </el-row>
      <div class="class-desc">
        <label>{{ $t("classform.description") }}：</label
        ><span>{{ classInfo.description }}</span>
      </div>
      <div class="class-desc" v-if="isCreater">
        <label>{{ $t("classform.students") }}：</label>
        <span v-for="item in classInfo.students" :key="item._id">
          {{ item.userId }}、
        </span>
      </div>
    </div>
    <el-dialog
      :title="$t('classform.edit')"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <ClassUpdate
        :classInfo="classInfo"
        @updateSuccess="handleRefresh"
      ></ClassUpdate>
    </el-dialog>
  </div>
</template>

<script>
import classApi from "@api/class";
import dayjs from "dayjs";
import ClassUpdate from "./update";
export default {
  name: "ClassDetail",
  components: {
    ClassUpdate
  },
  data() {
    return {
      classInfo: [],
      classId: "",
      dialogFormVisible: false
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
  created() {
    this.getClassInfo();
  },
  methods: {
    handleRefresh() {
      this.getClassInfo();
      this.dialogFormVisible = false;
    },
    updateDialog(classId) {
      this.classId = classId;
      this.dialogFormVisible = true;
    },
    getClassInfo() {
      classApi
        .classGet(this.$route.query.classId)
        .then(res => {
          if (res.data.success) {
            this.classInfo = res.data.model;
            this.classInfo.url =
              "http://livebroadcasting.jinrui.kooboo.site" + this.classInfo.url;
          } else {
            this.$message.error("没有对应的课堂信息");
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
.main-area {
  background-color: #f4f4f4;
  width: 1205px;
  margin: 0 auto;
  .edit-btn {
    height: 2.5rem;
    position: absolute;
    right: 1rem;
    top: 2rem;
  }
}
.classlist {
  width: 100%;
  .detail-container {
    align-items: center;
  }
  .detail-content {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    font-size: 1.2rem;
    overflow: hidden;
  }
  .detail-title {
    font-size: 2.5rem;
    line-height: 3.5rem;
    overflow-wrap: break-word;
    // max-height: 6rem;
    max-width: 40rem;
    // overflow: hidden;
    padding: 1rem;
    margin-right: 5rem;
  }
  .detail-image {
    margin: 2rem;
    width: 30%;
    img {
      height: 200px;
      width: 100%;
      object-fit: cover;
    }
  }
  .class-desc {
    font-size: 1.3rem;
    padding: 1rem;
    overflow-wrap: break-word;
  }
}
</style>
