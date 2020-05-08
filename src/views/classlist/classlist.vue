<template>
  <div class="classlist-page">
    <div class="classlist">
      <el-row
        ><el-col :span="24"
          ><div class="page-title">classList</div></el-col
        ></el-row
      >
      <el-row>
        <el-col
          class="class-container"
          :lg="7"
          v-for="(item, index) in classList"
          :key="index"
        >
          <el-card :body-style="{ padding: '0px' }">
            <el-row type="flex" class="card-row">
              <el-col :span="8"
                ><div class="class-img">
                  <img :src="item.classImg" /></div
              ></el-col>
              <el-col :span="16">
                <div class="class-content">
                  <div class="filed">
                    <label>课堂标题：</label><span>{{ item.title }}</span>
                  </div>
                  <div class="filed">
                    <label>开始时间：</label><span>{{ item.startTime }}</span>
                  </div>
                  <div class="filed">
                    <label>结束时间：</label><span>{{ item.endTime }}</span>
                  </div>
                  <div class="filed">
                    <label>创建日期：</label><span>{{ item.createDate }}</span>
                  </div>
                  <div class="filed">
                    <label>课堂描述：</label>
                    <span>{{ item.description }}</span>
                  </div>
                  <div class="buttons bottom clearfix">
                    <el-row>
                      <el-col :span="8"
                        ><el-button
                          type="text"
                          class="button"
                          @click="updateDialog(item.classId)"
                          >编辑</el-button
                        ></el-col
                      >
                      <el-col :span="8"
                        ><el-button
                          type="text"
                          class="button"
                          @click="getDetail(item.classId)"
                          >详情</el-button
                        ></el-col
                      >
                      <el-col :span="8"
                        ><el-button
                          @click="deleteclass(item.classId)"
                          type="text"
                          class="button"
                          >删除</el-button
                        ></el-col
                      >
                    </el-row>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="修改课堂信息" :visible.sync="dialogFormVisible">
      <el-form :model="classForm">
        <el-form-item :label="$t('classform.pic')">
          <el-upload
            action="/api/classform/update"
            :class="[
              {
                'class-upload': avatar.length > 0 || fileList.length > 0
              }
            ]"
            list-type="picture-card"
            ref="upload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="onFileSelected"
            :on-success="uploadSuccess"
            accept="image/*"
            :auto-upload="false"
            :file-list="fileList"
            :data="{ username: classForm.username }"
          >
            <icon name="add" :size="20" color="#0a818c"></icon>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item prop="title" :label="$t('classform.title')">
          <el-input v-model="classForm.title"></el-input>
        </el-form-item>
        <el-form-item prop="description" :label="$t('classform.description')">
          <el-input type="textarea" v-model="classForm.description"></el-input>
        </el-form-item>
        <el-form-item prop="startTime" :label="$t('classform.startTime')">
          <div class="block">
            <el-date-picker
              v-model="classForm.startTime"
              type="datetime"
              placeholder="选择开始时间"
              :editable="false"
              value-format="timestamp"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item prop="endTime" :label="$t('classform.endTime')">
          <div class="block">
            <el-date-picker
              v-model="classForm.endTime"
              type="datetime"
              placeholder="选择结束时间"
              :editable="false"
              value-format="timestamp"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item prop="students" label="添加学生">
          <el-select
            v-model="selectedStudents"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateClass">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { LiveBroadcastService } from "../../core/live-broadcast/live-broadcast-service";
import { removeClassImg } from "../../core/data/data-service";
export default {
  name: "Classlist",
  data() {
    return {
      userId: "",
      classList: [],
      dialogFormVisible: false,
      classForm: {
        _id: "",
        avatar: "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        file: ""
      },
      formLabelWidth: "120px",
      avatar: "",
      fileList: [
        {
          name: "",
          url: ""
        }
      ],
      fullClassImg: "",
      dialogVisible: false,
      dialogImageUrl: "",

      options: [],
      selectedStudents: [],
      studentsList: [],
      loading: false,
      allStudents: ["Alabama", "Alaska", "Arizona", "Arkansas"]
    };
  },
  created() {
    this.userId = window.liveBroadcastService.userId;
    this.dataInit();
    this.getStudents();
  },
  mounted() {},
  methods: {
    deleteclass(index) {
      removeClassImg(index).then(res => {
        this.$confirm("此操作将删除该课堂, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          if (res.data.success) {
            this.dataInit();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        });
      });
    },
    dataInit() {
      this.axios
        .get("/classform/list?createUser=" + this.userId)
        .then(res => {
          if (res.data.success) {
            this.classList = res.data.data;
            this.classList.forEach(element => {
              element.classImg =
                "http://livebroadcasting.jinrui.kooboo.site/__kb/kfile/" +
                element.classImg;
              element.startTime = new Date(
                parseInt(element.startTime)
              ).toLocaleString();
              element.endTime = new Date(
                parseInt(element.endTime)
              ).toLocaleString();
            });
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getStudents() {
      this.axios
        .get("/classform/list?students=true")
        .then(res => {
          if (res.data.success) {
            this.allStudents = res.data.data;
            this.studentsList = this.allStudents.map(item => {
              return { value: `${item}` };
            });
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getDetail(classId) {
      this.$router.push({
        name: "Classdetail",
        params: {
          classId: classId
        }
      });
    },
    updateDialog(classId) {
      this.dialogFormVisible = true;
      (this.classForm = {
        _id: "",
        avatar: "",
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        file: ""
      }),
        (this.fileList = [
          {
            name: "",
            url: ""
          }
        ]);
      this.selectedStudents = [];
      this.axios
        .get("/classform/list?classId=" + classId)
        .then(res => {
          if (res.data.success) {
            // console.log(this.$refs.upload._data.uploadFiles);
            this.classForm = res.data.data[0];
            this.fileList[0].name = res.data.data[0].classImg;
            this.fileList[0].url =
              "http://livebroadcasting.jinrui.kooboo.site/__kb/kfile/" +
              res.data.data[0].classImg;
            this.selectedStudents = res.data.data[0].students.split(",");
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateClass() {
      // const studentArr = this.value.map(item => item.value);
      // console.log(studentArr);
      console.log(this.selectedStudents);
      this.classForm.avatar = `userId\\${window.liveBroadcastService.userId}\\classTitle\\${this.classForm.title}\\${this.fullClassImg}`;
      var formData = new FormData();
      formData.append("avatar", this.classForm.avatar);
      formData.append("_id", this.classForm._id);
      formData.append("title", this.classForm.title);
      formData.append("description", this.classForm.description);
      formData.append("startTime", this.classForm.startTime);
      formData.append("endTime", this.classForm.endTime);
      if (this.classForm.file) {
        formData.append("file", this.classForm.file.raw);
      }
      formData.append("students", this.selectedStudents);
      this.axios
        .post("/classform/update", formData)
        .then(res => {
          if (res.data.success) {
            this.$message.success(res.data.message);
            // this.$refs.upload.submit();
            this.dialogFormVisible = false;
            this.avatar = "";
            this.dataInit();
          } else {
            this.avatar = "";
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadSuccess(response, file, fileList) {
      console.log(response);
      this.classForm.avatar = response.model.fullFilename;
    },
    handleRemove(file, fileList) {
      this.avatar = "";
      this.fileList = [];
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
      if (file) {
        let reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            this.fullClassImg = file.name;
            this.avatar = reader.result;
            console.log(file);
            this.classForm.file = file;
          },
          false
        );
        reader.readAsDataURL(file.raw);
      }
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.studentsList.filter(item => {
            return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.classlist-page {
  width: 100%;
  .classlist {
    height: 600px;
    overflow: auto;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    padding: 2rem 1.5rem 1rem;
    width: 80%;
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
.class-container {
  margin: 0.5rem;
}
.page-title {
  font-size: 5rem;
  text-align: center;
}
.card-row {
  align-items: center;
}
.class-content {
  font-size: 0.7rem;
  height: 100%;
  margin: 1rem;
  .buttons {
    font-size: 0.7rem;
    position: absolute;
    bottom: 0;
    right: 1rem;
  }
  .filed {
    padding: 0 0.5rem;
    margin: 0.5rem 0;
  }
}
.class-img {
  margin: 1rem;
  img {
    width: 100%;
  }
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

/deep/ .el-upload-list__item {
  display: none;
}
/deep/ .class-upload {
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
