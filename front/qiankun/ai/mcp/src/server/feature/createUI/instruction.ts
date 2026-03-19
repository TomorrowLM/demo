function normalizePath(filePath: string): string {
	return filePath.replace(/\//g, "\\");
}

type ToolDefinition = {
	name?: string;
	description?: string;
	props?: unknown[];
	requirements?: string[];
};

type PageRequest = {
	source?: string;
	targetPath?: string;
	apiName?: string;
};

type PageDepends = {
	sub?: string;
	requirements?: string[];
};

type PageTools = {
	components?: Record<string, ToolDefinition[]>;
	utils?: ToolDefinition[];
	modal?: ToolDefinition[];
	model?: ToolDefinition[];
};

type PageChild = {
	type?: string;
	name?: string;
	description?: string;
	isComponent?: boolean;
	uiPath?: string;
	targetPath?: string;
	depends?: PageDepends[];
	tools?: PageTools;
};

type PageDefinition = {
	name?: string;
	description?: string;
	uiPath?: string;
	targetPath?: string;
	type?: string;
	requests?: PageRequest[];
	tools?: PageTools;
	depends?: PageDepends[];
	children?: PageChild[];
};

type CreateUiInstructionTask = {
	type: string;
	name: string;
	description: string;
	filePath?: string;
	requirements?: string[];
};

type CreateUiInstruction = {
	tasks: CreateUiInstructionTask[];
	additionalNotes: string[];
};

function getToolName(tool: ToolDefinition): string {
	return tool.name ?? tool.description ?? "未命名工具";
}

function getToolDescription(tool: ToolDefinition): string | undefined {
	return tool.description?.trim() || undefined;
}

function getToolRequirements(tool: ToolDefinition): string[] {
	return (tool.requirements ?? []).map((item) => item.trim()).filter(Boolean);
}

function buildToolRequirementLines(tools?: PageTools): string[] {
	if (!tools) {
		return [];
	}

	const lines: string[] = [];
	const componentEntries = Object.entries(tools.components ?? {}).filter(([, items]) => (items ?? []).length > 0);

	if (componentEntries.length > 0) {
		const componentText = componentEntries
			.map(([groupName, items]) => {
				const itemText = items
					.map((tool) => {
						const name = getToolName(tool);
						const description = getToolDescription(tool);
						return description ? `${name}(${description})` : name;
					})
					.join("、");

				return `${groupName}: ${itemText}`;
			})
			.join("；");

		lines.push(`优先使用以下组件能力：${componentText}`);
	}

	const utilityGroups = [
		{ label: "utils", items: tools.utils },
		{ label: "modal", items: tools.modal },
		{ label: "model", items: tools.model },
	];

	for (const group of utilityGroups) {
		const validItems = (group.items ?? []).filter(Boolean);
		if (validItems.length === 0) {
			continue;
		}

		lines.push(`${group.label} 能力：${validItems.map((tool) => getToolName(tool)).join("、")}`);
	}

	const toolRequirements = [
		...(componentEntries.flatMap(([, items]) => items)),
		...(tools.utils ?? []),
		...(tools.modal ?? []),
		...(tools.model ?? []),
	]
		.flatMap((tool) => getToolRequirements(tool))
		.map((item) => item.trim())
		.filter(Boolean);

	if (toolRequirements.length > 0) {
		lines.push(...toolRequirements.map((item) => `工具约束：${item}`));
	}

	return lines;
}

function buildDependsRequirementLines(depends?: PageDepends[]): string[] {
	if (!depends || depends.length === 0) {
		return [];
	}

	const dependsText = depends
		.map((item) => {
			const actions = (item.requirements ?? []).map((requirement) => requirement.trim()).filter(Boolean);

			const prefix = item.sub?.trim() || "未命名动作";
			return actions.length > 0 ? `${prefix}: ${actions.join("；")}` : prefix;
		})
		.filter(Boolean);

	return dependsText.length > 0 ? [`关联动作与依赖：${dependsText.join("；")}`] : [];
}

function buildChildTask(child: PageChild): CreateUiInstructionTask {
	const requirements = [
		"严格依据对应 UI 图片实现布局和交互结构",
		...(child.type ? [`子节点类型：${child.type}`] : []),
		...buildDependsRequirementLines(child.depends),
		...buildToolRequirementLines(child.tools),
	];

	if (requirements.length === 1) {
		requirements.push("如有与主页面的交互，请保留清晰的组件接口");
	}

	return {
		type: child.isComponent ? "create_component" : "create_child_page",
		name: `创建${child.name ?? "子页面"}`,
		description: child.description ?? `请根据 UI 图片创建 ${child.name ?? "子页面"}`,
		filePath: child.targetPath ? normalizePath(child.targetPath) : undefined,
		requirements,
	};
}

export function buildCreateUiInstruction(page: PageDefinition): CreateUiInstruction {
	const requestApiNames = (page.requests ?? [])
		.map((item) => item.apiName)
		.filter((item): item is string => Boolean(item));

	const tasks: CreateUiInstructionTask[] = [
		{
			type: "create_page",
			name: `创建${page.name ?? "页面"}`,
			description: "请根据页面配置和 UI 图片创建",
			filePath: page.targetPath ? normalizePath(page.targetPath) : undefined,
			requirements: [
				...(page.type ? [`页面类型：${page.type}`] : []),
				"优先依据 page 中的 name、description、tools 和 children 生成页面代码",
				"主页面图片从 page.uiPath 读取，子组件图片从 page.children[].uiPath 读取",
				requestApiNames.length > 0 ? `页面中涉及的 API 函数包括：${requestApiNames.join("、")}` : "如果页面不依赖 API，则不要生成无关请求逻辑",
				...buildDependsRequirementLines(page.depends),
				...buildToolRequirementLines(page.tools),
			],
		},
	];

	for (const child of page.children ?? []) {
		tasks.push(buildChildTask(child));
	}

	return {
		tasks,
		additionalNotes: [
			"create_ui_mcp 不负责生成 API；如 page.requests 存在，必须先执行 create_api_mcp 并回填 apiName。",
			"页面、子组件和弹框都应根据 page.uiPath 和 page.children[].uiPath 生成，而不是凭空补充未声明结构。",
		],
	};
}

export type { PageDefinition };
