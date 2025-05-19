class ApiResponse {
  status_code: number;
  data: unknown;
  message: string;
  success: boolean;

  constructor(status_code: number, data: unknown, message: string = "Success") {
    this.status_code = status_code;
    this.data = data;
    this.message = message;
    this.success = status_code < 400;
  }
}

class ApiErrorResponse {
  status_code: number;
  message: string;
  success: boolean;
  error: unknown;

  constructor(
    status_code: number,
    error: unknown = "Bad request",
    message: string = "Something went wrong"
  ) {
    this.status_code = status_code;
    this.error = error;
    this.message = message;
    this.success = status_code < 400;
  }
}

export { ApiResponse, ApiErrorResponse };
