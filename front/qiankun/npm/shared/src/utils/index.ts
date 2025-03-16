// import lodash from "lodash";
// import moment from "moment";
// import service from "./request"
// export default {
//   lodash: lodash,
//   moment,
//   service
// }
const lodash = require('lodash');
const service = require('./request');
const useRequest = require('./useRequest');
module.exports = {
  lodash: lodash,
  service,
  useRequest
}