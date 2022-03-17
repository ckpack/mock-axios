import { describe, expect, test } from 'vitest';
import axios from 'axios';
import { mockAxios, defineConfig } from '../src';

describe('mockAxios', () => {
  mockAxios([{
    method: 'GET',
    url: /https:\/\/test.com\/v1\/user\/\d+/,
    response: { 
      data: [{ 
        id: 1,
        name: 'admin',
      }], 
    },
  }, {
    method: 'POST',
    url: 'https://test.com/v1/user/create',
    adapter: (axiosConfig) => {
      return {
        data: axiosConfig.data,
      };
    },
  }], {
    isLog: false,
  });
  test('axios', async () => {
    const result = await axios.get('https://test.com/v1/user/1');
    expect(result).toEqual({
      data: [{ 
        id: 1,
        name: 'admin',
      }], 
    });
  });

  test('axios adapter', async () => {
    const result = await axios.post('https://test.com/v1/user/create', {
      id: 1,
      name: 'admin',
    });
    expect(result).toEqual({
      data: { 
        id: 1,
        name: 'admin',
      }, 
    });
  });
});

describe('defineCOnfig', () => {
  test('should first', () => { 
    const userDatas = defineConfig([{
      method: 'GET',
      url: /https:\/\/test.com\/v1\/user\/\d+/,
      response: { 
        data: [{ 
          id: 1,
          name: 'admin',
        }], 
      },
    }]);

    expect(userDatas).toEqual([{
      method: 'GET',
      url: /https:\/\/test.com\/v1\/user\/\d+/,
      response: { 
        data: [{ 
          id: 1,
          name: 'admin',
        }], 
      },
    }]);
  });
});



