/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  AxiosHeaders,
} from 'axios';

interface APIOptions {
  token?: string;
  config?: AxiosRequestConfig;
}

export interface CustomHttpResponse {
  data: any;
  status: number;
  headers: any;
}

export class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    axios.defaults.baseURL = baseURL;
  }

  public async get<T>(
    endpoint: string,
    options?: APIOptions
  ): Promise<CustomHttpResponse> {
    try {
      const response = await axios.get<T>(
        endpoint,
        this.configureOptions(options)
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  public async post<T>(
    endpoint: string,
    data?: any,
    options?: APIOptions
  ): Promise<CustomHttpResponse> {
    try {
      const response = await axios.post<T>(
        endpoint,
        data,
        this.configureOptions(options)
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  public async put<T>(
    endpoint: string,
    data?: any,
    options?: APIOptions
  ): Promise<CustomHttpResponse> {
    try {
      const response = await axios.put<T>(
        endpoint,
        data,
        this.configureOptions(options)
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  public async patch<T>(
    endpoint: string,
    data?: any,
    options?: APIOptions
  ): Promise<CustomHttpResponse> {
    try {
      const response = await axios.patch<T>(
        endpoint,
        data,
        this.configureOptions(options)
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  private configureOptions = (options?: APIOptions) => {
    const headers: AxiosHeaders = new AxiosHeaders();
    headers.setContentType('application/json');
    if (options?.token) {
      headers.setAuthorization(`Bearer ${options.token}`);
    }
    return { ...options?.config, headers };
  };

  private handleResponse<T>(response: AxiosResponse<T>): CustomHttpResponse {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
    };
  }

  private handleError(error: AxiosError): CustomHttpResponse {
    console.log(error);
    return {
      data: error.response?.data,
      status: error.response!.status,
      headers: error.response?.headers,
    };
  }
}

// TODO Replace with your API URL
export const apiClient = new APIClient('https://google.com');
