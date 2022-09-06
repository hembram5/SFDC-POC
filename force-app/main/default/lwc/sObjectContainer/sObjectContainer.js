/**
 * description: To import a class, function, or variable declared in a module, use the import statement
 */
import { LightningElement, track } from 'lwc';
import getSObjectList from '@salesforce/apex/sObjectController.getSObject';

/**
 * description: To allow other code to use a class, function, or variable declared in a module, use the export statement
 */
export default class SObjectContainer extends LightningElement {

    @track objectMap = [];
    
    /**
     * description: The connectedCallback invoke when a component is inserted into the DOM. This call the Apex method to reterive list of sObject
     */
    connectedCallback() {
        getSObjectList()
        .then(result => {
            //console.log(JSON.stringify(result));
            this.objectMap = Object.entries(result).map(([value, label]) => ({ value, label }));
            //console.log('OUTPUT Map : '+JSON.stringify(this.objectMap));
        })
        .catch(error => {
            console.log('OUTPUT : '+ JSON.stringify(error));
        })
    }

    handleSeletedObject(event) {
        console.log('Selected Value : '+event.detail.value);
    }
}