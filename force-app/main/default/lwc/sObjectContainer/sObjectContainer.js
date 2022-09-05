/**
 * description: To import a class, function, or variable declared in a module, use the import statement
 */
import { LightningElement } from 'lwc';
import getSObjectList from '@salesforce/apex/sObjectController.getSObject';

/**
 * description: To allow other code to use a class, function, or variable declared in a module, use the export statement
 */
export default class SObjectContainer extends LightningElement {
    
    /**
     * description: The connectedCallback invoke when a component is inserted into the DOM. This call the Apex method to reterive list of sObject
     */
    connectedCallback() {
        getSObjectList()
        .then(result => {
            console.log('Data Check testes ==> '+JSON.stringify(result));
        })
        .catch(error => {

        })
    }
}