<template>
  <div class="signup-page">
    <div class="signup-form">
      <el-form
        ref="signUpForm"
        :model="signUpForm"
        :rules="rules"
        :label-position="onTop"
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
          <div class="signup-btn-wrap">
            <el-button type="primary" @click="onSubmit">{{
              $t("signup")
            }}</el-button>
            <router-link tag="span" :to="{ name: 'Login' }">{{
              $t("signup.signupedTip")
            }}</router-link>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import userApi from "@api/user";

export default {
  name: "Signup",
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
  computed: {
    ...mapState("device", ["isMobile"]),
    onTop() {
      return this.isMobile ? "top" : "left";
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs["signUpForm"].validate(valid => {
        if (valid) {
          userApi
            .signup(this.signUpForm)
            .then(res => {
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
            .catch(err => {
              console.log(err);
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.signup-page {
  width: 100%;
  height: 100%;
  background-color: #0a1c1e;
  background-image: url(../assets/images/board.jpg);
  background-size: 100%;
  background-repeat: no-repeat;
  .signup-form {
    position: absolute;
    top: 50%;
    left: 30%;
    transform: translate(-50%, -50%);
    padding: 2rem 1.5rem 1rem;
    width: 450px;
    background: $white;
    border-radius: 2px;
    border: 1px solid #e7eaed;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
    @media screen and (max-width: 768px) {
      left: 50%;
    }
    @media screen and (max-width: 767px) {
      width: 80%;
      max-width: 450px;
    }
    .signup-btn-wrap {
      cursor: pointer;
      font-size: 12px;
      color: rgb(175, 173, 173);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
