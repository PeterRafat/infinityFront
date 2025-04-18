export interface IcustomeOrderAdmin{
    id: number,
    name:string,
    email:string,
    phone:string,
    totalPrice:string,
    size:string,
    address:string,
    notes:string,
    date:string,
    photos: []
 }
 export interface IcutomeOrderResponse{
     statusCode: number;
     meta: any;
     succeeded: boolean;
     message: string;
     errors: any;
     data: IcustomeOrderAdmin[];
 }