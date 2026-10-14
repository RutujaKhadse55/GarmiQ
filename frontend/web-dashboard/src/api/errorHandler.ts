import axios, { AxiosError } from 'axios';

export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

export function parseApiError(error: unknown): ApiErrorResponse {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; detail?: string; error?: string }>;
    const status = axiosError.response?.status;
    const responseData = axiosError.response?.data;

    const message =
      responseData?.message ||
      responseData?.detail ||
      responseData?.error ||
      (status === 401 ? 'Session expired or invalid credentials.' : null) ||
      (status === 403 ? 'You do not have permission to perform this municipal action.' : null) ||
      (status === 404 ? 'Requested municipal record was not found.' : null) ||
      (status === 500 ? 'Municipal server encountered an internal error. Please try again.' : null) ||
      axiosError.message ||
      'An unexpected network error occurred.';

    return {
      message,
      status,
      details: responseData as any,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unknown error occurred.',
  };
}
