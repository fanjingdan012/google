import React from 'react';
import ContactStore from 'sap/stores/contact-persons';
import ContactActions from 'sap/actions/contacts';
import Dialog from 'material-ui/lib/dialog';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import TextField from 'material-ui/lib/text-field';
import CircularProgress from 'material-ui/lib/circular-progress';
import Divider from 'material-ui/lib/divider';
import Participant from './Participant';

import { CustomerPicker, CustomerLinesField } from './CustomerField';

class ContactPicker extends CustomerPicker {
    constructor(props) {
        super(props);
        this.state = _.extend({
            open: props.defaultOpen || false,
            filter: ''
        }, ContactStore.getState());
    }
    componentWillMount() {
        this.unsubscribe = ContactStore.listen(this.onStoreDidChange.bind(this))
        if (!this.state.isContactsLoaded) {
            ContactActions.LoadContacts();
        }
    }
    render() {
        var standardActions = [
            { text: 'Cancel' }
        ];
        var {contacts, open, isContactsLoaded, filter, ...others} = this.state;
        var selectedIds = this.props.selectedIds;
        var titleStyle = {
            margin: 0,
            color: 'rgba(0, 0, 0, 0.87)',
            fontSize: 24,
            lineHeight: '32px',
            fontWeight: 400
        }
        var title = (
            <div style={{padding: '24px 24px 0 24px'}}>
                <h3 style={titleStyle}>{`Customers(${contacts.length})`}</h3>
                <TextField
                    hintText="Search"
                    fullWidth={true}
                    value={filter}
                    onChange={(ev) => this.setState({filter: ev.target.value})}/>
            </div>
        )
        return (
            <Dialog
                open={open}
                actions={standardActions}
                autoDetectWindowHeight={true}
                autoScrollBodyContent={true}
                onRequestClose={this.close.bind(this)}
                title={title}
                bodyStyle={{paddingTop: 0}}
                contentStyle={{width: 420}}>
                {isContactsLoaded ?
                    this._buildContent(contacts, filter, selectedIds)
                    : <div style={{textAlign: 'center'}}><CircularProgress mode="indeterminate" /></div>
                }
            </Dialog>
        );
    }
}

class AttendeeLines extends CustomerLinesField {
    constructor(props) {
        super(props);
        this.state = {
            participants: this.props.defaultValue || []
        }
    }
    onContactSelected({ displayName, id }) {
        this.setState({
            participants: [...this.state.participants, { displayName, participantId: id, participantType: 'ContactPerson' }]
        });
    }
    getValue() {
        return _.map(this.state.participants, ({ participantId, participantType }) => ({ participantId, participantType }));
    }
    onRemove(participantId) {
        var participants = _.reject(this.state.participants, al => al.participantId === participantId && al.participantType === 'ContactPerson');
        this.setState({ participants });
    }
    render() {
        var { participants } = this.state;
        var { floatingLabelText, label, ...others } = this.props;
        var customers = _.filter(participants, al => al.participantType === 'ContactPerson').map(c => (
            <Participant {...c} onRemove={(id) => this.onRemove(id)} />
        ));
        var styles = this.getStyles();
        return (
            <div style={styles.containers.root}>
                <div style={styles.containers.label}>
                    <span>{floatingLabelText || label}</span>
                    <span style={styles.containers.addBtn}>
                        <span className="material-icons" style={styles.addIcon}>add</span>
                        <a href="javascript:void(0)" onTouchTap={ev => this.onClickAdd()} style={styles.addBtn}>Add</a>
                    </span>
                </div>
                <List style={styles.containers.customers}>
                    {customers}
                </List>
                <ContactPicker
                    ref="picker"
                    onSelect={this.onContactSelected.bind(this)}
                    selectedIds={ _.map(participants, al => al.participantId) }
                />
            </div>
        )
    }
}

export default AttendeeLines;