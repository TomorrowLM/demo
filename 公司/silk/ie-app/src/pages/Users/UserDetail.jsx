import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Formik, Field, Form } from 'formik'
import {
  styled,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  Checkbox,
  ListItemText
} from '@material-ui/core'

import { TreeView, TreeItem } from '@material-ui/lab'
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon
} from '@material-ui/icons'

import { StaticText, Spin } from '../../components'
import { re } from '../../constants'
import { getStaticText, snackbar } from '../../utils'
import services from '../../services'

const FormItem = styled('div')(({ theme }) => ({
  margin: `${theme.spacing(1.5)}px 0`
}))

const userSchema = {
  email: Yup.string()
    .matches(re.email, getStaticText('page.user.info.form.email.invalid'))
    .required(getStaticText('page.user.info.form.email.required')),
  roleIds: Yup.array().required(
    getStaticText('page.user.info.form.roles.required')
  ),
  status: Yup.mixed().oneOf([0, 1])
}
export default class UserDetail extends PureComponent {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }).isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired
    }).isRequired
  }

  constructor() {
    super()
    this.state = {
      userInfo: {
        email: '',
        status: 1,
        roleIds: []
      },
      roles: [],
      isLoading: false,
      allPermissions: [],
      queryRoleIds: [],
      choosedRolePermCodes: [],
      hasError: false,
      errorMsg: ''
    }
  }

  componentDidMount() {
    this.getRoles()
    if (this.isEditMode) {
      this.getUserInfo()
    }
  }

  componentDidCatch(error) {
    this.setState({
      hasError: true,
      errorMsg: error
    })
  }

  componentWillUnmount() {
    this.setState = () => {}
  }

  get isEditMode() {
    const { match } = this.props
    const { id } = match.params
    return Boolean(id)
  }

  getRoles = async () => {
    this.setState({
      isLoading: true
    })
    const {
      list: roles,
      allPermissions
    } = await services.users.getMerchatRoles()
    this.setState({
      roles,
      isLoading: false,
      allPermissions
    })
    this.getPerms()
  }

  getUserInfo = async (userId) => {
    this.setState({
      isLoading: true
    })
    const { match } = this.props
    const { id = userId } = match.params

    const { email, userRoles, status } = await services.users.getUserById(id)
    const { userInfo } = this.state
    this.setState({
      userInfo: {
        ...userInfo,
        email,
        status,
        roleIds: userRoles.map((userRole) => userRole.roleId)
      },
      isLoading: false,
      queryRoleIds: userRoles.map((userRole) => userRole.roleId)
    })
    this.getPerms()
  }

  getPerms = () => {
    const { queryRoleIds, roles } = this.state
    const choosedRolePermCodes = roles.reduce(
      (choosedRolePermCodes, currentRole) => {
        if (queryRoleIds.includes(currentRole.roleId)) {
          choosedRolePermCodes = choosedRolePermCodes.concat(
            currentRole.rolePermissionCodes
          )
        }
        return choosedRolePermCodes
      },
      []
    )
    this.setState({
      choosedRolePermCodes: [...new Set(choosedRolePermCodes)]
    })
  }

  handleCancel = () => {
    const { history } = this.props
    history.goBack()
  }

  handleSubmit = async (values) => {
    const { match, history } = this.props
    const { id } = match.params

    const service = this.isEditMode
      ? services.users.updateUser
      : services.users.createUser
    const { userId } = await service(values, id)
    if (userId) {
      snackbar.success(
        getStaticText(
          `page.user.info.form.user.${
            this.isEditMode ? 'update' : 'create'
          }.success`
        )
      )
      history.goBack()
    }
  }

  renderTree = (currentPerm) => {
    const { choosedRolePermCodes } = this.state
    const indeterminate =
      currentPerm.children &&
      currentPerm.children.some((childPerm) => {
        return choosedRolePermCodes.includes(childPerm.permCode)
      }) &&
      !currentPerm.children.every((childPerm) => {
        return choosedRolePermCodes.includes(childPerm.permCode)
      })
    const checked = choosedRolePermCodes.includes(currentPerm.permCode)
    const checkboxIcon = (
      <Checkbox indeterminate={indeterminate} checked={checked} disabled />
    )
    return (
      <>
        <TreeItem
          key={currentPerm.permCode}
          label={currentPerm.permName}
          onIconClick={false}
          icon={checkboxIcon}
        >
          {Array.isArray(currentPerm.children)
            ? currentPerm.children.map((node) => this.renderTree(node))
            : null}
        </TreeItem>
      </>
    )
  }

  render() {
    const {
      userInfo,
      isLoading,
      roles,
      allPermissions,
      hasError,
      errorMsg
    } = this.state
    if (hasError) {
      return <h3>{errorMsg.toString()}</h3>
    }
    return (
      <Formik
        validationSchema={Yup.object().shape(userSchema)}
        initialValues={userInfo}
        enableReinitialize
        onSubmit={this.handleSubmit}
      >
        {({ dirty, isValid, isSubmitting, handleSubmit }) => {
          return (
            <Spin isSpinning={isSubmitting || isLoading}>
              <Form onSubmit={handleSubmit}>
                <Field name="email">
                  {({ field, meta }) => {
                    return (
                      <FormItem>
                        <TextField
                          style={{ minWidth: 400 }}
                          label={getStaticText('app.login.email.input.label')}
                          id="email"
                          error={meta.error && meta.touched}
                          helperText={meta.touched && meta.error}
                          disabled={this.isEditMode}
                          {...field}
                        />
                      </FormItem>
                    )
                  }}
                </Field>
                <Field name="status">
                  {({ field }) => {
                    return (
                      <FormItem>
                        <FormControl style={{ minWidth: 400 }}>
                          <InputLabel id="status">
                            {getStaticText('page.user.info.form.status.label')}
                          </InputLabel>
                          <Select labelId="status" id="status" {...field}>
                            {[0, 1].map((val) => (
                              <MenuItem key={val} value={val} selected>
                                {getStaticText('page.users.list.status')[val]}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </FormItem>
                    )
                  }}
                </Field>
                <Field name="roleIds">
                  {({ field, meta }) => {
                    return (
                      <FormItem>
                        <FormControl
                          style={{ minWidth: 400 }}
                          error={meta.error && meta.touched}
                        >
                          <InputLabel id="role-ids">
                            {getStaticText(
                              'page.user.info.form.user.role.label'
                            )}
                          </InputLabel>
                          <Select
                            labelId="role-ids"
                            multiple
                            {...field}
                            renderValue={(selected) => {
                              const roleNames = roles.reduce(
                                (result, currentRole) => {
                                  if (selected.includes(currentRole.roleId))
                                    result.push(currentRole.roleName)
                                  return result
                                },
                                []
                              )
                              return roleNames.join(', ')
                            }}
                            onChange={(e) => {
                              field.onChange(e)
                              this.setState(
                                {
                                  queryRoleIds: e.target.value
                                },
                                () => {
                                  this.getPerms()
                                }
                              )
                            }}
                          >
                            {roles.map((role) => (
                              <MenuItem key={role.roleId} value={role.roleId}>
                                <Checkbox
                                  checked={field.value.includes(role.roleId)}
                                />
                                <ListItemText primary={role.roleName} />
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {meta.touched && meta.error}
                          </FormHelperText>
                        </FormControl>
                      </FormItem>
                    )
                  }}
                </Field>

                {allPermissions.map((currentPermission) => {
                  return (
                    <TreeView
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpanded={[
                        currentPermission.permCode,
                        currentPermission.children.permCode
                      ]}
                      defaultExpandIcon={<ChevronRightIcon />}
                      style={{ flexGrow: 1, maxWidth: 400 }}
                    >
                      {this.renderTree(currentPermission)}
                    </TreeView>
                  )
                })}
                <FormItem>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!(dirty && isValid)}
                    type="submit"
                  >
                    <StaticText langKey="app.common.action.button.save" />
                  </Button>
                  <Button onClick={this.handleCancel}>
                    <StaticText langKey="app.common.action.button.cancel" />
                  </Button>
                </FormItem>
              </Form>
            </Spin>
          )
        }}
      </Formik>
    )
  }
}
