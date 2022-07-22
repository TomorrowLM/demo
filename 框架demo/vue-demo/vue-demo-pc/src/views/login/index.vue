<template>
  <div class="login">
    <div class="form_login">
      <a-form id="coordinated" :form="form" @submit="handleSubmit">
        <a-form-item label="username">
          <a-input v-decorator="[
              'username',
              {
                rules: [{ required: true, message: 'Please input your note!' }],
              },
            ]" />
        </a-form-item>
        <a-form-item label="password">
          <a-input v-decorator="[
              'password',
              {
                rules: [{ required: true, message: 'Please input your note!' }],
              },
            ]" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit"> Submit </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang='ts'>
import { login } from "@/api";
import { defineComponent, reactive, ref } from "vue";
import { Vue, Component, Watch } from "vue-property-decorator";

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

@Component
export default class Login extends Vue {
  [x: string]: any;
  formState = reactive<FormState>({
    username: "limng",
    password: "1",
    remember: true,
  });

  data() {
    return {
      form: this.$form.createForm(this, { name: "form_rule" }),
    };
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.form.getFieldsValue();
    console.log(this.form.getFieldsValue());
    login(this.form.getFieldsValue()).then((res: any) => {
      this.$ls.set("token", res.token);
      this.$router.push("/");
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.login {
  width: 100vw;
  height: 100vh;
  // background: url(../../assets/bg.jpg) snow -200px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form_login {
  text-align: center;
  display: flex;
  justify-content: center;
  margin-left: -120px;
}
.el-form-item__label {
  color: #fff;
}
</style>
