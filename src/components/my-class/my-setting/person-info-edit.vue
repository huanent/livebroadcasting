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
      <el-form-item label="常用邮箱" prop="email">
        <el-input v-model="infoForm.email" class="w-320"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="tel">
        <el-input v-model="infoForm.tel" class="w-320"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('infoForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import userApi from "@api/user";
import { mapMutations } from "vuex";
export default {
  name: "PersonInfoEdit",
  props: {
    userInfo: Object
  },
  data() {
    var checkNickName = (rule, value, callback) => {
      var nicknameReg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/g;
      if (!value) {
        return callback(new Error("昵称不能为空"));
      } else if (!nicknameReg.test(value)) {
        return callback(new Error("昵称只能包含汉字、字母或数字"));
      } else {
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      var emailReg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,3})$/g;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      } else if (!emailReg.test(value)) {
        return callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    var checkTel = (rule, value, callback) => {
      var telReg = /^1[3,4,5,7,8]\d{9}$/g;
      if (!value) {
        return callback(new Error("手机号码不能为空"));
      } else {
        if (!telReg.test(value)) {
          return callback(new Error("手机号码格式错误"));
        }
        callback();
      }
    };
    return {
      infoForm: {
        nickname: "",
        email: "",
        tel: ""
      },
      fileList: [],
      rules: {
        nickname: [
          { required: true, validator: checkNickName, trigger: "change" }
        ],
        email: [
          {
            required: true,
            trigger: "change",
            validator: checkEmail
          }
        ],
        tel: [
          {
            required: true,
            validator: checkTel,
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    this.infoForm.nickname = this.userInfo.nickname;
    this.infoForm.tel = this.userInfo.tel;
    this.infoForm.email = this.userInfo.email;
    if (this.userInfo.avatar) {
      this.fileList.push({
        url: "http://livebroadcasting.jinrui.kooboo.site" + this.userInfo.avatar
      });
    }
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
          if (this.fileList[0] && this.fileList[0].raw) {
            formData.append(
              "files",
              this.fileList[0].raw,
              this.fileList[0].name
            );
          }
          userApi.updateInfo(formData).then(res => {
            if (res.data.success) {
              // console.log(res);
              const data = res.data.model;
              this.$emit("update", data);
              // this.fileList = [];
              this.$message.success("修改成功");
              // this.$refs["infoForm"].resetFields();
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
