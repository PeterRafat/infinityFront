export interface Iproduct {
    id: number,
    name: string,
    nameAr:string,
    price: number,
    photos: string[],
    description: string,
    categoryName: string
}
export interface ProductApiResponse{
    statusCode: number;
    meta: any;
    succeeded: boolean;
    message: string;
    errors: any;
    data: Iproduct[];
}