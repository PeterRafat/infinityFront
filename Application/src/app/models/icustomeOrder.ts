export interface IcustomeOrder{
    Quantity: number;
    Phone: string;
    smallSize: string;
    mediumSize: string;
    largeSize: string;
    xlSize: string;
    xxlSize: string;
    smallQuantity:number;
    mediumQuantity:number;
    largeQuantity:number;
    xlQuantity:number;
    xllQuantity:number;
    Address: string;
    Notes: string;
    Photo: File[];
    date: string; // Add this field
    price: number; // Add this field
    totalPrice: number; // Add this field
    Name:string;
    Email:string;
}