/* eslint-disable import/extensions */
/* eslint-env jest */
import axios from 'axios';
import mockAxios from '../dist/mock-axios.es.js';

mockAxios([{
  method: 'get',
  url: 'https://test.com/v1/user/1',
  response: { 
    data: { 
      code: 0,
      id: 1,
      name: 'admin',
    }, 
  },
}]);

describe('mockAxios', () => {
  test('axios', async () => {
    const result = await axios.get('https://test.com/v1/user/1');
    expect(result).toEqual({
      data: { 
        code: 0,
        id: 1,
        name: 'admin',
      }, 
    });
  });
});



