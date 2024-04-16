const axios = require('axios');

const customAxios = axios.create({
  withCredentials: true,
});

customAxios.interceptors.response.use(
  (response) => {
    // console.log('response', response);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

module.exports = {
  customAxios,
};

// export default customAxios;