import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  styled,
  Button,
  Paper,
  Divider,
  Typography,
  TextField,
  Link
} from '@material-ui/core'
import * as Yup from 'yup'
import { Formik, Field, Form } from 'formik'
import { StaticText, Spin } from '../../components'
import { getStaticText, storage, snackbar } from '../../utils'
import services from '../../services'
import { resetUserInfo } from '../../store/actions/users'

const ChangePasswordSchemaShape = {
  oldPassword: Yup.string()
    .max(16, getStaticText('app.form.validate.password.max'))
    .min(6, getStaticText('app.form.validate.password.min'))
    .required(getStaticText('app.form.validate.password.required')),
  newPassword: Yup.string()
    .max(16, getStaticText('app.form.validate.password.max'))
    .min(6, getStaticText('app.form.validate.password.min'))
    .required(getStaticText('app.form.validate.password.required')),
  confirmPassword: Yup.string()
    .max(16, getStaticText('app.form.validate.password.max'))
    .min(6, getStaticText('app.form.validate.password.min'))
    .required(getStaticText('app.form.validate.password.required'))
    .oneOf(
      [Yup.ref('newPassword'), null],
      getStaticText('app.form.validate.password.not.match')
    )
}

const ChangePasswordContainer = styled('div')(({ theme }) => ({
  backgroundImage: `linear-gradient(${theme.palette.primary.main} 50%, ${theme.palette.grey[100]} 50%)`,
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
}))

const ChangePasswordMain = styled(Paper)(({ theme }) => ({
  minWidth: 480,
  padding: theme.spacing(4)
}))

const ChangePasswordHeader = styled(Typography)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  textAlign: 'center'
}))

const FormItem = styled('div')(({ theme }) => ({
  margin: `${theme.spacing(1.5)}px 0`,
  textAlign: 'center'
}))

class ChangePassword extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }).isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      push: PropTypes.func.isRequired
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string
    }).isRequired
  }

  constructor() {
    super()
    this.state = {}
  }

  get isInternal() {
    const { match } = this.props
    const { id } = match.params
    return Boolean(id)
  }

  handleCancel = () => {
    const { history } = this.props
    history.goBack()
  }

  goToLogin = () => {
    const { history } = this.props
    history.push('/login')
  }

  onSubmit = async (values) => {
    const { history } = this.props
    if (this.isInternal) {
      const { errMsg } = await services.users.changePassword(values)
      if (!errMsg) {
        await services.users.logout()
        snackbar.success(getStaticText('app.change.password.success'))
        storage.userInfo.remove()
        resetUserInfo()
        history.push('/login')
      }
    } else {
      const { location } = this.props
      const { search } = location
      const resetToken = new URLSearchParams(search).get('resetToken')
      const { errMsg } = await services.users.resetPassword({
        password: values.newPassword,
        confirmPassword: values.confirmPassword,
        resetToken
      })
      if (!errMsg) {
        snackbar.success(getStaticText('app.reset.password.success'))
        history.push('/login')
      }
    }
  }

  render() {
    const { newPassword, confirmPassword } = ChangePasswordSchemaShape
    const schemaShape = this.isInternal
      ? ChangePasswordSchemaShape
      : { newPassword, confirmPassword }
    const initialValues = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    return (
      <ChangePasswordContainer>
        <ChangePasswordMain elevation={10}>
          <ChangePasswordHeader variant="h5" color="primary">
            <StaticText
              langKey={
                this.isInternal
                  ? 'app.change.password.title'
                  : 'app.reset.password.title'
              }
            />
          </ChangePasswordHeader>
          <Divider />
          {!this.isInternal && (
            <FormItem>
              <StaticText langKey="app.reset.password.description.fromemail" />
            </FormItem>
          )}
          <Formik
            onSubmit={this.onSubmit}
            initialValues={initialValues}
            validationSchema={Yup.object().shape(schemaShape)}
          >
            {({ dirty, isValid, isSubmitting }) => {
              return (
                <Spin isSpinning={isSubmitting}>
                  <Form>
                    {this.isInternal && (
                      <Field name="oldPassword">
                        {({ field, meta }) => {
                          return (
                            <FormItem>
                              <TextField
                                label={getStaticText(
                                  'app.change.password.old.input.label'
                                )}
                                error={meta.error && meta.touched}
                                helperText={meta.touched && meta.error}
                                type="password"
                                fullWidth
                                {...field}
                              />
                            </FormItem>
                          )
                        }}
                      </Field>
                    )}
                    <Field name="newPassword">
                      {({ field, meta }) => {
                        return (
                          <FormItem>
                            <TextField
                              label={getStaticText(
                                'app.change.password.new.input.label'
                              )}
                              error={meta.error && meta.touched}
                              helperText={meta.touched && meta.error}
                              type="password"
                              fullWidth
                              {...field}
                            />
                          </FormItem>
                        )
                      }}
                    </Field>
                    <Field name="confirmPassword">
                      {({ field, meta }) => {
                        return (
                          <FormItem>
                            <TextField
                              label={getStaticText(
                                'app.change.password.confirm.input.label'
                              )}
                              error={meta.error && meta.touched}
                              helperText={meta.touched && meta.error}
                              type="password"
                              fullWidth
                              {...field}
                            />
                          </FormItem>
                        )
                      }}
                    </Field>
                    <FormItem>
                      <Button
                        size="large"
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        disabled={!(dirty && isValid)}
                      >
                        <StaticText langKey="app.common.action.button.save" />
                      </Button>
                    </FormItem>
                    {this.isInternal ? (
                      <FormItem>
                        <Button
                          size="large"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          onClick={this.handleCancel}
                        >
                          <StaticText langKey="app.common.action.button.cancel" />
                        </Button>
                      </FormItem>
                    ) : (
                      <FormItem>
                        <Link onClick={this.goToLogin}>
                          <StaticText langKey="app.login.link.text" />
                        </Link>
                      </FormItem>
                    )}
                  </Form>
                </Spin>
              )
            }}
          </Formik>
        </ChangePasswordMain>
      </ChangePasswordContainer>
    )
  }
}

export default ChangePassword
