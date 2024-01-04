const removeQuotes = (str) => {
  return str.replace(/['"]+/g, '');
};

module.exports = { removeQuotes };
