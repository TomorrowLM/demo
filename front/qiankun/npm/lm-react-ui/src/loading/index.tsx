import React from 'react'
import { Spin } from 'antd'

export interface LoadingProps {
  text?: React.ReactNode
  size?: number
  color?: string
  fullscreen?: boolean
  overlay?: boolean
  vertical?: boolean
  className?: string
  style?: React.CSSProperties
}

const resolveSpinSize = (size: number): 'small' | 'default' | 'large' => {
  if (size <= 20) {
    return 'small'
  }

  if (size >= 40) {
    return 'large'
  }

  return 'default'
}

export const Loading: React.FC<LoadingProps> = ({
  text = '加载中...',
  size = 28,
  color = '#1677ff',
  fullscreen = false,
  overlay = false,
  vertical = true,
  className,
  style,
}) => {
  const spinSize = resolveSpinSize(size)

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: vertical ? 'column' : 'row',
    gap: vertical ? 12 : 10,
    width: '100%',
    height: fullscreen ? '100vh' : '100%',
    minHeight: fullscreen ? '100vh' : 96,
    color: '#475569',
    ...(overlay
      ? {
          position: 'absolute',
          inset: 0,
          zIndex: 9,
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(2px)',
        }
      : null),
    ...(fullscreen
      ? {
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(4px)',
        }
      : null),
    ...style,
  }

  const textStyle: React.CSSProperties = {
    fontSize: 14,
    lineHeight: '22px',
  }

  const spinStyle: React.CSSProperties = {
    color,
    fontSize: size,
    lineHeight: 1,
  }

  if (fullscreen) {
    return (
      <Spin
        fullscreen
        size={spinSize}
        tip={typeof text === 'string' ? text : undefined}
        style={spinStyle}
      />
    )
  }

  return (
    <div className={className} style={wrapperStyle} role="status" aria-live="polite">
      <Spin size={spinSize} style={spinStyle} />
      {text ? <span style={textStyle}>{text}</span> : null}
    </div>
  )
}