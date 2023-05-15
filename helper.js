function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage];
}

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

function isValidId(id) {
  if (!id || isNaN(id)) return false;
  return true;
}

function jsonOutput() {}

module.exports = { getOffset, emptyOrRows, isValidId };
