<template>
  <div class="login-page">
    <div class="login-form-container">
      <el-form ref="loginForm" :model="loginForm" :rules="rules">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            :placeholder="$t('login.username')"
            @keyup.enter.native="onSubmit('loginForm')"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            :placeholder="$t('login.password')"
            show-password
            @keyup.enter.native="onSubmit('loginForm')"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-select
            v-model="userToken"
            @change="handleChange"
            :placeholder="$t('login.chooseAccount')"
          >
            <el-option
              v-for="item in options"
              :key="item.user"
              :label="item.user"
              :value="item.token"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit('loginForm')">
            {{ $t("login") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      userToken: "",
      options: [
        {
          user: "1",
          token:
            "eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwoZQweKU7MSCgswUJStDEwMDYxNTY0MDiExqRUFmUSpQ3NTU1MjAACpakpkLFrMwtbQ0MDE1gpqSmQ40MyU9zCgi3yvDLzkv3bwwpCLSoyzJsMQvK8jNxNfXPze1KNwsy6jY1cey0MRWqRYAFy8vzw__"
        },
        {
          user: "2",
          token:
            "eJwtzMkKwjAUheF3yVrqbYZO4FLikC6qdqG4ERPjNVhCDSKI725pszzfgf9LDmqfvE1PKkITILNxozZdwBtOHPGl3cV71KRKOQDjgqUwPebjsTeDCyEoQNSAz9EKUZYgWBEraIcmnLJd3WCwOVe521qWSaeX67aRUtXt-XGe080RVHfFFSzI7w8bKS7D"
        },
        {
          user: "3",
          token:
            "eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwsZQweKU7MSCgswUJStDEwMDYxNTY0MDiExqRUFmUSpQ3NTU1MjAACpakpkLFrMwtbQ0MDU1hJqSmQ400zzQPSRGv9Qp0dXcIzXN0t-JsTw7NzXFxMDduDA4PD-I39SlKjDbwsDHxMPCVqkWACBTLsk_"
        },
        {
          user: "4",
          token:
            "eJwtzE0LgkAQxvHvMueQ0dmpEDpoRJcwyqWXY7hbDbUirpURfffEPD6-B-4f0Ks8eNoaYogChFG-xdiykbP0rAb05naqKjEQhwqRFFOI-8e2ldS2c2aOEAdtxPU2HRMRcjRU5NI177zfHdxi4ui9zdLMK420LhOfzht5bBJuaXnNXXHU5jWD7w-8Si9w"
        },
        {
          user: "5",
          token:
            "eJwtzFELgjAUBeD-slfDrt5tiNDjiECISBCkl3CzbkMZNsKI-ntj7fF853A*rG3O*cssrGZlDmwTM2kzexopskj41PbqHGlWFxwAucAC-o1ZHS0muBCiBEjqaYpWScQw5emFbuHzqJxvRqTLNjvhoIa2X7gclYTJVtg-uoNd97OAd3bv1I59fyMCLxc_"
        },
        {
          user: "6",
          token:
            "eJwtzMsKwjAURdF-yVQpN0kTY6EDdSIitGAR7EzIw4uv0AQtiP9uiRmedWB-SLc-FC8zkIqwAsg8bdTmEdFiYpkx6OvZe9SkoiUALwWn8H-M6HEwkwshGEDWiPdkSnLOKWW5gm5qerlolH3vZtJdcITV8rlu401tQ*t1t7G9OwGE0B9Do2ry-QH*UC9q"
        },
        {
          user: "7",
          token:
            "eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwuZQweKU7MSCgswUJStDEwMDYxNTY0MDiExqRUFmUSpQ3NTU1MjAACpakpkLFrMwMzY2NjS0hJqSmQ4008e7MN-Ay7nC0SnU29LHJ7m4qKzU3yLJNSqgwtsiIswv2K00MLkkydQ-vNxWqRYAB8UvuQ__"
        }
      ],
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
  created() {},
  // computed: {
  //   ...mapGetters("account", ["token"]),
  // },
  methods: {
    // 获取store内namespace为account下的mutations方法
    ...mapMutations("account", ["setUserSig", "setAccount"]),
    onSubmit(formName) {
      // console.log(formName);
      // this.$router.push({ name: "Home" });
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
                const token = res.data.token;
                if (token) {
                  this.setToken(res.data.token);
                }
                this.$router.push({ name: "Home" });
              } else {
                this.$message.error(this.$t("login.failedTips"));
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
    },
    handleChange(userSig) {
      const data = this.options.find(ele => ele.token === userSig);
      this.setUserSig(data.token);
      this.setAccount(data.user);
      console.log(this.$store.state.account);
    }
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  .login-form-container {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    padding: 2rem 1.5rem 1rem;
    width: 450px;
    background: $white;
    border-radius: 2px;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
    @media screen and (max-width: 767px) {
      width: 80%;
      max-width: 450px;
    }
    /deep/ .el-input {
      width: 400px;
    }
  }
}
</style>
