import { useSetState } from "ahooks";
import { createModel } from "hox";

const usePermissionModel = () => {
  const access = localStorage.getItem('access');
  console.log(typeof access, access);
  const { menus, buttons } = access ? JSON.parse(access) : { menus: [], buttons: {} }
  const initParams = { menus, buttons, visible: false };

  const [accessInfo, setState] = useSetState(initParams);

  const set = (params) => {setState(params)};

  const reset = () => setState({ ...initParams });
  return {
    ...accessInfo,
    set,
    reset,
  };
}
usePermissionModel.namespace = 'usePermissionModel' // 这里需要给每一个 model 都添加命名空间标识
export default createModel(usePermissionModel);
