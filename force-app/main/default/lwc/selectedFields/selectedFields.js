import { LightningElement, wire } from 'lwc';

// Import message service features required for subscribing and message channel
import { subscribe, MessageContext } from 'lightning/messageService';
import SELECTED_FIELD_CHANNEL from '@salesforce/messageChannel/Selected_Fields__c';

export default class SelectedFields extends LightningElement {

    fieldList;

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
            SELECTED_FIELD_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    /**
     * description: Handler for message received by component
     */
     handleMessage(message) {
        if (message.fieldAPI) {
            this.selectedField( message.fieldAPI );
        } else {
            this.fieldList = message.fieldList;
        }
    }

    /**
     * description: store the selected field
     */
    selectedField( field ) {
        console.log('API Check field ==> '+ field);
        //console.log('Field List ==> '+JSON.stringify(this.fieldList));
        let selectedField = []; 
        field.forEach(currentItem => {
            //TODO : currentItem
            selectedField.push(this.fieldList.filter(element => element.value.includes(currentItem)))
        });
        console.log('OUTPUT : '+JSON.stringify(selectedField));
    }
}