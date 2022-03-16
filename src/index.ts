import type { Method, AxiosResponse, AxiosRequestConfig } from 'axios';
import axios from 'axios';

export interface MockConfig {
  url: string | RegExp,
  method?: Method,
  adapter?: (axiosConfig: AxiosRequestConfig, mockConfig: MockConfig) => any,
  timeout?: number,
  response?: Partial<AxiosResponse>,
}

export interface MockOptions {
  isUseDefaultAdapter: Boolean,
  isEffect: Boolean,
}

const defaultAdapter = axios.defaults.adapter;
const mockAdapter = (axiosConfig: AxiosRequestConfig, mockConfig: MockConfig)=> Promise.resolve(mockConfig.response);

const timeout = async (time = 300) => {
  return new Promise((res)=>{
    setTimeout(()=>{
      res(time);
    }, time);
  });
};

const mockAxios = (mockDatas: MockConfig[], mockOptions?: MockOptions) => {
  const { isUseDefaultAdapter = true, isEffect = true } = mockOptions || {};
  axios.defaults.adapter = async (axiosConfig) => {
    if (!isEffect && defaultAdapter) return defaultAdapter(axiosConfig);
    const mockConfig = mockDatas.find((mockData) => {
      const { url, method } = mockData;
      return ((!method || method.toLowerCase() === axiosConfig.method) && (url instanceof RegExp ? url.test(`${axiosConfig.url}`) : `${axiosConfig.url}`.includes(url)));
    });
    if (!mockConfig) return (isUseDefaultAdapter && defaultAdapter) ? defaultAdapter(axiosConfig) : {};

    await timeout(mockConfig.timeout);
    return (mockConfig.adapter || mockAdapter)(axiosConfig, mockConfig);
  };
};
export default mockAxios;
export const defineConfig = (mockDatas: MockConfig[]) => mockDatas;