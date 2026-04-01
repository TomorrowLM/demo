import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { baseChildrenRoutes } from '@/router/baseRoutes.js';
import { findRouteByPath } from '@/utils/index';
import styles from './index.module.less';

/**
 * 二级菜单组件，根据当前一级路由 path 展示其 children
 * @param {string} parentPath 一级路由 path
 */
const SubMenu: React.FC<{ parentPath: string }> = ({ parentPath }) => {
  const location = useLocation();
  const parentRoute = findRouteByPath(baseChildrenRoutes, parentPath);
  const children = parentRoute?.children || [];
  if (!children.length) return null;
  return (
    <nav className={styles.submenu}>
      {children.map((item: any) => (
        <NavLink
          key={item.path}
          to={`${parentPath}/${item.path}`}
          className={({ isActive }) =>
            isActive
              ? `${styles.link} ${styles.active}`
              : styles.link
          }
        >
          {item.title || item.name || item.path}
        </NavLink>
      ))}
    </nav>
  );
};

export default SubMenu;
