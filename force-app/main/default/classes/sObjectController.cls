/**
 * @description: Retrive all the sObject and their respective fields from an org
 */
public with sharing class sObjectController {
    
    /**
     * @decription: Method to get all sObject API with their labels based on the logged-in user object permission
     * @return: Map<String, String>
     */
    @AuraEnabled
    public static Map<String, String> getSObject() {
        Map<String, String> mapOfSObjects = new Map<String, String>();
        
        Map<String, Schema.SObjectType> globalDescribeMap = Schema.getGlobalDescribe();
        for(String globalDescribeKey : globalDescribeMap.keySet()) {
            Schema.SObjectType objectType = globalDescribeMap.get(globalDescribeKey);
            Schema.DescribeSObjectResult objectResult = objectType.getDescribe();
            if(objectResult.isAccessible()) {
                mapOfSObjects.put(objectResult.getName(), objectResult.getLabel());
            }
        }
        return mapOfSObjects;
    }
    
    /**
     * @description: Method to get all the fields for an object based on the logged-in user field permission
     * @return: Map<String, String>
     */
    @AuraEnabled
    public static Map<String, String> getFieldList(SObject objectName) {
        Map<String, String> mapOfFields = new Map<String, String>();
        
        if(objectName != null) {
            Schema.SObjectType objectType = objectName.getSObjectType();
            Schema.DescribeSObjectResult objectResult = objectType.getDescribe();
            Map<String, Schema.SObjectField> objectFieldsMap = objectResult.fields.getMap();
            for(String fieldKey : objectFieldsMap.keySet()) {
                Schema.SObjectField sObjectField = objectFieldsMap.get(fieldKey);
                Schema.DescribeFieldResult sObjectFieldResult = sObjectField.getDescribe();
                if(sObjectFieldResult.isAccessible() && sObjectFieldResult.isUpdateable()) {
                    mapOfFields.put(sObjectFieldResult.getName(), sObjectFieldResult.getLabel());
                }
            }
        }
        return mapOfFields;
    }
}