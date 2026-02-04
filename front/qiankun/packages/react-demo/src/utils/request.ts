import { request } from '@lm/shared';
import { message } from 'antd';

class AntdMessageClass {
	messageInstances: Record<string, boolean>;
	constructor() {
		this.messageInstances = {};
	}

	add({ text, type, key }: { text: string; type: 'success' | 'error' | 'info' | 'warning' | 'loading'; key: string }) {
		this.messageInstances[key] = true;
		if (type === 'loading') {
			message.loading({ content: text, key, duration: 0 });
			return;
		}
		const fn = (message as any)[type] || message.info;
		fn({ content: text, key });
	}

	remove({ key }: { key: string }) {
		delete this.messageInstances[key];
		message.destroy(key);
	}

	clear() {
		this.messageInstances = {};
		message.destroy();
	}

	error(text: string) {
		message.error(text);
	}

	success(text: string) {
		message.success(text);
	}

	info(text: string) {
		message.info(text);
	}

	warning(text: string) {
		message.warning(text);
	}

	loading(opts: { content: string; key: string; duration?: number }) {
		this.messageInstances[opts.key] = true;
		message.loading({ content: opts.content, key: opts.key, duration: opts.duration ?? 0 });
	}

	destroy(key?: string) {
		if (key) message.destroy(key);
		else message.destroy();
	}
}

class AntdLoadingClass {
	loadingKey: string;
	constructor() {
		this.loadingKey = 'global-loading';
	}
	start() {
		message.loading({ content: '加载中...', key: this.loadingKey, duration: 0 });
	}
	stop() {
		message.destroy(this.loadingKey);
	}
	add() {
		this.start();
	}
	remove() {
		this.stop();
	}
	clear() {
		this.stop();
	}
}

// 注册 message 和 loading 提供者到 shared 请求工具
try {
	request.setMessageProvider(AntdMessageClass);
	(request as any).setLoadingProvider(AntdLoadingClass);
} catch (err) {
	// 在某些环境下 antd 可能不可用，忽略注册错误
}

export default request;