import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { baseChildrenRoutes } from '@/router/baseRoutes.js';
import { findRouteByPath } from '@/utils/index';

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
    <nav style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
      {children.map((item) => (
        <NavLink
          key={item.path}
          to={`${parentPath}/${item.path}`}
          style={({ isActive }) => ({
            padding: '6px 16px',
            borderRadius: 8,
            textDecoration: 'none',
            background: isActive ? '#2563eb' : '#f3f4f6',
            color: isActive ? '#fff' : '#1f2937',
            border: isActive ? '1px solid #2563eb' : '1px solid #e5e7eb',
            fontWeight: 500,
            fontSize: 14,
            transition: 'all 0.2s',
          })}
        >
          {item.title || item.name || item.path}
        </NavLink>
      ))}
    </nav>
  );
};

export default SubMenu;
