export interface GridColumnModel<T extends Object = any> {
    title?: string;
    field: keyof T;
}
