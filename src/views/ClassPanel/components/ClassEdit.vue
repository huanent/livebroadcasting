<template>
  <el-dialog
    class="course-detail-dialog"
    :title="$t('class.edit')"
    :visible.sync="editDialogVisible"
    :close-on-click-modal="false"
  >
    <el-form :model="classForm" :label-position="'top'">
      <el-form-item :label="$t('class.pic')" class="img-upload-wrap">
        <el-upload
          action
          :class="[
            {
              'class-upload': fileList.length > 0,
            },
          ]"
          list-type="picture-card"
          ref="upload"
          :on-remove="handleRemove"
          :on-change="onFileSelected"
          accept="image/*"
          :auto-upload="false"
          :file-list="fileList"
        >
          <icon name="add" :size="20" color="#0a818c"></icon>
        </el-upload>
      </el-form-item>
      <el-form-item prop="title" :label="$t('class.title')">
        <el-input v-model="classForm.title" class="title-input"></el-input>
      </el-form-item>
      <el-form-item prop="description" :label="$t('class.description')">
        <el-input type="textarea" v-model="classForm.description"></el-input>
      </el-form-item>
      <div class="class-time-range">
        <el-form-item prop="startTime" :label="$t('class.startTime')">
          <div class="block">
            <el-date-picker
              v-model="classForm.startTime"
              type="datetime"
              :placeholder="$t('class.startTimetips')"
              :editable="false"
              value-format="timestamp"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item prop="endTime" :label="$t('class.endTime')">
          <div class="block">
            <el-date-picker
              v-model="classForm.endTime"
              type="datetime"
              :placeholder="$t('class.endTimetips')"
              :editable="false"
              value-format="timestamp"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </div>
        </el-form-item>
      </div>
      <el-form-item prop="students" :label="$t('class.addStudents')">
        <el-select
          v-model="selectedStudents"
          multiple
          filterable
          remote
          reserve-keyword
          :placeholder="$t('class.keywordsTips')"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in studentsList"
            :key="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">
        {{ $t("button.submit") }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import classApi from "@api/class";

export default {
  name: "ClassEdit",
  data() {
    return {
      editDialogVisible: false,
      classForm: {
        _id: "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
      },
      showUpload: false,
      fileList: [],
      selectedStudents: [],
      studentsList: [],
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
    };
  },
  props: {
    classInfo: Object,
  },
  watch: {
    classId(newValue) {
      this.dataInit();
    },
  },
  methods: {
    init() {
      this.getStudents();
      this.dataInit();
    },
    open() {
      this.editDialogVisible = true;
    },
    close() {
      this.editDialogVisible = false;
    },
    dataInit() {
      this.selectedStudents = [];
      if (this.classInfo.students && this.classInfo.students.length > 0) {
        this.classInfo.students.forEach((element) => {
          this.selectedStudents.push(element.userId);
        });
      }

      this.classForm = {
        _id: this.classInfo._id,
        title: this.classInfo.title,
        description: this.classInfo.description,
        startTime: this.classInfo.startTime,
        endTime: this.classInfo.endTime,
      };
      this.fileList = [
        {
          url: this.classInfo.url,
        },
      ];
    },
    getStudents() {
      classApi
        .getUserList()
        .then((res) => {
          if (res.data.success) {
            this.studentsList = res.data.model.map((item) => {
              return { value: item.username };
            });
            const userId = localStorage.getItem("lb_userId");
            this.studentsList = this.studentsList.filter((ele) => {
              return ele.value !== userId;
            });
          } else {
            this.$message.error(this.$t("class.dataFailed"));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSubmit() {
      if (this.classForm.startTime >= this.classForm.endTime) {
        this.$message.error("结束时间不得早于开始时间");
        this.classForm.endTime = "";
        return;
      }
      const userId = localStorage.getItem("lb_userId");
      var formData = new FormData();
      formData.append("_id", this.classForm._id);
      formData.append("classId", this.classInfo.classId);
      formData.append("userId", userId);
      formData.append("title", this.classForm.title);
      formData.append("description", this.classForm.description);
      formData.append("startTime", this.classForm.startTime);
      formData.append("endTime", this.classForm.endTime);
      if (this.fileList[0] && this.fileList[0].raw) {
        formData.append("files", this.fileList[0].raw, this.fileList[0].name);
      }
      formData.append("students", JSON.stringify(this.selectedStudents));
      classApi.classUpdate(formData).then((res) => {
        if (res.data.success) {
          this.$message.success("课堂信息更新成功");
          this.$emit("success", res.data.model);
        } else {
          this.$message.error("课堂信息更新失败");
        }
      });
    },
    handleRemove(file, fileList) {
      this.fileList = [];
    },
    onFileSelected(file, fileList) {
      const isIMAGE =
        file.raw.type === "image/jpeg" || file.raw.type === "image/png";
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isIMAGE) {
        this.$message.error("只能上传jpg/png图片!");
        return false;
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
        return false;
      }
      this.fileList.push(file);
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.studentsList = this.studentsList.filter((item) => {
            return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
          this.loading = false;
        }, 200);
      } else {
        this.studentsList = [];
      }
    },
  },
};
</script>
