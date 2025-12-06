import { flattenMessages } from '../flattenMessages';
import errorText from './error';
import uiText from './ui';

export default {
  ...flattenMessages(uiText),
  ...flattenMessages(errorText)
};
