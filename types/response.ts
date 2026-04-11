
export interface responseType<T> {
    code: number;
    message: string;
    result: T;
};