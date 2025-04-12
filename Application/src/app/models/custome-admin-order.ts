export interface IcustomeOrderAdmin{
    id: number,
    name:string,
    email:string,
    size:string,
    address:string,
    notes:string,
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