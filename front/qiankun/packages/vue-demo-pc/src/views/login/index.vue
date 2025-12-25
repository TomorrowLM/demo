<template>
  <div class="login gradient-bg">
    <!-- 动态渐变背景 -->
    <div class="animated-bg"></div>
    <img :src="bg" alt="" style="width: 0;">
    <!-- 浮动形状 -->
    <div class="floating-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div v-for="i in 50" :key="i" class="star twinkle"></div>

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
import bg from '@lm/shared/assets/images/bg.jpg';

export default {
  props: {
    msg: String,
  },
  data() {
    return {
      bg,
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
  mounted() {
    const style = document.createElement('style');
    let css = '';
    for (let i = 1; i <= 10000; i++) {
      const size = Math.random() * 2 + 1; // 1~3px
      const top = Math.random() * 100; // 0~100%
      const left = Math.random() * 100;
      const duration = (Math.random() * 3 + 1).toFixed(1); // 1~4s
      const drift = (Math.random() * 10 + 15).toFixed(0); // 15~25s
      css += `.star:nth-child(${i}) { --duration:${duration}s; --drift:${drift}s; width:${size}px; height:${size}px; top:${top}%; left:${left}%; }`;
    }
    style.innerHTML = css;
    document.head.appendChild(style);
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
@import './star.scss';

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  // background: url('@lm/shared/assets/images/bg.jpg') no-repeat;
  background-attachment: fixed;
  background-size: cover;
}

/* 动态渐变背景 */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #6a11cb);
  background-size: 400% 400%;
  animation: gradientMove 15s ease infinite;
}

/* 背景动画 */
@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 浮动形状 */
.floating-shapes {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
  filter: blur(40px);
}

.shape-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(45deg, #ff8a00, #e52e71);
  top: -100px;
  left: -100px;
  animation: float1 20s infinite linear;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(45deg, #00c6ff, #0072ff);
  bottom: -100px;
  right: -100px;
  animation: float2 25s infinite linear;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #f9d423, #ff4e50);
  top: 50%;
  left: 80%;
  animation: float3 30s infinite linear;
}

@keyframes float1 {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(300px, 100px) rotate(90deg);
  }
  50% {
    transform: translate(0, 200px) rotate(180deg);
  }
  75% {
    transform: translate(-300px, 100px) rotate(270deg);
  }
}

@keyframes float2 {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(-200px, -150px) rotate(-90deg);
  }
  50% {
    transform: translate(0, -300px) rotate(-180deg);
  }
  75% {
    transform: translate(200px, -150px) rotate(-270deg);
  }
}

@keyframes float3 {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(-400px, 200px) rotate(120deg);
  }
  66% {
    transform: translate(200px, -300px) rotate(240deg);
  }
}
</style>
