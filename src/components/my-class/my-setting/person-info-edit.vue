<template>
  <div>
    <h2>基本信息</h2>
    <el-form ref="infoForm" :model="infoForm" label-width="80px" :rules="rules">
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="infoForm.nickname" class="w-200"></el-input>
      </el-form-item>
      <el-form-item label="头像" class="img-upload-wrap">
        <el-upload
          action
          :class="[
            {
              'class-upload': avatar.length > 0 || fileList.length > 0
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
        <el-button type="primary" @click="onSubmit('infoForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "PersonInfoEdit",
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
      var emailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,3})$/g;
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
      console.log(1);
      if (!value) {
        return callback(new Error("手机号码不能为空"));
      } else if (!telReg.test(value)) {
        return callback(new Error("手机号码格式错误"));
      } else {
        callback();
      }
    };
    return {
      infoForm: {
        nickname: "",
        file: "",
        email: "",
        tel: ""
      },
      avatar: "",
      fileList: [
        {
          name: "",
          url: ""
        }
      ],
      rules: {
        nickname: [
          { required: true, validator: checkNickName, trigger: "change" }
        ],
        email: [
          {
            required: true,
            trigger: "change",
            validator: checkEmail,
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
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.infoForm);
          console.log("submit!");
        }
      });
      // console.log("submit!");
    },
    handleRemove(file, fileList) {
      this.avatar = "";
      this.fileList = [];
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
      if (file) {
        let reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            this.fullClassImg = file.name;
            this.avatar = reader.result;
            console.log(file);
            this.infoForm.file = file;
          },
          false
        );
        reader.readAsDataURL(file.raw);
      }
    }
  }
};
</script>
