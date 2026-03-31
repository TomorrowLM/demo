import React from 'react'
import { NavLink, Outlet, useMatches } from 'react-router-dom'
import { baseMenuItems } from '../../router/baseRoutes.js'

type RouteMeta = {
  name?: string
  title?: string
  description?: string
}

const ComPage: React.FC = () => {
  const matches = useMatches();
  const currentMeta = (matches[matches.length - 1]?.handle as { meta?: RouteMeta } | undefined)?.meta
  const menuItems = baseMenuItems.filter((item) => Boolean(item.path)) as Array<{
    path: string
    name?: string
    title?: string
    description?: string
  }>

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100%',
        background: '#f5f7fb',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <aside
        style={{
          width: 240,
          padding: '24px 16px',
          borderRight: '1px solid #e5e7eb',
          background: '#ffffff',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, color: '#1f2937' }}>
          {currentMeta?.title || 'Base'}
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: 13, color: '#6b7280' }}>
          {currentMeta?.description || '展示 base 模块下的示例菜单'}
        </p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'block',
                padding: '12px 14px',
                borderRadius: 12,
                textDecoration: 'none',
                background: isActive ? '#111827' : '#f9fafb',
                color: isActive ? '#ffffff' : '#1f2937',
                border: isActive ? '1px solid #111827' : '1px solid #e5e7eb',
                transition: 'all 0.2s ease',
              })}
            >
              <div style={{ fontSize: 15, fontWeight: 600 }}>{item.title}</div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  color: 'inherit',
                  opacity: 0.72,
                }}
              >
                {item.description}
              </div>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  )
}

export default ComPage