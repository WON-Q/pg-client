export interface BaseResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data?: T;
}
