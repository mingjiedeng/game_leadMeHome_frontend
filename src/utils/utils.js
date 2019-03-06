export const formatError = error => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return `Server responded
    status: ${error.response.status},
    message:  ${error.response.data.message}`;
  }
  if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the
    // browser and an instance of http.ClientRequest in node.js
    return JSON.stringify(error.request);
  }
  if (error.message) {
    // If has a custom error message, then show it.
    return JSON.stringify(error.message);
  }
  // Something happened in setting up the request that triggered an Error
  return JSON.stringify(error.config);
};

export const lengthOfObject = obj => Object.keys(obj).length;

export const isEmptyArray = arr => !arr || !arr.length;

export const isEmpty = object =>
  typeof object === 'undefined' || !object || lengthOfObject(object) === 0;
