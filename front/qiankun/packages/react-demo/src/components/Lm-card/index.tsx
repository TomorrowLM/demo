import React, { useState } from 'react'
import { Card, CardProps } from 'antd'

type LmCardType = 'theory' | 'demo' | 'info' | 'warning' | 'success'

export interface LmCardProps extends CardProps {
	/** 控制左侧图标类型 */
	type?: LmCardType
	/** 是否可折叠 */
	collapsible?: boolean
	/** 初始是否收起 */
	defaultCollapsed?: boolean
}

const typeIconMap: Record<LmCardType, React.ReactNode> = {
	theory: '📘',
	demo: '🧪',
	info: 'ℹ️',
	warning: '⚠️',
	success: '✅',
}

const LmCard: React.FC<LmCardProps> = (props) => {
	const {
		type,
		title,
		collapsible = false,
		defaultCollapsed = false,
		extra,
		children,
		...rest
	} = props

	const [collapsed, setCollapsed] = useState(defaultCollapsed)

	const icon = type ? typeIconMap[type] : null

	const renderedTitle = (
		<span>
			{icon && <span style={{ marginRight: 4 }}>{icon}</span>}
			{title}
		</span>
	)

	const renderedExtra = collapsible ? (
		<a
			onClick={(e) => {
				e.preventDefault()
				setCollapsed((v) => !v)
			}}
		>
			{collapsed ? '展开' : '收起'}
		</a>
	) : (
		extra
	)

	return (
		<Card title={renderedTitle} extra={renderedExtra} {...rest}>
			{!collapsed && children}
		</Card>
	)
}

export default LmCard

