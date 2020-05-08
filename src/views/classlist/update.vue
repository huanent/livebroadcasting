<template>
  <el-dialog title="修改课堂信息" :visible.sync="dialogFormVisible">
    <el-form :model="classForm">
      <el-form-item :label="$t('classform.pic')">
        <el-upload
          action="/api/classform/update"
          :class="[
            {
              'class-upload': avatar.length > 0
            }
          ]"
          list-type="picture-card"
          ref="upload"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-change="onFileSelected"
          :on-success="uploadSuccess"
          accept="image/*"
          :auto-upload="false"
          :data="{ username: classForm.username }"
        >
          <icon name="add" :size="20" color="#0a818c"></icon>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
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
      <el-form-item prop="title" label="添加学生">
        <el-input v-model="classForm.title"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="updateClass">修改</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "Classlist",
  data() {
    return {
      dialogFormVisible: false,
      classForm: {
        _id: "",
        avatar: "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        file: ""
      },
      formLabelWidth: "120px",
      avatar: "",
      fullClassImg: "",
      dialogVisible: false,
      dialogImageUrl: ""
    };
  },
  created() {
    this.userId = window.liveBroadcastService.userId;
  },
  methods: {
    updateDialog(classId) {
      this.dialogFormVisible = true;
      (this.classForm = {
        _id: "",
        avatar: "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        file: ""
      }),
        this.axios
          .get("/classform/list?classId=" + classId)
          .then(res => {
            if (res.data.success) {
              // console.log(this.$refs.upload._data.uploadFiles);
              this.classForm = res.data.data[0];
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            console.log(err);
          });
    },
    updateClass() {
      var formData = new FormData();
      formData.append("avatar", this.classForm.avatar);
      formData.append("_id", this.classForm._id);
      formData.append("title", this.classForm.title);
      formData.append("description", this.classForm.description);
      formData.append("startTime", this.classForm.startTime);
      formData.append("endTime", this.classForm.endTime);
      formData.append("file", this.classForm.file.raw);
      this.axios
        .post("/classform/update", formData)
        .then(res => {
          if (res.data.success) {
            this.$message.success(res.data.message);
            // this.$refs.upload.submit();
            this.dialogFormVisible = false;
            this.avatar = "";
          } else {
            // this.$refs.upload.clearFiles();
            // this.$refs[formName].resetFields();
            this.avatar = "";
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadSuccess(response, file, fileList) {
      console.log(response);
      this.classForm.avatar = response.model.fullFilename;
    },
    handleRemove(file, fileList) {
      this.avatar = "";
    },
    resetForm: function(formName) {
      this.$refs[formName].resetFields();
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
    }
  }
};
</script>

<style></style>
