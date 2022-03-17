# mock-axios

<h4 align="center">
  <a href="/README-ZH.md">中文</a>
  |
  <a href="/README.md">ENGLISH</a>
</h4>

Intercept `Axios` requests and return `Mock` data for testing and development.

## API

### mockAxios

`(mockDatas: MockConfig[], mockOptions?: MockOptions | undefined) => void`: Mock `Axios`

+ `mockDatas`: an array, when `axios` requests, it will check the corresponding `url`, `method`, and return the corresponding `response` data when it matches.
  + `url`: `string | RegExp` type, the url to match, can be a string or a regular expression. When it is a string, it will check whether the `url` requested by `axios` contains the `url`. When it is a regular expression, it will check whether the `url` requested by `axios` matches the `url`.
  + `method`: `GET` | `POST` | `PUT` | `DELETE` | `PATCH`, default is empty to match all types of requests
  + `timeout`: `number` type, default value: `300`, unit: `ms`, the delay time of returning the result
  + `response`: the data object of the returned mock
  + `adapter`: custom adapter function, refer to [adapter](https://github.com/axios/axios/tree/master/lib/adapters), this function accepts two parameters, one is `config`, one is It is the matched `mockData` object, and the return value is the data object of `response`. Through this parameter, you can define the returned data more freely (such as verifying interface permissions).
+ `mockOptions`
  + `isUseDefaultAdapter`: `Boolean`, defaults to `true`, if enabled, requests that are not intercepted will be sent in the default mode of `axios`
  + `isEffect`: `Boolean`, default is `true`, with this parameter you can enable `mockAxios` in test environment and disable `mockAxios` in production environment
  + `isLog`: `Boolean`, the default is `true`, whether to print the request log of `mockAxios`

```js
import { mockAxios } from '@ckpack/mock-axios';

mockAxios([{
  url: 'https://test.com/v1/user/1',
  response: { 
    data: { 
      id: 1,
      name: 'admin',
    }, 
  },
}], {
  isEffect: process.env.NODE_ENV === 'development',
});
```

### defineConfig

`(mockDatas: MockConfig[]) => MockConfig[]`: Helper function for constructing mockDatas. This function can be used with the IDE to get type hints

+ `mockDatas`: Same as the `mockDatas` parameter of `mockAxios`.

```js
import { defineConfig } from '@ckpack/mock-axios';

const mockDatas = defineConfig([
  {
    url: 'https://test.com/v1/user/1',
    response: {
      data: {
        id: 1,
        name: 'admin',
      },
    },
  },
]);
```

## Example

```ts
// mockAxios.js
import { mockAxios } from '@ckpack/mock-axios';

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
}]);
```

in other files

```ts
import axios from 'axios';
import './mockAxios.js';

await axios.get('https://test.com/v1/user/1');
// return { data: [{ id: 1, name: 'admin' }] }

await axios.post('https://test.com/v1/user/create', {
  id: 1,
  name: 'admin',
});
// return { data: { id: 1, name: 'admin' } }
await axios.post('https://test.com/v1/user/create', {
  id: 2,
  name: 'test',
});
// return { data: { id: 2, name: 'test' } }
```
