<template>
  <div class="login-page">
    <div class="container">
      <div class="logo">
        <img src="@/assets/images/logo@2x.png" />
      </div>
      <div class="form-wrapper">
        <div class="form-container">
          <div class="title">
            {{ $t("登录") }}
          </div>
          <el-form
            class="login-form"
            ref="loginForm"
            :model="loginForm"
            :rules="rules"
            :label-position="onTop"
            status-icon="true"
          >
            <el-form-item prop="username" :label="$t('login.username')">
              <el-input
                v-model="loginForm.username"
                @keyup.enter.native="onSubmit('loginForm')"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password" :label="$t('login.password')">
              <el-input
                v-model="loginForm.password"
                show-password
                @keyup.enter.native="onSubmit('loginForm')"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                class="login-btn"
                type="primary"
                :loading="showLoading"
                @click="onSubmit('loginForm')"
              >
                {{ showLoading ? $t("login.logining") : $t("login") }}
              </el-button>
              <el-button class="sign-up-btn" type="text" @click="signup">
                {{ $t("signup.noAccount") }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userApi from "@api/user";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      userToken: "",
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t("login.usernameTips"),
            trigger: "change",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("login.passwordTips"),
            trigger: "change",
          },
        ],
      },
      showLoading: false,
    };
  },
  computed: {
    ...mapState("device", ["isMobile"]),
    onTop() {
      // return this.isMobile ? "top" : "left";
      return "top";
    },
  },
  methods: {
    ...mapMutations("account", [
      "SET_LB_TOKEN",
      "SET_LB_EXPIRES",
      "SET_TX_USERID",
      "SET_USER_INFO",
    ]),
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = new FormData();
          data.append("username", this.loginForm.username);
          data.append("password", this.loginForm.password);

          this.showLoading = true;
          userApi
            .login(data)
            .then((res) => {
              if (res.data.success) {
                this.$message.success(this.$t("login.successTips"));
                const data = res.data.model;
                this.SET_LB_TOKEN(data._id);
                this.SET_LB_EXPIRES(data.expires);
                this.SET_TX_USERID(data.username);

                this.SET_USER_INFO(data);
                this.$router.push({ name: "Classlist" });
                this.showLoading = false;
              } else {
                this.$message.error(this.$t("login.failedTips"));
                this.endLoading();
              }
            })
            .catch((err) => {
              console.log(err);
              this.endLoading();
            });
        }
      });
    },
    signup() {
      this.$router.push({ path: "/signup" });
    },
    resetForm: function (formName) {
      this.$refs[formName].resetFields();
    },
    endLoading() {
      setTimeout(() => {
        this.showLoading = false;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.login-page {
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
    @media screen and (max-width: 767px) {
      padding: 1rem;
    }
  }
  .form-wrapper {
    background: url(../../assets/images/board.jpg) no-repeat right center;
    background-size: 60%;
    @media screen and (max-width: 767px) {
      background: none;
    }
  }
  .form-container {
    max-width: 350px;
    @media screen and (max-width: 767px) {
      width: 80%;
      margin: 0 auto;
    }
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
    @media screen and (max-width: 767px) {
      margin-bottom: 2rem;
    }
    img {
      max-width: 100%;
      width: 100%;
    }
  }
  .login-form /deep/ {
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
    @media screen and (min-width: 767px) {
      .el-form-item__error {
        left: 100%;
        top: 50%;
        margin-left: 2.5rem;
        transform: translateY(-65%);
        width: 100%;
        color: #1a1b29;
      }
      .el-input__validateIcon {
        position: absolute;
        left: 100%;
      }
    }
    .el-form-item__error {
      font-size: 1rem;
      font-weight: 400;
      color: #ff331f;
    }
    .el-input__validateIcon {
      margin-left: 1rem;
      font-size: 1.25rem;
      &.el-icon-circle-close:before {
        color: #ff331f;
        content: "\e79d";
      }
      &.el-icon-circle-check:before {
        color: #13ce66;
        content: "\e79c";
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
    }
    .el-form-item {
      margin-bottom: 2.5rem;
    }
  }
}
</style>
