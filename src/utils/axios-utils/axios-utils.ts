// noinspection TypeScriptValidateTypes

import axios from 'axios';

export const thirdPartyExample = axios.create({
    baseURL: 'https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com',
    withCredentials: false,
    headers: {}
});
