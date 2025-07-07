import '@babel/polyfill';
import axios from 'axios';
import axiosRequest from '../axiosUtilities';
import { getErrorObject } from '../errors/errorLookupTable';

// Mock axios env
jest.mock('axios');
const mockedAxios = axios;

jest.mock('../errors/errorLookupTable');
const mockedGetErrorObject = getErrorObject;

describe('axiosRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedAxios.mockReset();
    mockedGetErrorObject.mockReset();
  });

  describe('successful requests', () => {
    test('should return response data with safe config for successful GET request', async () => {
      const mockResponse = {
        status: 200,
        headers: { 'content-type': 'application/json' },
        data: { id: 1, name: 'Test User' },
      };

      mockedAxios.mockResolvedValueOnce(mockResponse);

      const config = {
        method: 'GET',
        url: '/api/users/1',
        baseURL: 'https://api.example.com',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        timeout: 5000,
      };

      const action = 'fetchUser';
      const additionalMetadata = { userId: 1 };

      const result = await axiosRequest(config, action, additionalMetadata);

      expect(mockedAxios).toHaveBeenCalledWith(config);
      expect(result).toHaveProperty('request');
      expect(result).toHaveProperty('response');

      expect(result.request).toEqual({
        method: 'GET',
        url: '/api/users/1',
        baseURL: 'https://api.example.com',
        params: undefined,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        timeout: 5000,
        timestamp: expect.any(String),
        userId: 1,
      });

      expect(result.response).toEqual({
        status: 200,
        headers: { 'content-type': 'application/json' },
        data: { id: 1, name: 'Test User' },
      });
    });

    test('should return response data for successful POST request with params', async () => {
      const mockResponse = {
        status: 201,
        headers: { location: '/api/users/2' },
        data: { id: 2, name: 'New User', created: true },
      };

      mockedAxios.mockResolvedValueOnce(mockResponse);

      const config = {
        method: 'POST',
        url: '/api/users',
        baseURL: 'https://api.example.com',
        params: { programId: 1 },
        headers: { 'Content-Type': 'application/json' },
        timeout: 3000,
        data: { name: 'New User', email: 'test@example.com' },
      };

      const action = 'createUser';

      const result = await axiosRequest(config, action);

      expect(mockedAxios).toHaveBeenCalledWith(config);
      expect(result.request.method).toBe('POST');
      expect(result.request.params).toEqual({ programId: 1 });
      expect(result.response.status).toBe(201);
      expect(result.response.data.created).toBe(true);
    });

    test('should handle request without additional metadata', async () => {
      const mockResponse = {
        status: 200,
        headers: {},
        data: { success: true },
      };

      mockedAxios.mockResolvedValueOnce(mockResponse);

      const config = {
        method: 'DELETE',
        url: '/api/resource/1',
        baseURL: 'https://api.example.com',
      };

      const result = await axiosRequest(config, 'delete');

      expect(result.request).not.toHaveProperty('userId');
      expect(result.request).toHaveProperty('timestamp');
      expect(result.response.data.success).toBe(true);
    });
  });

  describe('error handling', () => {
    test('should throw error with safe config and error details for HTTP error', async () => {
      const mockError = {
        response: {
          status: 404,
          statusText: 'Not Found',
          headers: { 'content-type': 'application/json' },
          data: { error: 'User not found' },
          config: {},
          request: {},
        },
      };

      const mockErrorObject = {
        success: false,
        code: 'ERROR_404',
        message: 'Resource not found',
      };

      mockedAxios.mockRejectedValueOnce(mockError);
      mockedGetErrorObject.mockReturnValueOnce(mockErrorObject);

      const config = {
        method: 'GET',
        url: '/api/users/999',
        baseURL: 'https://api.example.com',
        headers: { Authorization: 'Bearer token123' },
      };

      const action = 'fetchUser';
      let errorCatcher;
      try {
        await axiosRequest(config, action);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        errorCatcher = error;
      }

      expect(mockedGetErrorObject).toHaveBeenCalledWith(mockError, action);
      expect(errorCatcher).toHaveProperty('success', false);
      expect(errorCatcher).toHaveProperty('code', 'ERROR_404');
      expect(errorCatcher).toHaveProperty('message', 'Resource not found');
      expect(errorCatcher).toHaveProperty('request');
      expect(errorCatcher).toHaveProperty('response');

      expect(errorCatcher.response).not.toHaveProperty('config');
      expect(errorCatcher.response).not.toHaveProperty('request');
    });

    test('should handle network error (no response)', async () => {
      const mockError = {
        message: 'Network Error',
        code: 'NETWORK_ERROR',
      };

      const mockErrorObject = {
        success: false,
        code: 'ERROR_NETWORK',
        message: 'Network connection failed',
      };

      mockedAxios.mockRejectedValueOnce(mockError);
      mockedGetErrorObject.mockReturnValueOnce(mockErrorObject);

      const config = {
        method: 'POST',
        url: '/api/data',
        baseURL: 'https://api.example.com',
      };

      const action = 'sendData';
      const additionalMetadata = { retryCount: 1 };
      let errorCatcher;

      try {
        await axiosRequest(config, action, additionalMetadata);
        expect(true).toBe(false);
      } catch (error) {
        errorCatcher = error;
      }

      expect(mockedGetErrorObject).toHaveBeenCalledWith(mockError, action);
      expect(errorCatcher.success).toBe(false);
      expect(errorCatcher.code).toBe('ERROR_NETWORK');
      expect(errorCatcher.request.retryCount).toBe(1);
      expect(errorCatcher.response).toEqual({});
    });
  });
});
