export interface GridColumnModel<T extends Object = any> {
    title?: string;
    key: keyof T;
}
