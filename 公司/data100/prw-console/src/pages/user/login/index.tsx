// import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';
import logo from '@/assets/logo.png';
import contentRightBg from '@/assets/loginBg.png';
import { LoginParamsType, fakeAccountLogin, getCaptchaImage } from '@/services/login';
import Footer from '@/components/Footer';
import defaultSettings from '../../../../config/defaultSettings';
import LoginFrom from './components/Login';
import styles from './style.less';

const { Username, Password, ImgCaptcha, Submit } = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#'));
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  window.location.href = urlParams.href.split(urlParams.pathname)[0] + (redirect || '/');
};

const Login: React.FC<{}> = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [loginAccount, setLoginAccount] = useState<API.LoginAccount>({});
  const [submitting, setSubmitting] = useState(false);
  const [imgCaptchaUrl, setImgCaptchaUrl] = useState<string>('');
  const [uid, setuid] = useState<string>('');

  const { refresh } = useModel('@@initialState');
  const [autoLogin, setAutoLogin] = useState(false);
  const [type, setType] = useState<string>('account');

  const handleCaptchaImage = async () => {
    const { img, uuid } = await getCaptchaImage();
    
    setImgCaptchaUrl(`data:image/gif;base64,${  img}`)
    setuid(uuid)
  };

  const handleSubmit = async (values: LoginParamsType) => {
    if (autoLogin) {
      window.localStorage.setItem('loginAccount', JSON.stringify(values));
    } else {
      window.localStorage.removeItem('loginAccount');
    }
    setSubmitting(true);
    try {
      // 登录
      const { code, msg, token, oldtoken, oldAdminId }: any = await fakeAccountLogin({ ...values, uuid: uid });
      // const { code, msg, token }: any = await fakeAccountLogin({ ...values, uuid: uid });
      if (code === 200) {
        message.success('登录成功！');
        window.localStorage.setItem('authorization', `Bearer ${  token}`);
        // debugger;
        window.localStorage.setItem('oldtoken', oldtoken);
        window.localStorage.setItem('oldAdminId', oldAdminId);
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState({ code, msg });
    } catch (error) {
      handleCaptchaImage();
      console.log('登录失败，请重试！');
    }
    setSubmitting(false);
  };

  useEffect(() => {
    const authorization = window.localStorage.getItem('authorization');
    const localLoginAccount = window.localStorage.getItem('loginAccount');
    if (localLoginAccount) {
      const account = JSON.parse(localLoginAccount);
      delete account.code;
      setAutoLogin(true);
      setLoginAccount(account);
    }
    if (authorization) {
      replaceGoto();
    }
    handleCaptchaImage()
  }, [])

  const { code, msg }: any = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          <img className={styles.contentLogo} src={logo} alt="logo"/>
          <span style={{ color: defaultSettings.primaryColor }}>拼任务</span>后台管理系统
        </div>
        <div className={styles.contentBg}>
          <div className={styles.contentLeft}>
            <div className={styles.top}>
              <div className={styles.header}>账户登录</div>
              <div className={styles.desc}>欢迎登录后台管理系统</div>
            </div>

            <div className={styles.main}>
              <LoginFrom initialValues={loginAccount} activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
                  {code && code !== 200 && type === 'account' && !submitting && (
                    <LoginMessage content={msg} />
                  )}

                  <Username
                    name="username"
                    placeholder="请输入用户名/邮箱"
                    rules={[
                      {
                        required: true,
                        message: '请输入用户名/邮箱!',
                      },
                    ]}
                  />
                  <Password
                    name="password"
                    placeholder="请输入密码"
                    rules={[
                      {
                        required: true,
                        message: '请输入密码！',
                      },
                    ]}
                  />
                  <ImgCaptcha
                    name="code"
                    placeholder="验证码"
                    imgCaptchaUrl={imgCaptchaUrl}
                    onChangeCaptcha={handleCaptchaImage}
                    rules={[
                      {
                        required: true,
                        message: '请输入验证码！',
                      },
                    ]}
                  />
                {/* <Tab key="account" tab="账户密码登录">
                  
                </Tab> */}
                {/* <Tab key="mobile" tab="手机号登录">
                  {status === 'error' && loginType === 'mobile' && !submitting && (
                    <LoginMessage content="验证码错误" />
                  )}
                  <Mobile
                    name="mobile"
                    placeholder="手机号"
                    rules={[
                      {
                        required: true,
                        message: '请输入手机号！',
                      },
                      {
                        pattern: /^1\d{10}$/,
                        message: '手机号格式错误！',
                      },
                    ]}
                  />
                  <Captcha
                    name="captcha"
                    placeholder="验证码"
                    countDown={120}
                    getCaptchaButtonText=""
                    getCaptchaSecondText="秒"
                    rules={[
                      {
                        required: true,
                        message: '请输入验证码！',
                      },
                    ]}
                  />
                </Tab> */}
                <div>
                  <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
                    记住密码
                  </Checkbox>
                  {/* <a
                    style={{
                      float: 'right',
                    }}
                  >
                    忘记密码
                  </a> */}
                </div>
                <Submit loading={submitting}>登录</Submit>
                {/* <div className={styles.other}>
                  其他登录方式
                  <AlipayCircleOutlined className={styles.icon} />
                  <TaobaoCircleOutlined className={styles.icon} />
                  <WeiboCircleOutlined className={styles.icon} />
                  <Link className={styles.register} to="/user/register">
                    注册账户
                  </Link>
                </div> */}
              </LoginFrom>
            </div>
          </div>
          <div className={styles.contentRight}>
            <img src={contentRightBg} alt=""/>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
