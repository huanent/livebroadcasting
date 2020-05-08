<template>
  <div class="signup-page">
    <div class="signup-form">
      <el-form
        ref="signUpForm"
        :model="signUpForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item prop="username" :label="$t('signup.username')">
          <el-input v-model="signUpForm.username"></el-input>
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
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(this.$t("signup.passwordTips"));
      } else if(value.length < 8){
        callback(this.$t("signup.passwordLength"));
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
        username: "",
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
          this.axios
            .post("/user/signup", this.signUpForm)
            .then(res => {
              console.log(res);
              if (res.data.success) {
                // this.$refs.upload.submit();
                this.$message.success(res.data.message);
                // this.$refs[formName].resetFields();
                this.$router.push({ path: "/login" });
              } else {
                this.$refs[formName].resetFields();
                this.$message.error(res.data.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    resetForm: function(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.signup-page {
  width: 100%;
  height: 100%;
  background-color: #212224;
  .signup-form {
    position: absolute;
    top: 30%;
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
