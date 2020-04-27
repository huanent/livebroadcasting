<template>
  <div class="signup-page">
    <div class="signup-form">
      <el-form
        ref="signUpForm"
        :model="signUpForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item :label="$t('signup.avatar')">
          <el-upload
            action="/api/headImage/upload"
            :class="[
              {
                'head-upload': avatar.length > 0
              }
            ]"
            list-type="picture-card"
            ref="upload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="onFileSelected"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
            accept="image/*"
            :auto-upload="false"
            :data="{ username: signUpForm.username }"
          >
            <icon name="add" :size="20" color="#0a818c"></icon>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item prop="username" :label="$t('signup.username')">
          <el-input v-model="signUpForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="nickname" :label="$t('signup.nickname')">
          <el-input v-model="signUpForm.nickname"></el-input>
        </el-form-item>
        <el-form-item prop="password" :label="$t('signup.password')">
          <el-input v-model="signUpForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item
          prop="repeatPassword"
          :label="$t('signup.repeatPassword')"
        >
          <el-input
            v-model="signUpForm.repeatPassword"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="tel" :label="$t('signup.tel')">
          <el-input v-model="signUpForm.tel"></el-input>
        </el-form-item>
        <el-form-item prop="email" :label="$t('signup.email')">
          <el-input v-model="signUpForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('signUpForm')">
            {{ $t("signup") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Signup",
  data() {
    var validateEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(this.$t("signup.emailTips"));
      }

      if (mailReg.test(value)) {
        callback();
      } else {
        callback(this.$t("signup.emailRightTips"));
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(this.$t("signup.passwordTips"));
      } else {
        if (this.signUpForm.repeatPassword !== "") {
          this.$refs.signUpForm.validateField("validateRepeatPassword");
        }
        callback();
      }
    };
    var validateRepeatPassword = (rule, value, callback) => {
      if (value === "") {
        callback(this.$t("signup.RepeatPasswordTips"));
      } else if (value !== this.signUpForm.password) {
        callback(this.$t("signup.sameTips"));
      } else {
        callback();
      }
    };

    return {
      dialogImageUrl: "",
      dialogVisible: false,
      avatar: "",
      signUpForm: {
        avatar: "",
        username: "",
        nickname: "",
        password: "",
        repeatPassword: "",
        tel: "",
        email: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t("signup.usernameTips"),
            trigger: "change"
          }
        ],
        nickname: [
          {
            required: true,
            message: this.$t("signup.nicknameTips"),
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            validator: validatePassword,
            trigger: "change"
          }
        ],
        repeatPassword: [
          {
            required: true,
            validator: validateRepeatPassword,
            trigger: "change"
          }
        ],
        tel: [
          {
            required: true,
            message: this.$t("signup.telTips"),
            trigger: "change"
          }
        ],
        email: [
          {
            required: true,
            validator: validateEmail,
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadSuccess(response, file, fileList) {
      console.log(response);
      this.signUpForm.avatar = response.model.fullFilename;
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // let formData = new FormData();
          // formData.append("username", this.signUpForm.username);
          // formData.append("nickname", this.signUpForm.nickname);
          // formData.append("password", this.signUpForm.password);
          // formData.append("tel", this.signUpForm.tel);
          // formData.append("email", this.signUpForm.email);
          // formData.append("avatar", this.signUpForm.avatar);
          // console.log(this.signUpForm);
          this.axios
            .post("/user/signup", this.signUpForm)
            .then(res => {
              if (res.data.success) {
                this.$refs.upload.submit();
                this.$message.success(res.data.message);
                // this.$refs[formName].resetFields();
              } else {
                this.$refs.upload.clearFiles();
                this.$refs[formName].resetFields();
                this.avatar = "";
                this.$message.error(res.data.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    handleRemove(file, fileList) {
      this.avatar = "";
    },
    resetForm: function(formName) {
      this.$refs[formName].resetFields();
    },
    onFileSelected(file, filelist) {
      console.log("选择图片");
      this.signUpForm.avatar = `user\\${this.signUpForm.username}\\avatar\\${file.name}`;
      console.log(this.signUpForm.avatar);
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
      console.log("filelist.length=%s", filelist.length);
      if (file) {
        let reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            this.avatar = reader.result;
          },
          false
        );
        reader.readAsDataURL(file.raw);
      }
    },
    beforeUpload(file) {
      console.log("上传前");
      this.signUpForm.avatar = `user\\${this.signUpForm.username}\\avatar\\${file.name}`;
      console.log(this.signUpForm.avatar);
    }
  }
};
</script>

<style lang="scss" scoped>
.signup-page {
  width: 100%;
  .signup-form {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    padding: 2rem 1.5rem 1rem;
    width: 450px;
    background: $white;
    border-radius: 2px;
    border: 1px solid #e7eaed;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
    @media screen and (max-width: 767px) {
      width: 80%;
      max-width: 450px;
    }
  }
}
.avatar-add {
  width: 60px;
  height: 60px;
  border: 2px solid #0a818c;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/ .el-upload-list__item {
  display: none;
}
/deep/ .head-upload {
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
