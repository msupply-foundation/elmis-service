import { login } from './requests';

export * from './requests';
export * from './integrate';

const options = {
  baseURL: 'https://83.96.240.209/',
  username: 'jangaman',
  password: 'kathmanu312',
};

async function sendRequest() {
  try {
    const response = await login(options);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

sendRequest();
