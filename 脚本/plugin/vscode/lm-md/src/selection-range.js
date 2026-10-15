function mergeSourceRanges(ranges) {
  const valid = (Array.isArray(ranges) ? ranges : [])
    .filter((range) => range && Number.isInteger(range.startLine))
    .filter((range) => Number.isInteger(range.endLine))
    .filter((range) => range.startLine >= 1 && range.endLine >= range.startLine);

  if (valid.length === 0) return null;

  return {
    startLine: Math.min(...valid.map((range) => range.startLine)),
    endLine: Math.max(...valid.map((range) => range.endLine)),
  };
}

module.exports = { mergeSourceRanges };
