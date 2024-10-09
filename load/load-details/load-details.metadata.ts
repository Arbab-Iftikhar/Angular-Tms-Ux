export class Status {
    statusCode: number;
    statusDescription: string;
    statusDetails: string;

    constructor() {
        this.statusCode = 0;
        this.statusDescription = '';
        this.statusDetails = '';
    }
}
