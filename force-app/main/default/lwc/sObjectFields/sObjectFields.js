/**
 * description: To import a class, function, or variable declared in a module, use the import statement
 */
import { LightningElement, wire, track } from 'lwc';
import getFieldList from '@salesforce/apex/sObjectController.getFieldList';

// Import message service features required for subscribing/publishing and message channel
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import SELECTED_OBJECT_CHANNEL from '@salesforce/messageChannel/Selected_Object__c';
import SELECTED_FIELD_CHANNEL from '@salesforce/messageChannel/Selected_Fields__c';

/**
 * description: To allow other code to use a class, function, or variable declared in a module, use the export statement
 */
export default class SObjectFields extends LightningElement {
    subscription = null;
    objectName;
    objectMap = [];
    selectedValue = [];
    displayFields = false;
    filteredList = [];

    /**
     * description: Standard lifecycle hooks used to sub/unsub to message channel
     */
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    /**
     * description: display the filtered data
     */
    get filteredData() {
        return this.filteredList.length > 0 ? true : false;
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
                this.displayFields = true;
                this.objectName = message.objectName;
                this.objectMap = Object.entries(result).map(([value, label]) => ({ value, label }));
                const payload = {
                    fieldList: this.objectMap
                };

                publish( this.messageContext, SELECTED_FIELD_CHANNEL, payload );

            })
            .catch(error => {
                console.error('Error ==> '+JSON.stringify(error));
            })
    }

    /**
     * description: method to select the field
     */
     handleSelect( event ) {
        const payload = {
            fieldAPI: event.detail.value
        };

        publish( this.messageContext, SELECTED_FIELD_CHANNEL, payload );

     }

     /**
      * description: method to used to search the fields
      */
      searchField( event ) {
        this.filteredList = (event.detail.value) ? this.objectMap.filter(field => field.label.includes(event.detail.value)) : this.objectMap;
      }
}