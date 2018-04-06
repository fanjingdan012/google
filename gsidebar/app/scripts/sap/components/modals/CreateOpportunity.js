import React from 'react';

import Form from 'core/components/form';
import FormModal from 'sap/components/modals/form';
import CustomerField from 'sap/components/forms/fields/CustomerField';
import ChannelPicker from 'sap/components/forms/fields/ChannelPicker';
import StagePicker from 'sap/components/forms/fields/StagePicker';
import SalesSourcePicker from 'sap/components/forms/fields/SalesSourcePicker';

import calendarUtil from 'sap/utils/google-calendar';
import {showNotification} from 'core/actions/notification';

import OpportunityActions from 'sap/actions/opportunities';

class CreateOpportunity extends FormModal {
    constructor(props) {
        super(props);
        this.columns = 2;
    }
    getFields() {
        return {
            channel: { label: 'SalesChannel', component: ChannelPicker },
            customer: { label: 'Customer', component: CustomerField },
            description: { label: 'Description' },
            stage: { label: 'Stage', component: StagePicker },
            startDate: { label: 'Start Date', type: 'date' },
            predictedClosingDate: { label: 'Predicted Closing Date', type: 'date' },
            potentialAmount: { label: 'Potential Amount', props: { type: 'number'} },
            closingPercentage: { label: 'Closing Percentage', props: { type: 'number'} },
            salesSource: { label: 'Sales Source', component: SalesSourcePicker },
            // pricingMethod: {} : not on doc
            remarks: { label: 'Remark' }
        }
    }
    getTitle() {
        return 'Create Opportunity';
    }
    onSubmit(data) {
        showNotification('Creating Opportunity...');
        var {
            customer,
            potentialAmount,
            closingPercentage,
            ...other
        } = data;
        var opp = {
            ...other,
            customer: customer,
            potentialAmount: {
                amount: Number(potentialAmount || 0),
            },
            closingPercentage: Number(closingPercentage || 0),
        };
        console.log(opp);
        // this.onRequestFail();
        OpportunityActions.CreateOpportunity(opp)
            .then(
                res => {
                    showNotification('Opportunity created.');
                    this.onRequestSuccess();
                },
                err => {
                    showNotification(err && err.message || 'Failed to create Opportunity.');
                    this.onRequestFail();
                }
            );
    }
}

export default CreateOpportunity;
