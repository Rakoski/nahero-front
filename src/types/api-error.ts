export interface BackendErrorResponse {
  timestamp: string;
  status: string;
  error: string;
  path: string;
}

export class ApiError extends Error {
  public status: number;
  public backendData?: BackendErrorResponse;

  constructor(
    message: string,
    status: number,
    backendData?: BackendErrorResponse
  ) {
    super(message);
    this.status = status;
    this.backendData = backendData;
  }
}
