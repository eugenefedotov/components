export interface RestDataResponseModel<T> {
    items: Partial<T>[];
    count: number;
}