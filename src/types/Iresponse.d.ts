export interface IResponse<T> {
  status_code: number;
  detail: T;
  result: string;
}
