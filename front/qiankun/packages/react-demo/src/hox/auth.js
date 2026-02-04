import { useSetState } from "ahooks";
import { createModel } from "hox";

const useAuthModel = () => {
  const [state, setState] = useSetState(() => {
    let token = "";
    try {
      token = window.localStorage.getItem("token") || "";
    } catch (e) {
      token = "";
    }
    return {
      token,
      userInfo: null,
    };
  });

  const setToken = (token) => {
    try {
      if (token) {
        window.localStorage.setItem("token", token);
      } else {
        window.localStorage.removeItem("token");
      }
    } catch (e) {
      // ignore
    }
    setState({ token });
  };

  const setUserInfo = (userInfo) => {
    setState({ userInfo });
  };

  const reset = () => {
    setToken("");
    setUserInfo(null);
  };

  return {
    ...state,
    setToken,
    setUserInfo,
    reset,
  };
};

useAuthModel.namespace = "useAuthModel";

export default createModel(useAuthModel);
