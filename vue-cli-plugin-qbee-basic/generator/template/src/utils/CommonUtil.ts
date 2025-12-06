import { Message } from 'qt-element-ui';
export function copyTextToClipBoard(text: string): Promise<any> {
  const textArea = document.createElement('textarea');
  textArea.style.position = 'fixed';
  textArea.style.top = '-10em';
  textArea.style.left = '-10em';
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = '0';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  let result;
  try {
    const successful = document.execCommand('copy');
    result = successful
      ? Promise.resolve()
      : Promise.reject(new Error('exec copy failed'));
  } catch (err) {
    result = Promise.reject(err);
  }
  document.body.removeChild(textArea);

  return result;
}

/**
 * 打开新页面
 * @param url
 */
export function openPage(url: string) {
  if (navigator.userAgent.indexOf('Firefox') > -1) {
    window.open(url);
  } else {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.click();
  }
}

export function generateFormData(data: any) {
  const keys = Object.keys(data);
  const form = document.createElement('form');
  const formData = new FormData(form);
  keys.forEach((key: string) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return formData;
}

export function redirect2Login() {
  if (process.env.NODE_ENV !== 'production') {
    console.error('收到重定向到登陆页请求，获取最新token');
  } else {
    window.location.replace(window.location.origin + '/auth/');
  }
}

export function triggerValidate(initParent: any) {
  let name = '';
  const formComponentName = 'ElForm';
  const formItemComponentName = 'ElFormItem';
  let parent: any = initParent;
  let propName = '';

  while (parent) {
    if (parent) {
      name = (parent.$options as any).name;
    } else {
      break;
    }

    if (name === formItemComponentName) {
      propName = (parent as any).prop;
    }
    if (name === formComponentName) {
      break;
    } else {
      parent = parent.$parent;
    }
  }

  if (parent && name === formComponentName && !!propName) {
    (parent as any).validateField(propName);
  }
}

export function getStringLength(str: string) {
  return str.replace(/[\u0391-\uFFE5]/g, 'aa').length; //先把中文替换成两个字节的英文，在计算长度
}

export function checkStringLength(str: string, length: number) {
  // true 代表超出长度，false代表未超出长度
  return getStringLength(str) > length;
}

export function getStringByLength(str: string, length: number) {
  if (checkStringLength(str, length)) {
    let newStr = '';
    for (let i = 0; i < str.length; i++) {
      if (checkStringLength(newStr + str[i], length - 2)) {
        break;
      } else {
        newStr += str[i];
      }
    }
    return newStr + '...';
  }
  return str;
}

export function copyText(text: string) {
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    Message.success('复制成功');
  } else {
    Message.warning('该浏览器不支持点击复制到粘贴板');
  }
  document.body.removeChild(input);
}

export function findAttributeRecursion(
  dom: HTMLElement | null,
  attribute: string,
  value: string
): boolean {
  if (!dom) {
    return false;
  }
  const temp = dom.getAttribute(attribute);
  if (temp === value) {
    return true;
  } else {
    return findAttributeRecursion(dom.parentElement, attribute, value);
  }
}

export function saveLayout2LocalStorage(layout: string) {
  localStorage.setItem('layout', layout);
}

export function getlayoutFromLocalStorage() {
  return localStorage.getItem('layout') || '';
}
