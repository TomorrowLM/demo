<template>
  <div class="login">
    <div class="form_login">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            type="password"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { axios } from "@/utils/request";
import Vue from "vue";
export default {
  props: {
    msg: String,
  },
  data() {
    return {
      ruleForm: {
        password: "",
        username: "",
      },
      rules: {
        password: [{ validator: "", trigger: "blur" }],
        username: [{ validator: "", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm() {
      console.log(this.$route);
      axios.post("login", this.ruleForm).then((res) => {
        Vue.ls.set("token", res.data.token);
        this.$router.push("/")
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.login {
  width: 100vw;
  height: 100vh;
  background: url(/assets/bg.jpg);
  margin: auto;
  padding-top: 40vh;
  box-sizing: border-box;
}
.form_login {
  width: 400px;
  margin: auto;
}
</style>
