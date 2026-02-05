import { useSetState } from "ahooks";
import { createModel } from "hox";
import { useHistory } from 'react-router-dom';
const usePermissionModel = () => {
  let access = null;
  const history = useHistory(); 
  console.log(history)
  try {
    access = localStorage.getItem('access') || ''
  } catch {

  }
  // console.log(typeof access, access);
  const { menus, buttons } = access ? JSON.parse(access) : { menus: [], buttons: {} }
  const initParams = { menus, buttons, visible: false };
  const [accessInfo, setState] = useSetState(initParams);
  const set = (params) => { setState(params) };
  const reset = () => setState({ ...initParams });
  return {
    ...accessInfo,
    set,
    reset,
  };
}
usePermissionModel.namespace = 'usePermissionModel' // 这里需要给每一个 model 都添加命名空间标识
export default createModel(usePermissionModel);
