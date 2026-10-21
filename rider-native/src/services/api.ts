import { AppConfig } from '../constants/config';
import { StorageService } from './storageService';

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

export const ApiClient = {
  async request<T = any>(path: string, options: RequestOptions = {}): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
    const { timeoutMs = 5000, ...fetchOptions } = options;
    const token = await StorageService.getItem<string>(AppConfig.storageKeys.authToken);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    const targetUrls = [
      `${AppConfig.apiBaseUrl}${path}`,
      ...AppConfig.fallbackBaseUrls.map((base) => `${base}${path}`),
    ];

    for (const url of targetUrls) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return { ok: true, status: response.status, data };
          }
          return { ok: true, status: response.status };
        }
      } catch (err: any) {
        clearTimeout(timer);
        // Continue to fallback url
      }
    }

    return {
      ok: false,
      status: 0,
      error: 'Network request unreachable, using offline mode',
    };
  },

  get<T = any>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'GET' });
  },

  post<T = any>(path: string, body?: any, options?: RequestOptions) {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T = any>(path: string, body?: any, options?: RequestOptions) {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T = any>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  },
};
