function normalizePath(filePath: string): string {
	return filePath.replace(/\//g, "\\");
}

type PageRequest = {
	source?: string;
	targetPath?: string;
	apiName?: string;
};

type PageDepends = {
	sub?: string;
	description?: string;
};

type PageTools = {
	components?: Record<string, string[]>;
	utils?: string[];
	modal?: string[];
};

type PageChild = {
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

function buildChildTask(child: PageChild): CreateUiInstructionTask {
	const dependsText = (child.depends ?? [])
		.map((item) => `${item.sub ?? "未命名动作"}: ${item.description ?? ""}`.trim())
		.filter(Boolean)
		.join("；");

	return {
		type: child.isComponent ? "create_component" : "create_child_page",
		name: `创建${child.name ?? "子页面"}`,
		description: child.description ?? `请根据 UI 图片创建 ${child.name ?? "子页面"}`,
		filePath: child.targetPath ? normalizePath(child.targetPath) : undefined,
		requirements: [
			"严格依据对应 UI 图片实现布局和交互结构",
			dependsText ? `与主页面的关联动作：${dependsText}` : "如有与主页面的交互，请保留清晰的组件接口",
		],
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
				"优先依据 page 中的 name、description、tools 和 children 生成页面代码",
				"主页面图片从 page.uiPath 读取，子组件图片从 page.children[].uiPath 读取",
				requestApiNames.length > 0 ? `页面中涉及的 API 函数包括：${requestApiNames.join("、")}` : "如果页面不依赖 API，则不要生成无关请求逻辑",
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
