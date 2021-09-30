import React, { useState, useEffect } from "react";
import { useHistory, Route } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import services from '../../services'

import { Spin, Alert } from "antd";

// import { storage } from '../../utils'

// import { resetUserInfo } from '../../store/actions/users'

const AuthRoute = (props) => {
  const [isCheckingTokenStatus, setIsCheckingTokenStatus] = useState(true);
  const history = useHistory()
  console.log(history)
  useEffect(()=>{
    setTimeout(()=>{
      setIsCheckingTokenStatus(isCheckingTokenStatus,false);
      history.push('/login')
    },1000)
  })
  // const history = useHistory();
  // const dispatch = useDispatch();
  // const userInfo = useSelector((state) => state.users.userInfo);
  // useEffect(() => {
  //   const redirectToLogin = () => {
  //     storage.userInfo.remove()
  //     dispatch(resetUserInfo())
  //     history.push('/login')
  //   }
  //   if (!userInfo.authToken) {
  //     history.push('/login')
  //   } else {
  //     services.users
  //       .checkTokenStatus()
  //       .then((resp) => {
  //         if (resp.authToken) {
  //           setIsCheckingTokenStatus(false)
  //         } else {
  //           redirectToLogin()
  //         }
  //       })
  //       .catch(() => {
  //         redirectToLogin()
  //       })
  //   }
  // }, [history, dispatch, userInfo.authToken])

  return isCheckingTokenStatus ? (
    <Spin tip="Loading...">
    </Spin>
  ) : (
    <Route {...props} />
  );
};

export default AuthRoute;
