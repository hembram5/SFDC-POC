/**
 * description: To import a class, function, or variable declared in a module, use the import statement
 */
import { LightningElement, track, wire } from 'lwc';
import getSObjectList from '@salesforce/apex/sObjectController.getSObject';

//Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import SELECTED_OBJECT_CHANNEL from '@salesforce/messageChannel/Selected_Object__c';

/**
 * description: To allow other code to use a class, function, or variable declared in a module, use the export statement
 */
export default class SObjectContainer extends LightningElement {

    @track objectMap = [];
    
    /**
     * description: The connectedCallback invoke when a component is inserted into the DOM. Standard lifecycle hooks used to call apex method
     */
    connectedCallback() {
        getSObjectList()
        .then(result => {
            this.objectMap = Object.entries(result).map(([value, label]) => ({ value, label }));
        })
        .catch(error => {
            console.log('OUTPUT : '+ JSON.stringify(error));
        })
    }

    /**
     * description: Use to create a MessageContext object, which provides information about the LWC that is using the LMS
     */
    @wire(MessageContext)
    messageContext;

    /**
     * description: Respond to UI event i.e. select object by publishing message  
     */
    handleSeletedObject(event) {
        const selectedObjectName = this.objectMap.find(element => element.value === event.detail.value).label;
        const payload = {
            objectAPI: event.detail.value,
            objectName: selectedObjectName
        };
        publish( this.messageContext, SELECTED_OBJECT_CHANNEL, payload );
    }
}