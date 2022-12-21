const axios = require('axios');
const qs = require('querystring');

const baseURL = 'https://api.volatia.com/';

export const postRequest = async (url, body = {}, headers = {}) => {
  let xform = qs.stringify(body);

  // if(baseURL=='https://api.volatia.com/api/WorkOrders/Create')

  let config = {
    headers: {
      'Content-Type': 'application/x-www-form-ur	lencoded',
      ...headers,
    },
  };

  let returnValue;

  await axios
    .post(baseURL + url, xform, config)
    .then((result) => {
      returnValue = {result: result, error: null};
    })
    .catch((err) => {
      returnValue = {result: null, error: err};
    });
  return returnValue;
};

export const postRequestForm = async (url, token, body = {}, headers = {}) => {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  let returnValue;

  await axios
    .post(baseURL + url, body, config)
    .then((result) => {
      returnValue = {result: result, error: null};
    })
    .catch((err) => {
      returnValue = {result: null, error: err};
    });
  return returnValue;
};

export const postWithParams = async (url, token, params = {}, headers = {}) => {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      ...headers,
    },
    params: {
      ...params,
    },
  };

  let returnValue;

  await axios
    .post(baseURL + url, {}, config)
    .then((result) => {
      returnValue = {result: result, error: null};
    })
    .catch((err) => {
      returnValue = {result: null, error: err};
    });
  return returnValue;
};

export const getRequest = async (url, token, params = {}, headers = {}) => {
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      ...headers,
    },
    params: {
      ...params,
    },
  };

  let returnValue;

  await axios
    .get(baseURL + url, config)
    .then((result) => {
      returnValue = {result: result, error: null};
    })
    .catch((err) => {
      returnValue = {result: null, error: err};
    });
  return returnValue;
};
