import Utils from '../Utils';

const API_ENDPOINTS = {
  beta: 'https://qqmeusmrfk.execute-api.us-east-1.amazonaws.com/prod/',
  prod: 'https://5ktb1hi8c7.execute-api.us-east-1.amazonaws.com/prod/'
}

const ApiConstants = Object.freeze({
  API_ENDPOINT: API_ENDPOINTS[Utils.whatStageIsThis()]
});

export default ApiConstants;
