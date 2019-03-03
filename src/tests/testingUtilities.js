export const throw401 = () => {
  throw { response: { status: 401 } };
};

export const throw500 = () => {
  throw { response: { status: 500 } };
};

export const throwRequestError = () => {
  throw { request: {} };
};

export const throwUnpredictedStatus = () => {
  throw { response: { status: 999 } };
};
