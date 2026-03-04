const path = require("path");

function normalizePath(value) {
  return value.split(path.sep).join("/");
}

module.exports = {
  hooks: {
    readPackage(pkg, context) {
      const dir = context && context.dir ? normalizePath(context.dir) : "";
      if (dir.endsWith("/packages/react-demo")) {
        pkg.pnpm = pkg.pnpm || {};
        pkg.pnpm.overrides = {
          ...(pkg.pnpm.overrides || {}),
          "@types/react": "17.0.91",
          "@types/react-dom": "17.0.26",
        };
      }
      return pkg;
    },
  },
};
