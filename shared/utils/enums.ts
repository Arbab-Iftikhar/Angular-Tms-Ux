export enum Language {
    ENGLISH = "en",
    ARABIC = "ar",
    FRENCH = "fr"
}

export enum Direction {
    RTL = "rtl",
    LTR = "ltr"
}

export enum FormConstants{
    EMAIL = "email",
    PASSWORD = "password",
    POR_ORGACODE = "porOrgacode",
    CHANNEL_CODE = "channelCode",
    MANUAL = "manual",
    IMPORT = "import",
    DESTINATION_PROVINCE = "destinationProvince",
    DESTINATION_CITY = "destinationCity"
}

export enum HiddenValues {
    POR_ORGACODE = "001",
    CHANNEL_CODE = "01"
}

export enum ErrorMessages {
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    USER_NOT_FOUND = "ERR_USER_0004",
    RECORD_NOT_FOUND = "ERR_LOAD_0005",
    LOAD_NOT_ENROUTE = "ERR_LOAD_0006",
    LOAD_DELIEVERED = "ERR_LOAD_0007",
    RECORD_NOT_DELETED="ERR_DRIVER_0001",
    RECORD_NOT_UPDATED="ERR_DRIVER_00012",
    INVALID_INPUT = "ERR_GENERAL_0001",
    VERFICATION_DOCUMENTS_REQUIRED = "ERR_LOAD_0008",
    DRIVER_NOT_SELECTED = "ERR_LOAD_0009",
    EMPTY_COORDINATES = "ERR_TRACKING_0001",
    NO_LOADS_ENROUTE = "ERR_TRACKING_0002",
    SHIPMENT_ALREADY_CANCELED = "ERR_SHIP_0010"
}

export enum SuccessMessages {
    USER_LOGIN = "SUC_APP_F_0001",
    RECORD_ADDED = "SUC_APP_F_0002",
    RECORD_DELETED = "SUC_APP_F_0003",
    RECORD_UPDATED = "SUC_APP_F_0004",
    USER_LOGOUT = "SUC_APP_F_0005",
    PICKUP_NUMBER_ALLOTTED = "SUC_APP_F_0006",
    SIGNUP_SUCCESS = "SUC_APP_F_0007",
    LINK_SENT = "SUC_APP_F_0008",
    USER_REGISTERED_SUCCESSFULLY = "SUC_APP_F_0009",
    SHIPMENT_CANCELED = "SUC_APP_F_0010"

   
}

export enum Statuses {
    GET_STARTED = 1,
    DISPATCHED = 2,
    SCHEDULE_FOR_PICKUP = 3,
    ARRIVED_AT_PICKUP = 4,
    PICKUP_COMPLETE = 5,
    LOAD_ENROUTE = 6,
    ARRIVED_AT_DELIVERY = 7,
    DELIVERED = 8,
    POD_RECEIVED = 9
  }
  
   

