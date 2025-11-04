const { getEnvConfig } = require('../scripts/getEnv');
const LM_ENV_CONFIG = getEnvConfig()
module.exports = LM_ENV_CONFIG || {};