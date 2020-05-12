<template>
  <div class="login-page">
    <div class="login-form-container">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        :label-position="onTop"
        label-width="80px"
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
          <el-button type="primary" @click="onSubmit('loginForm')">
            {{ $t("login") }}
          </el-button>
          <el-button type="primary" @click="signup">
            {{ $t("signup") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      userToken: "",
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t("login.usernameTips"),
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("login.passwordTips"),
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters("device", ["isMobile"]),
    onTop() {
      return this.isMobile ? "top" : "left";
    }
  },
  methods: {
    ...mapMutations("account", [
      "SET_LB_TOKEN",
      "SET_LB_EXPIRES",
      "SET_TX_USERID"
    ]),
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = new FormData();
          data.append("username", this.loginForm.username);
          data.append("password", this.loginForm.password);
          this.axios
            .post("/login", data)
            .then(res => {
              if (res.data.success) {
                this.$message.success(this.$t("login.successTips"));
                const data = res.data.model;
                this.SET_LB_TOKEN(data.token);
                this.SET_LB_EXPIRES(data.expires);
                this.SET_TX_USERID(data.username);
                this.$router.push({ name: "Classlist" });
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    signup() {
      this.$router.push({ path: "/signup" });
    },
    resetForm: function(formName) {
      this.$refs[formName].resetFields();
    },
    handleChange(userSig) {
      const data = this.options.find(ele => ele.token === userSig);
      this.setUserSig(data.token);
      this.setAccount(data.user);
    }
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100%;
  background-color: #0a1c1e;
  background-image: url(../assets/images/board.jpg);
  background-size: 100%;
  background-repeat: no-repeat;
  .login-form-container {
    position: absolute;
    top: 50%;
    left: 30%;
    transform: translate(-50%, -50%);
    padding: 2rem 1.5rem 1rem;
    width: 450px;
    background: $white;
    border-radius: 4px;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
    @media screen and (max-width: 768px) {
      left: 50%;
    }
    @media screen and (max-width: 767px) {
      width: 80%;
      max-width: 450px;
    }
  }
}
</style>
