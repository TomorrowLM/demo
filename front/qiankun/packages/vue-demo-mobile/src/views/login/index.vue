<template>
  <div class="form_login">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="0.6rem"
      class="demo-ruleForm"
    >
      <el-form-item
        label="账号"
        prop="username"
      >
        <el-input
          v-model="ruleForm.username"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <div class="flex flex-center">
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >
          提交
        </el-button>
        <el-button @click="resetForm('ruleForm')">
          重置
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue'

import { Notify } from 'vant'

import { login } from '@/api'
export default {
  props: {

  },

  data () {
    return {
      name: '123',
      ruleForm: {
        password: '',
        username: ''
      },
      rules: {
        password: [{ validator: '', trigger: 'blur' }],
        username: [{ validator: '', trigger: 'blur' }]
      }
    }
  },
  beforeCreate () {
    console.log('beforeCreate', this.name, 123)
  },
  methods: {
    submitForm () {
      console.log(this.$route, 123)
      login(this.ruleForm).then((res) => {
        Vue.ls.set('token', res.token)
        if (res.code == 200) {
          this.$router.push('/learn')
        } else {
          Notify({ type: 'danger', message: res.message })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.form_login {
  width: 100vw;
  height: 100vh;
  background: url(../../assets/bg.jpg) snow -200px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;

  ::v-deep(.el-form) {
    .el-form-item__label {
      color: #fff;
    }

    .el-form-item__content {
      display: flex;
    }

    .el-form-item__content {
      margin-left: 0.2rem !important;
    }
  }
}
</style>
