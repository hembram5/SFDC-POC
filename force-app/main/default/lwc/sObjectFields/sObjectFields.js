/**
 * description: To import a class, function, or variable declared in a module, use the import statement
 */
import { LightningElement, wire, track } from 'lwc';
import getFieldList from '@salesforce/apex/sObjectController.getFieldList';

// Import message service features required for subscribing and message channel
import { subscribe, MessageContext } from 'lightning/messageService';
import SELECTED_OBJECT_CHANNEL from '@salesforce/messageChannel/Selected_Object__c';

/**
 * description: To allow other code to use a class, function, or variable declared in a module, use the export statement
 */
export default class SObjectFields extends LightningElement {
    subscription = null;
    objectName;
    objectMap = [];
    selectedValue = [];

    /**
     * description: Standard lifecycle hooks used to sub/unsub to message channel
     */
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    /**
     * description: By using the MessageContext @wire adapter
     */
    @wire(MessageContext)
    messageContext;

    /**
     * description: Encapsulate logic for LMS subscribe
     */
    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            SELECTED_OBJECT_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    /**
     * description: Handler for message received by component
     */
    handleMessage(message) {
        getFieldList({ objectName: message.objectAPI })
            .then( result => {
                //console.log('Fields ==> '+JSON.stringify(result));
                //console.log('Data result ==> '+result);
                this.objectName = message.objectName;
                console.log('Result ==> '+JSON.stringify(result));
                console.log('Object Entries ==> '+Object.entries(result).map(([value, label]) => ({ value, label })));
                console.log('JSON Object Entries ==> '+JSON.stringify(Object.entries(result).map(([value, label]) => ({ value, label }))));
                this.objectMap = Object.entries(result).map(([value, label]) => ({ value, label }));
            })
            .catch(error => {
                console.error('Error ==> '+JSON.stringify(error));
            })
    }
}