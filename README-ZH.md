# mock-axios

<h4 align="center">
  <a href="/README-ZH.md">中文</a>
  |
  <a href="/README.md">ENGLISH</a>
</h4>

拦截`Axios`请求返还`Mock`数据, 用于测试和开发。

## 文档

### mockAxios

`(mockDatas: MockConfig[], mockOptions?: MockOptions | undefined) => void`: Mock `Axios`

+ `mockDatas`: 一个数组, 当`axios`请求时，会检查对应的`url`、 `method`，当匹配时会返回对应的`response`数据。
  + `url`: `string | RegExp`类型, 需要匹配的url, 可以是字符串或正则表达式。当是字符串时会检查`axios`请求的`url`是否包含有该`url`。当是正则表达式时会检查`axios`请求的`url`是否匹配该`url`。
  + `method`: `GET` | `POST` | `PUT` | `DELETE` | `PATCH`, 默认为空即匹配所有类型的请求
  + `timeout`: `number`类型, 默认值: `300`, 单位: `ms`, 返回结果的延迟的时间
  + `response`: 返回的mock的数据对象
  + `adapter`: 自定义的适配器函数,参考[adapter](https://github.com/axios/axios/tree/master/lib/adapters), 该函数接受两个参数一个是`config`，一个是匹配到的`mockData`对象，返回值为`response`的数据对象，通过该参数你可以更自由的定义返回的数据（如验证接口权限）。
+ `mockOptions`
  + `isUseDefaultAdapter`: `Boolean`, 默认为 `true`, 如果开启，没有拦截到的请求会以`axios`默认方式发送请求
  + `isEffect`: `Boolean`, 默认为 `true`, 通过该参数你可以在测试环境中打开`mockAxios`，在生产环境中关闭`mockAxios`

```js
import mockAxios from '@ckpack/mock-axios';

mockAxios([{
  url: 'https://test.com/v1/user/1',
  response: { 
    data: { 
      id: 1,
      name: 'admin',
    }, 
  },
}], {
  isUseDefaultAdapter: true,
  isEffect: process.env.NODE_ENV === 'development',
});
```

### defineConfig

`(mockDatas: MockConfig[]) => MockConfig[]`: 构造mockDatas的辅助函数。该函数可以配合IDE来获取类型提示

+ `mockDatas`: 同`mockAxios`的`mockDatas`参数。

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

## 例子

```ts
import mockAxios from '@ckpack/mock-axios';

mockAxios([{
  url: 'https://test.com/v1/user/1',
  response: { 
    data: { 
      id: 1,
      name: 'admin',
    }, 
  },
}]);
```

在其他文件中

```ts
import axios from 'axios';
import mockAxios from '@ckpack/mock-axios';

const result = await axios.get('https://test.com/v1/user/1');
// result 等于 { data: { id: 1, name: 'admin' } }
```
