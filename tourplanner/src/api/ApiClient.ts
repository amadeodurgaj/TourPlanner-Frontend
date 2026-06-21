import { toast } from 'sonner';
import { parseErrorBody } from "./ErrorMapper";
import type { ParsedError } from "./ErrorMapper";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
const REQUEST_TIMEOUT = 15000;

export { API_URL };

export interface ApiErrorDetails {
    message: string;
    errorCode?: number;
    timestamp?: string;
    details?: string[];
    fieldErrors?: Record<string, string>;
}

export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public body?: unknown,
        public details?: string[],
        public fieldErrors?: Record<string, string>,
        public errorCode?: number
    ) {
        super(message);
        this.name = "ApiError";
    }
}

function getCsrfToken(): string | null {
    const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const { headers: extraHeaders, ...restOptions } = options;
    const method = (options.method || "GET").toUpperCase();

    const csrfToken = getCsrfToken();
    const csrfHeader: Record<string, string> = (method !== "GET" && csrfToken)
        ? { "X-XSRF-TOKEN": csrfToken }
        : {};

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            credentials: "include",
            signal: controller.signal,
            ...restOptions,
            headers: {
                "Content-Type": "application/json",
                ...csrfHeader,
                ...(extraHeaders as Record<string, string>),
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                toast.error('Session expired. Please log in again.');
            }
            const errorBody = await parseErrorBody(response);
            throw new ApiError(
                errorBody.message,
                response.status,
                undefined,
                errorBody.details,
                errorBody.fieldErrors,
                errorBody.errorCode
            );
        }

        if (response.status === 204) return undefined as T;

        return response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            if (error.status !== 401 && error.status !== 403) {
                toast.error(error.message || 'Something went wrong');
            }
            throw error;
        }
        if (error instanceof DOMException && error.name === "AbortError") {
            toast.error('Request timed out. Please try again.');
            throw new ApiError("Request timed out", 408);
        }
        throw new ApiError(
            error instanceof Error ? error.message : "Unknown error",
            0
        );
    } finally {
        clearTimeout(timeoutId);
    }
}

export const api = {
    get: <T>(endpoint: string) =>
        request<T>(endpoint),

    post: <T>(endpoint: string, data?: unknown) =>
        request<T>(endpoint, {
            method: "POST",
            body: data !== undefined ? JSON.stringify(data) : undefined,
        }),

    put: <T>(endpoint: string, data?: unknown) =>
        request<T>(endpoint, {
            method: "PUT",
            body: data !== undefined ? JSON.stringify(data) : undefined,
        }),

    delete: <T>(endpoint: string) =>
        request<T>(endpoint, { method: "DELETE" }),
};

export default api;