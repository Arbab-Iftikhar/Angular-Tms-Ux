export class Province {
    id: number;
    name: string;
    constructor() {
        this.id = 0;
        this.name = '';
    }
}

export class City {
    id: number;
    name: string;
    provinceId: string;

    constructor() {
        this.id = 0;
        this.name = '';
        this.provinceId = '';
    }
}

export class Load {
    shipmentId: number;
   // shipmentName:string;
    puNumber: number;
    shipper: Shipper; 
    originAddress: string;
    originCity: string;
    originProvince: string;
    originRadius: number;
    destinationAddress: string;
    destinationCity: string;
    destinationProvince: string;
    destinationRadius: number;
    cargoDescription?: string;
    weight: string;
    loadStatus: string;
    loadDate: Date;
    deliveryDate: Date;
    trailerType: string;
    loadSize: string;
    length: string;
    company: string;
    estimatedCost: string;
    estimatedTime: string;
    estimatedMiles: string;
    postingAttribute: string;
    commodityDescription: string;
    status?: number;
    loadDay?:String
    loadMonth?:string
    loadDateDay?:number
    statusDescription?:string
    pickUpLang?: number
    pickUpLat? : number
    dropOfLang?:number
    dropOfLat ?: number
    isPinned?:boolean
    isVerified?:boolean
  shipperId: any;
    constructor() {
        this.shipmentId = 0;
       // this.shipmentName = '';
        this.puNumber = 0;
        this.shipper = new Shipper();
        this.originAddress = '';
        this.originCity = '';
        this.originProvince = '';
        this.originRadius = 0;
        this.destinationAddress = '';
        this.destinationCity = '';
        this.destinationProvince = '';
        this.destinationRadius = 0;
        this.cargoDescription = '';
        this.weight = '';
        this.loadStatus = '';
        this.loadDate = new Date();
        this.deliveryDate = new Date();
        this.trailerType = '';
        this.loadSize = '';
        this.length = '';
        this.company = '';
        this.estimatedCost = '';
        this.estimatedTime = '';
        this.estimatedMiles = '';
        this.postingAttribute = '';
        this.commodityDescription = '';
        this.status = 0;
    }
}


export class Shipper {
    shipperId: number;
    name?: string;
    address?: string;
    city?: string;
    province?: string;
    contactInfo?: string;
    createdAt?: Date;
    updatedAt?: Date;
    shipperName?: string;
    shipperContactInfo?: string;

    constructor() {
        this.shipperId = 0;
        this.name = '';
        this.address = '';
        this.city = '';
        this.province = '';
        this.contactInfo = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.shipperName = '';
        this.shipperContactInfo = '';
    }
}

export class Company {
    companyName: string;
    companyAddress: string;
    companyCity: string;
    companyProvince: string;
    companyContactInfo: string;
    createdAt: Date;
    updatedAt: Date;
  
    constructor() {
      this.companyName = '';
      this.companyAddress = '';
      this.companyCity = '';
      this.companyProvince = '';
      this.companyContactInfo = '';
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  }
  