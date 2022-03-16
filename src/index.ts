import type { Method, AxiosResponse, AxiosRequestConfig } from 'axios';
import axios from 'axios';


export interface MockConfig {
  method?: Method,
  url: string | RegExp,
  adapter?: (axiosConfig: AxiosRequestConfig, mockConfig: MockConfig) => any,
  timeout?: number,
  response?: Partial<AxiosResponse>,
}

export interface MockOptions {
  isUseDefaultAdapter: Boolean,
}

const defaultAdapter = axios.defaults.adapter;
const mockAdapter = (axiosConfig: AxiosRequestConfig, mockConfig: MockConfig)=> Promise.resolve(mockConfig.response);

async function timeout(time = 300) {
  return new Promise((res)=>{
    setTimeout(()=>{
      res(time);
    }, time);
  });
}

export const defineConfig = (config: MockConfig) => config;

export default function mockAxios(mockDatas: MockConfig[], mockOptions?: MockOptions) {
  const { isUseDefaultAdapter = true } = mockOptions || {};
  axios.defaults.adapter = async (axiosConfig) => {
    const mockConfig = mockDatas.find((mockData) => {
      const { url, method } = mockData;
      return ((!method || method.toLowerCase() === axiosConfig.method) && (url instanceof RegExp ? url.test(`${axiosConfig.url}`) : `${axiosConfig.url}`.includes(url)));
    });
    if (!mockConfig) return (isUseDefaultAdapter && defaultAdapter) ? defaultAdapter(axiosConfig) : {};

    await timeout(mockConfig.timeout);
    return (mockConfig.adapter || mockAdapter)(axiosConfig, mockConfig);
  };
}