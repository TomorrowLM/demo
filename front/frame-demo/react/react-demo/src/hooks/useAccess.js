import { useCallback } from "react";
import usePermissionModel from '../hox/access';

const type = ['menu', 'button']

export const useAccess = () => {
  // 获取菜单和按钮的标识
  const { menus, buttons } = usePermissionModel();

  /**
   * 根据权限标识获取权限
   */
  const getPermission = useCallback((permission, type = 'button') => {
    return buttons[permission]
  }, []);

  /**
   * 根据路由地址获取权限
   */
  const getRoute = useCallback((route, data, isFullMatch) => {

  }, []);

  /**
   * 获取展示路由数据
   */
  const getChildMenu = useCallback((parentPermission) => {

  }, []);

  /**
   * 获取最后可跳转的路由地址
   */
  const getLastHopRoute = useCallback((permission, data) => {

  }, []);

  return {
    getPermission,
    getRoute,
    getChildMenu,
    getLastHopRoute
  };
};