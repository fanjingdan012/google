const fieldsDescription = {
    "split1":{
        "name":"split1",
        "label":"General Information",
        "baseType":null,
        "type":"Split"
    },
    "portraitId": {
        "name": "portraitId",
        "label": "label.ContactPerson.portraitId",
        "baseType": "Long",
        "type": "Long"
    },
    "customer": {
        "name": "customer",
        "label": "Customer",
        "baseType": null,
        "type": "BoLabel"
    },
    "firstName": {
        "name": "firstName",
        "label": "First Name",
        "baseType": "String",
        "type": "String"
    },
    "lastName": {
        "name": "lastName",
        "label": "Last Name",
        "baseType": "String",
        "type": "String"
    },
    "title": {
        "name": "title",
        "label": "Salutation",
        "baseType": "String",
        "type": "String"
    },
    "position": {
        "name": "position",
        "label": "Position",
        "baseType": "String",
        "type": "String"
    },
    "mobile": {
        "name": "mobile",
        "label": "Mobile",
        "baseType": "String",
        "type": "Phone"
    },
    "phone": {
        "name": "phone",
        "label": "Phone",
        "baseType": "String",
        "type": "Phone"
    },
    "fax": {
        "name": "fax",
        "label": "Fax",
        "baseType": "String",
        "type": "String"
    },
    "email": {
        "name": "email",
        "label": "Email",
        "baseType": "String",
        "type": "Email"
    },
    "webSite": {
        "name": "webSite",
        "label": "Website",
        "baseType": "String",
        "type": "Link"
    },
    "displayName": {
        "name": "displayName",
        "label": "Contact Name",
        "baseType": "String",
        "type": "String"
    },
    "status": {
        "name": "status",
        "label": "Status",
        "baseType": "ContactStatusEnum",
        "type": "ContactStatusEnum"
    },
    "language": {
        "name": "language",
        "label": "Language",
        "baseType": null,
        "type": "BoLabel"
    },
    "gender": {
        "name": "gender",
        "label": "Gender",
        "baseType": "GenderEnum",
        "type": "GenderEnum"
    },
    "dateOfBirth": {
        "name": "dateOfBirth",
        "label": "Date Of Birth",
        "baseType": "DateTime",
        "type": "Date"
    },
    "marketingStatus": {
        "name": "marketingStatus",
        "label": "Opt-in Status",
        "baseType": "MarketingStatusEnum",
        "type": "MarketingStatusEnum"
    },
    "remark": {
        "name": "remark",
        "label": "Remark",
        "baseType": "String",
        "type": "Text"
    },
    "defaultAddress": {
        "name": "defaultAddress",
        "label": "Default Address",
        "baseType": null,
        "type": "BoLabel"
    },
    "addresses": {
        "name": "addresses",
        "label": null,
        "baseType": null,
        "type": "BoList"
    },
    "split2": {
        "name": "split2",
        "label": "Creation and Update Information",
        "baseType": null,
        "type": "Split"
    },
    "creatorDisplayName": {
        "name": "creatorDisplayName",
        "label": "Created By",
        "baseType": "String",
        "type": "String"
    },
    "updatorDisplayName": {
        "name": "updatorDisplayName",
        "label": "Updated By",
        "baseType": "String",
        "type": "String"
    },
    "creationTime": {
        "name": "creationTime",
        "label": "Creation Time",
        "baseType": "DateTime",
        "type": "DateTime"
    },
    "updateTime": {
        "name": "updateTime",
        "label": "Update Time",
        "baseType": "DateTime",
        "type": "DateTime"
    },

    // additional
    "company": {
        "name": "company",
        "label": "Company",
        "baseType": "String",
        "type": "String"
    }
}
const fields = [
    "split1",
    "firstName",
    "lastName",
    "company",
    "mobile",
    "phone",
    "email",
    "remark"
]
export {fields, fieldsDescription};