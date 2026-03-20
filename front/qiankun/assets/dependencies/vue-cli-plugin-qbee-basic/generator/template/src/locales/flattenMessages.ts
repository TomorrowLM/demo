/**
 * 将嵌套的messages展开为平面的messages
 *
 * @export
 * @param {*} nestedMessages
 * @param {string} [prefix='']
 * @returns {*}
 */
export function flattenMessages(nestedMessages: any, prefix = ''): any {
  return Object.keys(nestedMessages).reduce((messages: any, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}
