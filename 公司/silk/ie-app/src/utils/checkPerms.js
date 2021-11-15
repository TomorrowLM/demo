import storage from './storage'

const checkPerms = (permissions) => {
  const currentUserPermissions = storage.userInfo.val?.userPermsCode ?? []
  const isAllowed =
    !permissions.length ||
    permissions.some((permission) =>
      currentUserPermissions.includes(permission)
    )
  return isAllowed
}

export default checkPerms
