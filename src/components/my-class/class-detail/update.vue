<template>
  <div>
    <el-form :model="classForm">
      <el-form-item :label="$t('classform.pic')" class="img-upload-wrap">
        <el-upload
          action
          :class="[
            {
              'class-upload': fileList.length > 0 || showUpload
            }
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
      <el-form-item prop="title" :label="$t('classform.title')">
        <el-input v-model="classForm.title"></el-input>
      </el-form-item>
      <el-form-item prop="description" :label="$t('classform.description')">
        <el-input type="textarea" v-model="classForm.description"></el-input>
      </el-form-item>
      <el-form-item prop="startTime" :label="$t('classform.startTime')">
        <div class="block">
          <el-date-picker
            v-model="classForm.startTime"
            type="datetime"
            :placeholder="$t('classform.startTimetips')"
            :editable="false"
            value-format="timestamp"
          >
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item prop="endTime" :label="$t('classform.endTime')">
        <div class="block">
          <el-date-picker
            v-model="classForm.endTime"
            type="datetime"
            :placeholder="$t('classform.endTimetips')"
            :editable="false"
            value-format="timestamp"
          >
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item prop="students" :label="$t('classform.addStudents')">
        <el-select
          v-model="selectedStudents"
          multiple
          filterable
          remote
          reserve-keyword
          :placeholder="$t('classform.keywordsTips')"
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
      <el-button type="primary" @click="updateClass">{{
        $t("classform.submit")
      }}</el-button>
    </div>
  </div>
</template>

<script>
import { updateDataInit, getStudentsList, classUpdate } from "@api/class";
export default {
  name: "ClassUpdate",
  data() {
    return {
      classForm: {
        _id: "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        file: ""
      },
      showUpload: false,
      fileList: [
        {
          url: "",
          name: ""
        }
      ],
      selectedStudents: [],
      studentsList: [],
      loading: false
    };
  },
  props: {
    classId: Number
  },
  watch: {
    classId(newValue) {
      this.dataInit();
    }
  },
  created() {
    this.getStudents();
    (this.classForm = {
      _id: "",
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      file: ""
    }),
      (this.fileList = [
        {
          name: "",
          url: ""
        }
      ]);
    this.dataInit();
  },
  methods: {
    dataInit() {
      updateDataInit(this._props.classId)
        .then(res => {
          if (res.data.success) {
            if (res.data.data[0].students) {
              this.selectedStudents = JSON.parse(res.data.data[0].students);
            } else {
              this.selectedStudents = [];
            }
            this.classForm = res.data.data[0];
            this.fileList[0].url =
              "http://livebroadcasting.jinrui.kooboo.site" +
              res.data.data[0].url;
            this.fileList[0].name = res.data.data[0].pathname;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getStudents() {
      getStudentsList()
        .then(res => {
          if (res.data.success) {
            this.studentsList = res.data.data;
            this.studentsList = this.studentsList.map(item => {
              return { value: `${item}` };
            });
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateClass() {
      const userId = localStorage.getItem("lb_userId");
      var formData = new FormData();
      formData.append("_id", this.classForm._id);
      formData.append("userId", this.classForm.userId);
      formData.append("title", this.classForm.title);
      formData.append("description", this.classForm.description);
      formData.append("startTime", this.classForm.startTime);
      formData.append("endTime", this.classForm.endTime);
      if (this.classForm.file) {
        formData.append(
          "file",
          this.classForm.file.raw,
          this.classForm.file.name
        );
      }
      if (this.selectedStudents) {
        formData.append("students", this.selectedStudents);
      }
      if (this.classForm.startTime >= this.classForm.endTime) {
        this.$message.error("结束时间不得早于开始时间");
        this.classForm.endTime = "";
        return;
      }
      classUpdate(formData)
        .then(res => {
          if (res.data.success) {
            this.$emit("setActivityBtn", false);
            this.$message.success(res.data.message);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleRemove(file, fileList) {
      this.showUpload = false;
      this.fileList = [];
    },
    onFileSelected(file, filelist) {
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
      if (file) {
        let reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            this.showUpload = true;
            this.classForm.file = file;
          },
          false
        );
        reader.readAsDataURL(file.raw);
      }
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.studentsList = this.studentsList.filter(item => {
            return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.studentsList = [];
      }
    }
  }
};
</script>
