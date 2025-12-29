import utils, { request, location } from "./utils";
export * from "./config/init"
export { request, location };

const $shared = {
  utils,
};

export default $shared;