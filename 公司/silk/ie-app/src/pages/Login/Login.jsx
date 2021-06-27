import React, { useState } from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Formik, Field, Form } from 'formik'
import { connect } from 'react-redux'
import {
  styled,
  Paper,
  Typography,
  TextField,
  Divider,
  Button,
  Link
} from '@material-ui/core'

import { StaticText, Spin } from '../../components'
import { re } from '../../constants'
import { getStaticText, storage, snackbar } from '../../utils'
import services from '../../services'
import { updateUserInfo } from '../../store/actions/users'

const loginSchemaShape = {
  email: Yup.string()
    .matches(re.email, getStaticText('app.form.validate.email.invalid'))
    .required(getStaticText('app.form.validate.email.required')),
  password: Yup.string()
    .max(16, getStaticText('app.form.validate.password.max'))
    .min(6, getStaticText('app.form.validate.password.min'))
    .required(getStaticText('app.form.validate.password.required'))
}

const LoginContainer = styled('div')(({ theme }) => ({
  backgroundImage: `linear-gradient(${theme.palette.primary.main} 50%, ${theme.palette.grey[100]} 50%)`,
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
}))

const LoginHeader = styled(Typography)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  textAlign: 'center'
}))

const LoginMain = styled(Paper)(({ theme }) => ({
  minWidth: 480,
  padding: theme.spacing(4)
}))

const FormItem = styled('div')(({ theme }) => ({
  margin: `${theme.spacing(1.5)}px 0`,
  textAlign: 'center'
}))

const Login = ({ updateUserInfo, history }) => {
  /**
   * mode: enum of [0, 1]
   * 0: Login mode
   * 1: reset password mode
   */
  const [mode, setMode] = useState(0)
  const { email } = loginSchemaShape
  const schemaShape = mode === 0 ? loginSchemaShape : { email }

  const initialValues = {
    email: '',
    password: ''
  }

  return (
    <LoginContainer>
      <LoginMain elevation={10}>
        <LoginHeader variant="h5" color="primary">
          <StaticText
            langKey={
              mode === 0 ? 'app.login.title' : 'app.reset.password.title'
            }
          />
        </LoginHeader>
        <Divider />
        {mode === 1 && (
          <FormItem>
            <StaticText langKey="app.reset.password.description" />
          </FormItem>
        )}
        <Formik
          validationSchema={Yup.object().shape(schemaShape)}
          initialValues={initialValues}
          onSubmit={async (values, { setSubmitting }) => {
            if (mode === 0) {
              const loginInfo = await services.users.login(values)
              const userInfo = await services.users.updateToken({
                authToken: loginInfo.authToken,
                merchantId: loginInfo.merchantList[0].id
              })
              if (userInfo.authToken) {
                storage.userInfo.val = userInfo
                updateUserInfo(userInfo)
                history.push('/')
              } else {
                setSubmitting(false)
              }
            } else {
              await services.users.forgotPassword({
                email: values.email
              })
              snackbar.success(
                getStaticText('app.forgot.password.email.sent.success')
              )
            }
          }}
        >
          {({ dirty, isValid, resetForm, isSubmitting, handleSubmit }) => {
            const handleModeChange = () => {
              const newMode = mode === 0 ? 1 : 0
              setMode(newMode)
              resetForm()
            }

            return (
              <Spin isSpinning={isSubmitting}>
                <Form onSubmit={handleSubmit}>
                  <Field name="email">
                    {({ field, meta }) => {
                      return (
                        <FormItem>
                          <TextField
                            label={getStaticText('app.login.email.input.label')}
                            id="email"
                            fullWidth
                            error={meta.error && meta.touched}
                            helperText={meta.touched && meta.error}
                            {...field}
                          />
                        </FormItem>
                      )
                    }}
                  </Field>
                  {mode === 0 && (
                    <Field name="password">
                      {({ field, meta }) => {
                        return (
                          <FormItem>
                            <TextField
                              label={getStaticText(
                                'app.login.password.input.label'
                              )}
                              id="password"
                              type="password"
                              fullWidth
                              error={meta.error && meta.touched}
                              helperText={meta.touched && meta.error}
                              {...field}
                            />
                          </FormItem>
                        )
                      }}
                    </Field>
                  )}
                  <FormItem>
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={!(dirty && isValid)}
                      type="submit"
                    >
                      <StaticText
                        langKey={
                          mode === 0
                            ? 'app.login.button.text'
                            : 'app.reset.password.button.text'
                        }
                      />
                    </Button>
                  </FormItem>
                  <FormItem>
                    <Link onClick={handleModeChange}>
                      <StaticText
                        langKey={
                          mode === 0
                            ? 'app.reset.password.link.text'
                            : 'app.login.link.text'
                        }
                      />
                    </Link>
                  </FormItem>
                </Form>
              </Spin>
            )
          }}
        </Formik>
      </LoginMain>
    </LoginContainer>
  )
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  updateUserInfo: PropTypes.func.isRequired
}

export default connect(null, { updateUserInfo })(Login)
