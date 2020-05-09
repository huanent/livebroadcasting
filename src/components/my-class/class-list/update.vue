<template>
  <div>
    <el-form :model="classForm">
      <el-form-item :label="$t('classform.pic')">
        <el-upload
          action="/api/classform/update"
          :class="[
            {
              'class-upload': avatar.length > 0 || fileList.length > 0
            }
          ]"
          list-type="picture-card"
          ref="upload"
          :on-remove="handleRemove"
          :on-change="onFileSelected"
          accept="image/*"
          :auto-upload="false"
          :file-list="fileList"
          :data="{ username: classForm.username }"
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
            placeholder="选择开始时间"
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
            placeholder="选择结束时间"
            :editable="false"
            value-format="timestamp"
          >
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item prop="students" label="添加学生">
        <el-select
          v-model="selectedStudents"
          multiple
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="updateClass">修改</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ClassUpdate",
  data() {
    return {
      classForm: {
        _id: "",
        avatar: "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        file: ""
      },
      avatar: "",
      fileList: [
        {
          name: "",
          url: ""
        }
      ],
      fullClassImg: "",
      options: [],
      selectedStudents: [],
      studentsList: [],
      loading: false,
      allStudents: ["Alabama", "Alaska", "Arizona", "Arkansas"]
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
    this.userId = window.liveBroadcastService.userId;
    this.getStudents();
    (this.classForm = {
      _id: "",
      avatar: "",
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
      this.axios
        .get("/classform/list?classId=" + this._props.classId)
        .then(res => {
          if (res.data.success) {
            if (res.data.data[0].students.length > 0) {
              this.selectedStudents = JSON.parse(res.data.data[0].students);
            } else {
              this.selectedStudents = [];
            }
            this.classForm = res.data.data[0];
            this.fileList[0].name = res.data.data[0].classImg;
            this.fileList[0].url =
              "http://livebroadcasting.jinrui.kooboo.site/__kb/kfile/" +
              res.data.data[0].classImg;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getStudents() {
      this.axios
        .get("/classform/list?students=true")
        .then(res => {
          if (res.data.success) {
            this.allStudents = res.data.data;
            this.studentsList = this.allStudents.map(item => {
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
      this.classForm.avatar = `userId\\${window.liveBroadcastService.userId}\\classTitle\\${this.classForm.title}\\${this.fullClassImg}`;
      var formData = new FormData();
      formData.append("avatar", this.classForm.avatar);
      formData.append("_id", this.classForm._id);
      formData.append("title", this.classForm.title);
      formData.append("description", this.classForm.description);
      formData.append("startTime", this.classForm.startTime);
      formData.append("endTime", this.classForm.endTime);
      if (this.classForm.file) {
        formData.append("file", this.classForm.file.raw);
      }
      if (this.selectedStudents) {
        formData.append("students", this.selectedStudents);
      }
      this.axios
        .post("/classform/update", formData)
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
      this.avatar = "";
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
            this.fullClassImg = file.name;
            this.avatar = reader.result;
            console.log(file);
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
          this.options = this.studentsList.filter(item => {
            return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-upload-list__item {
  display: none;
}
/deep/ .class-upload {
  height: 60px;
  /deep/ .el-upload-list__item {
    display: inline-block !important;
  }
  /deep/ .el-upload {
    display: none;
  }
}
/deep/ .el-upload {
  width: 60px;
  height: 60px;
  margin: 0;
  padding: 0;
  svg {
    position: relative;
    left: 0px;
    top: -45px;
  }
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
  width: 60px;
  height: 60px;
}
</style>
