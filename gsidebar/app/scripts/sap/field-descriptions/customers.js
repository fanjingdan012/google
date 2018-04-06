const fieldsDescription = {
    "split1":{
        "name":"split1",
        "label":"General Information",
        "baseType":null,
        "type":"Split"
    },
    "split2":{
        "name":"split2",
        "label":"Contact Information",
        "baseType":null,
        "type":"Split"
    },
    "split3":{
        "name":"split3",
        "label":"Sales and Service Data",
        "baseType":null,
        "type":"Split"
    },
    "split4":{
        "name":"split4",
        "label":"Creation and Update Information",
        "baseType":null,
        "type":"Split"
    },
    "split6":{
        "name":"split6",
        "label":"Membership Information",
        "baseType":null,
        "type":"Split"
    },
    "portraitId":{
        "name":"portraitId",
        "label":"label.Customer.portraitId",
        "baseType":"Long",
        "type":"Long"
    },
    "customerCode":{
        "name":"customerCode",
        "label":"Customer Code",
        "baseType":"String",
        "type":"SeriesLabel"
    },
    "customerType":{
        "name":"customerType",
        "label":"Customer Type",
        "baseType":"CustomerTypeEnum",
        "type":"CustomerTypeEnum"
    },
    "customerName":{
        "name":"customerName",
        "label":"Company",
        "baseType":"String",
        "type":"String"
    },
    "status":{
        "name":"status",
        "label":"Status",
        "baseType":"CustomerStatusEnum",
        "type":"CustomerStatusEnum"
    },
    "stage":{
        "name":"stage",
        "label":"Stage",
        "baseType":"CustomerStageEnum",
        "type":"CustomerStageEnum"
    },
    "customerGroup":{
        "name":"customerGroup",
        "label":"Customer Group",
        "baseType":null,
        "type":"BoLabel"
    },
    "serviceLevelPlan":{
        "name":"serviceLevelPlan",
        "label":"Service Level",
        "baseType":null,
        "type":"BoLabel"
    },
    "targetGroup":{
        "name":"targetGroup",
        "label":"Target Group",
        "baseType":"String",
        "type":"String"
    },
    "vatRegistrationNumber":{
        "name":"vatRegistrationNumber",
        "label":"VAT Number",
        "baseType":"String",
        "type":"String"
    },
    "firstName":{
        "name":"firstName",
        "label":"First Name",
        "baseType":"String",
        "type":"String"
    },
    "lastName":{
        "name":"lastName",
        "label":"Last Name",
        "baseType":"String",
        "type":"String"
    },
    "displayName":{
        "name":"displayName",
        "label":"Customer Name",
        "baseType":"String",
        "type":"String"
    },
    "title":{
        "name":"title",
        "label":"Salutation",
        "baseType":"String",
        "type":"String"
    },
    "position":{
        "name":"position",
        "label":"Position",
        "baseType":"String",
        "type":"String"
    },
    "industry":{
        "name":"industry",
        "label":"Industry",
        "baseType":null,
        "type":"BoLabel"
    },
    "mobile":{
        "name":"mobile",
        "label":"Mobile",
        "baseType":"String",
        "type":"Phone"
    },
    "phone":{
        "name":"phone",
        "label":"Phone",
        "baseType":"String",
        "type":"Phone"
    },
    "fax":{
        "name":"fax",
        "label":"Fax",
        "baseType":"String",
        "type":"String"
    },
    "email":{
        "name":"email",
        "label":"Email",
        "baseType":"String",
        "type":"Email"
    },
    "webSite":{
        "name":"webSite",
        "label":"Website",
        "baseType":"String",
        "type":"Link"
    },
    "paymentTerm":{
        "name":"paymentTerm",
        "label":"Payment Term",
        "baseType":null,
        "type":"BoLabel"
    },
    "paymentAccount":{
        "name":"paymentAccount",
        "label":"Payment Method",
        "baseType":null,
        "type":"BoLabel"
    },
    "creditLimit":{
        "name":"creditLimit",
        "label":"Credit Limit",
        "baseType":"Decimal",
        "type":"Sum"
    },
    "facebookAccount":{
        "name":"facebookAccount",
        "label":"Facebook",
        "baseType":"String",
        "type":"String"
    },
    "googleAccount":{
        "name":"googleAccount",
        "label":"Google+",
        "baseType":"String",
        "type":"String"
    },
    "linkedINAccount":{
        "name":"linkedINAccount",
        "label":"LinkedIn",
        "baseType":"String",
        "type":"String"
    },
    "twitter":{
        "name":"twitter",
        "label":"Twitter",
        "baseType":null,
        "type":"SocialProfile"
    },
    "weibo":{
        "name":"weibo",
        "label":"Sina Weibo",
        "baseType":null,
        "type":"SocialProfile"
    },
    "language":{
        "name":"language",
        "label":"Language",
        "baseType":null,
        "type":"BoLabel"
    },
    "gender":{
        "name":"gender",
        "label":"Gender",
        "baseType":"GenderEnum",
        "type":"GenderEnum"
    },
    "dateOfBirth":{
        "name":"dateOfBirth",
        "label":"Date of Birth",
        "baseType":"DateTime",
        "type":"Date"
    },
    "marketingStatus":{
        "name":"marketingStatus",
        "label":"Opt-in Status",
        "baseType":"MarketingStatusEnum",
        "type":"MarketingStatusEnum"
    },
    "taxType":{
        "name":"taxType",
        "label":"Tax Group",
        "baseType":"TaxBusinessPartnerGroupEnum",
        "type":"TaxBusinessPartnerGroupEnum"
    },
    "remark":{
        "name":"remark",
        "label":"Remark",
        "baseType":"String",
        "type":"Text"
    },
    "checkDuplication":{
        "name":"checkDuplication",
        "label":"Check Duplication",
        "baseType":"Boolean",
        "type":"Boolean"
    },
    "defaultShipToAddress":{
        "name":"defaultShipToAddress",
        "label":"Shipping Address",
        "baseType":null,
        "type":"BoLabel"
    },
    "defaultBillToAddress":{
        "name":"defaultBillToAddress",
        "label":"Billing Address",
        "baseType":null,
        "type":"BoLabel"
    },
    "customerAddresses":{
        "name":"customerAddresses",
        "label":null,
        "baseType":null,
        "type":"BoList"
    },
    "channelAccounts":{
        "name":"channelAccounts",
        "label":null,
        "baseType":null,
        "type":"BoList"
    },
    "linkedCustomer":{
        "name":"linkedCustomer",
        "label":"Merged Customer",
        "baseType":null,
        "type":"BoLabel"
    },
    "ownerDisplayName":{
        "name":"ownerDisplayName",
        "label":"Owner",
        "baseType":"String",
        "type":"String"
    },
    "creatorDisplayName":{
        "name":"creatorDisplayName",
        "label":"Created By",
        "baseType":"String",
        "type":"String"
    },
    "updatorDisplayName":{
        "name":"updatorDisplayName",
        "label":"Updated By",
        "baseType":"String",
        "type":"String"
    },
    "creationTime":{
        "name":"creationTime",
        "label":"Creation Time",
        "baseType":"DateTime",
        "type":"DateTime"
    },
    "updateTime":{
        "name":"updateTime",
        "label":"Update Time",
        "baseType":"DateTime",
        "type":"DateTime"
    },
    "membershipId":{
        "name":"membershipId",
        "label":"Membership ID",
        "baseType":"String",
        "type":"String"
    },
    "membershipLevel":{
        "name":"membershipLevel",
        "label":"Membership Level",
        "baseType":null,
        "type":"BoLabel"
    },
    "membershipBalance":{
        "name":"membershipBalance",
        "label":"Membership Balance",
        "baseType":"Long",
        "type":"Long"
    },
    "membershipTotalEarn":{
        "name":"membershipTotalEarn",
        "label":"Total Points Accrued",
        "baseType":"Long",
        "type":"Long"
    },
    "priceListTable":{
        "name":"priceListTable",
        "label":null,
        "baseType":null,
        "type":"Table"
    },
    "membershipEvents":{
        "name":"membershipEvents",
        "label":null,
        "baseType":null,
        "type":"BoList"
    }
};

// const fields = [
//     "split1",
//     "customerCode",
//     "customerType",
//     "stage",
//     "customerName",
//     "title",
//     "firstName",
//     "lastName",
//     "position",
//     "marketingStatus",
//     "status",
//     "serviceLevelPlan",
//     "remarks",
//     "split2",
//     "phone",
//     "fax",
//     "mobile",
//     "email",
//     "webSite",
//     "twitter",
//     "weibo",
//     "targetGroup",
//     "split3",
//     "paymentTerm",
//     "paymentAccount",
//     "creditLimit",
//     "checkDuplication",
//     "split6",
//     "membershipId",
//     "membershipLevel",
//     "membershipBalance",
//     "split4",
//     "creatorDisplayName",
//     "updatorDisplayName",
//     "creationTime",
//     "updateTime"
// ];
const fields = [
    "split1",
    "firstName",
    "lastName",
    "customerName",
    "mobile",
    "phone",
    "email",
    "customerType",
    "stage",
    "remark",
    // "address"
]

export {fields, fieldsDescription};