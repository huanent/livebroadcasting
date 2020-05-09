<template>
  <div class="person-info-wrap">
    <p>完善个人资料是让别人认识你的第一步</p>
    <el-form
      ref="infoForm"
      :model="infoForm"
      label-width="100px"
      :rules="rules"
      class="mt20"
    >
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="infoForm.nickname" class="w-200"></el-input>
      </el-form-item>
      <el-form-item label="头像" class="img-upload-wrap">
        <el-upload
          action=""
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
      <el-form-item label="常用邮箱" prop="email">
        <el-input v-model="infoForm.email" class="w-320"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="infoForm.tel" class="w-320"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  name: "PersonInfoEdit",
  data() {
    return {
      infoForm: {
        nickname: "",
        email: "",
        tel: ""
      },
      fileList: [],
      rules: {
        nickname: [
          { required: true, message: "require field", trigger: "change" }
        ],
        email: [{ required: true, message: "require field", trigger: "change" }]
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs["infoForm"].validate(valid => {
        if (valid) {
          let formData = new FormData();
          console.log(this.infoForm);
          formData.append("nickname", this.infoForm.nickname);
          formData.append("tel", this.infoForm.tel);
          formData.append("email", this.infoForm.email);
          console.log(this.fileList);
          if (this.fileList[0]) {
            formData.append(
              "files",
              this.fileList[0].raw,
              this.fileList[0].name
            );
          }
          this.axios.post("/user/update", formData).then(res => {
            if (res.success) {
              console.log(res);
            }
          });
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
    }
  }
};
</script>

<style lang="scss" scoped>
.person-info-wrap p {
  line-height: 40px;
  margin-left: 6px;
  font-size: 12px;
  font-family: "宋体";
  color: #ccc;
}
</style>
