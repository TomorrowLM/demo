<template>
  <div class="login">
    <div class="form_login">
      <!-- <img :src="bg" alt="" /> -->
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
      <div>
        <el-collapse>
          <el-collapse-item title="各个权限控制对应账号/密码" name="1">
            <div>admin/1</div>
            <div>liming/1</div>
            <div>third/1</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/index';
// import bg from '@lm/shared/assets/images/bg.jpg';

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
            this.$router.push(currentRouteInfo?.path || '/');
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
  background: url('@lm/shared/assets/images/bg.png') no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
</style>
