export interface IorderAdmin{
   id: number,
   totalPrice: number,
   productId: number,
   quantity: number,
   date:string,
   size:string,
   phone:string,
   address:string,
   notes:string,
   picsCustom: []
}
export interface IorderResponse{
    statusCode: number;
    meta: any;
    succeeded: boolean;
    message: string;
    errors: any;
    data: IorderAdmin[];
}