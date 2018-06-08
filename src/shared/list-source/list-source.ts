export interface ListSource<T> {
    getItems(offset: number, limit: number): Promise<{}>;
}