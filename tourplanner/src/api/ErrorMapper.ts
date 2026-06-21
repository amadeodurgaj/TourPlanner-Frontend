export interface ParsedError {
  message: string;
  details?: string[];
  fieldErrors?: Record<string, string>;
  errorCode?: number;
}

export async function parseErrorBody(response: Response): Promise<ParsedError> {
  try {
    const body = await response.json();
    if (body?.message) {
      return {
        message: body.message,
        details: body.details,
        fieldErrors: body.fieldErrors,
        errorCode: body.errorCode,
      };
    }
    if (body?.detail) {
      return {
        message: body.detail,
        details: body.details,
        fieldErrors: body.fieldErrors,
        errorCode: body.status,
      };
    }
    if (body?.error) {
      return { message: body.error };
    }
    return { message: JSON.stringify(body) };
  } catch {
    return { message: response.statusText };
  }
}
