/* eslint-disable no-console */
import { login, programs } from './requests';

const test = async () => {
  try {
    await login();
    await programs();
  } catch (error) {
    console.log(error);
  }
};

test();
