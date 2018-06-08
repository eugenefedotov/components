export interface ListSource<T> {
    getCount(): Promise<number>;

    getItems(offset: number, limit: number): Promise<T[]>;
}