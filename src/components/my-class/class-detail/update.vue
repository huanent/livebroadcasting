<template>
  <div>
    <el-form :model="classForm">
      <el-form-item :label="$t('classform.pic')" class="img-upload-wrap">
        <el-upload
          action
          :class="[
            {
              'class-upload': fileList.length > 0
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
      <el-button type="primary" @click="handleSubmit">
        {{ $t("classform.submit") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { getUserList, classUpdate } from "@api/class";
export default {
  name: "ClassUpdate",
  data() {
    return {
      classForm: {
        _id: "",
        title: "",
        description: "",
        startTime: "",
        endTime: ""
      },
      showUpload: false,
      fileList: [],
      selectedStudents: [],
      studentsList: [],
      loading: false
    };
  },
  props: {
    classInfo: Object
  },
  watch: {
    classId(newValue) {
      this.dataInit();
    }
  },
  created() {
    this.getStudents();
    this.dataInit();
  },
  methods: {
    dataInit() {
      this.classInfo.students.forEach(element => {
        this.selectedStudents.push(element.userId);
      });
      this.classForm = {
        _id: this.classInfo._id,
        title: this.classInfo.title,
        description: this.classInfo.description,
        startTime: this.classInfo.startTime,
        endTime: this.classInfo.endTime
      };
      this.fileList = [
        {
          url: this.classInfo.url
        }
      ];
    },
    getStudents() {
      getUserList()
        .then(res => {
          if (res.data.success) {
            this.studentsList = res.data.model.map(item => {
              return { value: item.username };
            });
            const userId = localStorage.getItem("lb_userId");
            this.studentsList = this.studentsList.filter(ele => {
              return ele.value !== userId;
            });
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
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
      classUpdate(formData).then(res => {
        if (res.data.success) {
          this.$message.success("课堂信息更新成功");
          this.$emit("updateSuccess");
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
          this.studentsList = this.studentsList.filter(item => {
            return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
          this.loading = false;
        }, 200);
      } else {
        this.studentsList = [];
      }
    }
  }
};
</script>
