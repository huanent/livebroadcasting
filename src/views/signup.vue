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
          <img v-if="poster.length > 0" :src="poster" width="60" height="60" />
          <el-upload
            v-else
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="onFileSelected"
            :auto-upload="false"
            :multiple="false"
            :with-credentials="true"
            :show-file-list="false"
            accept="image/*"
          >
            <div class="avatar-add" slot="trigger">
              <icon name="add" :size="20" color="#0a818c"></icon>
            </div>
            <!-- <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div> -->
          </el-upload>
        </el-form-item>
        <el-form-item prop="username" :label="$t('signup.username')">
          <el-input v-model="signUpForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" :label="$t('signup.password')">
          <el-input v-model="signUpForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item prop="password" :label="$t('signup.repeatPassword')">
          <el-input
            v-model="signUpForm.repeatPassword"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('signUpForm')">
            {{ $t("login") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      poster: "",
      signUpForm: {
        username: "",
        nickname: "",
        password: "",
        repeatPassword: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t("signup.usernameTips"),
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.signUpForm);
        }
      });
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
      console.log("filelist.length=%s", filelist.length);
      if (file) {
        let reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            this.poster = reader.result;
          },
          false
        );
        reader.readAsDataURL(file.raw);
      }
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
</style>
