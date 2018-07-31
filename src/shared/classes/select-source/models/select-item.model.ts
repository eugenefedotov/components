export interface SelectItemModel<T = any> {
    value: number | string;
    name: string;
    attributes?: T;
}
