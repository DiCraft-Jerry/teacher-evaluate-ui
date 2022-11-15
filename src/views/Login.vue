<template>
  <el-row
    type="flex"
    class="row-bg"
    justify="center"
    style="background-color: rgb(208, 223, 230); ">

  

    <el-col :xl="7" :lg="6" >
      <h2>在线综合评教系统</h2>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        label-width="80px"
        
      >
      
        <el-form-item label="用户名" prop="username" style="width: 380px">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" style="width: 380px">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code" style="width: 380px">
          <el-input
            v-model="loginForm.code"
            style="width: 172px; float: left"
            maxlength="5"
          ></el-input>
          <el-image
            :src="captchaImg"
            class="captchaImg"
            @click="getCaptcha"
          ></el-image>
        </el-form-item>

        <el-form-item style="width: 380px">
          <!-- <el-button round color="#fda4af" class="w-[120px]" type="primary" @click="onRegister" :register="register">注册</el-button> -->
          <el-button
            round
            color="#fda4af"
            class="w-[120px]"
            type="primary"
            @click="submitForm('loginForm')"
            >登录</el-button
          >
          <el-button
            round
            color="#fda4af"
            class="w-[120px]"
            @click="resetForm('loginForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>



    <el-col :xl="6" :lg="7">

      <el-image
        :src="require('@/assets/backimg1.jpg')"
        
      ></el-image>
      <p>关注嘉然，顿顿解馋</p>
    </el-col>


  </el-row>
</template>

<script>
import qs from "qs";
import store from '@/store'
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
        code: "",
        token: "",
        title:"在线综合评教系统"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 5, max: 5, message: "长度为 5 个字符", trigger: "blur" },
        ],
      },
      captchaImg: null,
    };
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/sys/userInfo").then((res) => {
        const userList = res.data.data;
        store.commit("SET_USERINFO", userList);
      });
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post("/login?" + qs.stringify(this.loginForm))
            .then((res) => {
              console.log(res);

              const jwt = res.headers["authorization"];

              this.$store.commit("SET_TOKEN", jwt);
              this.$router.push("/index");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getCaptcha() {
      this.$axios.get("/captcha").then((res) => {
        console.log("/captcha");
        console.log(res);

        this.loginForm.token = res.data.data.token;
        this.captchaImg = res.data.data.captchaImg;
        this.loginForm.code = "";
      });
    },
  },
  created() {
    this.getCaptcha();
  },
};
</script>

<style scoped>
.el-row {
  background-color: #fafafa;
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
}

.el-divider {
  height: 200px;
}

.captchaImg {
  float: left;
  margin-left: 8px;
  border-radius: 4px;
}


</style>