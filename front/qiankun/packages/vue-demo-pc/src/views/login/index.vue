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
          console.log(res, 1);
          if (res.code == 200) {
            window.localStorage.setItem('token', res.data);
            this.$store.commit('SET_PERMISSION', { type: 'registerRouteFresh', data: true });
            const currentRouteInfo = this.$store.getters.currentRouteInfo;
            this.$router.push(currentRouteInfo.path || '/');
          } else {
            this.$message.error(res.message);
          }
        },
        err => {
          console.log(err, 'err');
          this.$message.error(err.msg);
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
  height: 100%;
}
</style>
