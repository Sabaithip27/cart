import { BrandInterface } from "./IBrand";
import { TypeInterface } from "./IType";

export interface DevicesInterface {

    ID?: number,
    Name?: string;
    
    DistributorID?: number;
	TypeID?      : number;
	BrandID?     : number;

    Type? : TypeInterface;
    Brand? : BrandInterface;
}