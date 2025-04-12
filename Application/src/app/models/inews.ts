export interface Inews {
    id: number,
    title: string,
    titleAr:string,
    content: string,
    contentAr:string,
    photo: string,
}
export interface allNews{
    statusCode: number;
    meta: any;
    succeeded: boolean;
    message: string;
    errors: any;
    data: Inews[];
}