import { token } from '@qbee/qbee-common-lib';
// localStorage key = 'qbee-token' 加密 aid = 'qbee'
export const Token = new token.PcToken();

export function getToken() {
  return Token.getToken();
}

export function setToken(value: string) {
  if (value) {
    Token.setToken(value);
  }
}

export function clearToken() {
  Token.clearToken();
}
