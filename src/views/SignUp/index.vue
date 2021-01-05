<template>
  <div class="signup-page">
    <div class="container">
      <div class="logo">
        <img src="@/assets/images/logo@2x.png" />
      </div>
      <div class="form-wrapper">
        <div class="signup-form">
          <div class="title">
            {{ $t("注册") }}
          </div>
          <el-form
            ref="signUpForm"
            :model="signUpForm"
            :rules="rules"
            :label-position="onTop"
            status-icon="true"
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
              <div class="signup-btn-wrap">
                <el-button class="login-btn" type="primary" @click="onSubmit">{{
                  $t("signup")
                }}</el-button>
                <router-link class="sign-up-btn" tag="span" :to="{ name: 'Login' }">{{
                  $t("signup.signupedTip")
                }}</router-link>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import userApi from "@api/user";

export default {
  name: "SignUp",
  data() {
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(this.$t("signup.passwordTips"));
      } else if (value.length < 8) {
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
        repeatPassword: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t("signup.usernameTips"),
            trigger: "change",
          },
        ],
        password: [
          {
            required: true,
            validator: validatePassword,
            trigger: "change",
          },
        ],
        repeatPassword: [
          {
            required: true,
            validator: validateRepeatPassword,
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState("device", ["isMobile"]),
    onTop() {
      return "top"
    },
  },
  methods: {
    onSubmit(formName) {
      this.$refs["signUpForm"].validate((valid) => {
        if (valid) {
          userApi
            .signup(this.signUpForm)
            .then((res) => {
              if (res.data.success) {
                this.$message.success(this.$t("signup.signupSuccess"));
                this.$router.push({ path: "/login" });
              } else {
                if (res.data.code === 1) {
                  this.$message.error(this.$t("signup.signupFailedByPassword"));
                } else if (res.data.code === 2) {
                  this.$message.error(this.$t("signup.signupFailedByRepeated"));
                } else {
                  this.$message.error(this.$t("signup.signupFailed"));
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.signup-page {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  .container {
    max-width: 1370px;
    margin: 0 auto;
    padding-top: 40px;
    @media screen and (min-width: 768px) {
      padding-left: 90px;
    }
  }
  .form-wrapper {
    background: url(../../assets/images/board.jpg) no-repeat right center;
    background-size: 764px 613px;
  }
  .signup-form {
    max-width: 350px;
  }
  .title {
    font-size: 3.75rem;
    font-weight: 700;
    color: #1a1b29;
    margin-bottom: 13%;
  }
  .logo {
    max-width: 256px;
    margin-bottom: 6rem;
    img {
      max-width: 100%;
      width: 100%;
    }
  }
  .signup-form /deep/ {
    .el-form-item__label {
      font-size: 1.25rem;
      font-weight: 400;
      color: #8a8a99;
      padding-bottom: 1rem;
      line-height: 1.625rem;
      &::before {
        display: none;
      }
    }
    .el-input__inner {
      height: 3.3125rem;
      line-height: 3.3125rem;
      background: #ffffff;
      border: 1px solid #d0cfe6;
      border-radius: 4px;
    }
    .el-form-item__error {
      left: 100%;
      top: 50%;
      margin-left: 2.5rem;
      transform: translateY(-65%);
      width: 100%;
      font-size: 1rem;
      font-weight: 400;
      color: #1a1b29;
      padding-top: 0;
    }
    .el-input__validateIcon {
      position: absolute;
      left: 100%;
      margin-left: 1rem;
      font-size: 1.25rem;
      &.el-icon-circle-close:before {
        color: #ff331f;
        content:'\e79d';
      }
      &.el-icon-circle-check:before {
        color: #13ce66;
        content: '\e79c';
      }
    }
    .login-btn {
      width: 100%;
      font-size: 1rem;
      font-weight: 700;
      padding-top: 0;
      padding-bottom: 0;
      height: 3.3125rem;
      line-height: 3.3125rem;
      margin-bottom: 1rem;
    }
    .sign-up-btn {
      font-size: 1rem;
      font-weight: 400;
      padding: 0;
      margin-left: 0;
      color: #506efa;
    }
    .el-form-item {
      margin-bottom: 2.5rem;
    }
  }
}
</style>
