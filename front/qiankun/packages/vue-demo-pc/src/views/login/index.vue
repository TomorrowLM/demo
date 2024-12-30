<template>
  <div class="login">
    <div class="form_login">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号" prop="username">
          <el-input type="password" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/index';
import Vue from 'vue';
import { resetRouter } from '@/router';
export default {
  props: {
    msg: String,
  },
  data() {
    return {
      ruleForm: {
        password: '1',
        username: 'admin',
      },
      rules: {
        password: [{ validator: '', trigger: 'blur' }],
        username: [{ validator: '', trigger: 'blur' }],
      },
    };
  },
  methods: {   
    submitForm() {
      console.log(this.$route, 123);
      login(this.ruleForm).then(
        res => {
          console.log(res);
          Vue.ls.set('token', res.token);
          window.localStorage.setItem('token', res.token);
          // resetRouter();
          this.$store.commit('SET_PERMISSION', { type: 'registerRouteFresh', data: true });
          this.$router.push('/');
        },
        err => {
          console.log(err);
          this.$message.error(err.message);
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
