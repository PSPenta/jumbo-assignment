/**
 * Pass Object Or Array Or String Or Number and find if it is empty or not,
 * Null Or Undefined also gives false
 *
 * @param  {Any} data data to be checked against
 * @param  {function} cb callback
 *
 * @return {Any} data which is given if it exists or False
 */
exports.checkIfDataExists = (data) => {
  let flagDataExists;
  if (data === 0 ? '0' : data) {
    switch (data.constructor) {
    case Object:
      flagDataExists = !!Object.keys(data).length;
      break;

    case Array:
      flagDataExists = !!data.length;
      break;

    default:
      flagDataExists = true;
      break;
    }

    if (flagDataExists) {
      return true;
    }
    return false;
  }
  return false;
};

/**
 * Creates formatted response.
 *
 * @param {String} errMsg
 * @param {Boolean} successStatus
 * @param {Array or Object} data
 * @param {Boolean} paginated
 *
 * @returns {Object}
 */
exports.response = (errMsg, successStatus, data, paginated) => {
  const responseObj = {
    success: successStatus || false,
    error: errMsg || null,
    data: data || null
  };

  if (errMsg) {
    return responseObj;
  }

  if (paginated) {
    responseObj.data = data.docs || data;
    responseObj.page = data.page || 1;
    responseObj.totalDocs = data.totalDocs || data.total;
    responseObj.limit = data.limit;
    responseObj.totalPages = data.totalPages || data.pages;
    responseObj.hasPrevPage = data.hasPrevPage || (data.page > 1);
    responseObj.hasNextPage = data.hasNextPage || (!!(!data.page || data.page < data.pages));
    responseObj.prevPage = data.prevPage || (data.page > 1 ? (data.page - 1) : null);
    responseObj.nextPage = data.nextPage || (
      !data.page
      || data.page < data.pages ? (data.page || 2) : null
    );
  } else {
    responseObj.data = data.docs || data;
  }

  return responseObj;
};
