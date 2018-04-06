import React from 'react';
import ListCard from './ListCard';
import ContactActions from 'sap/actions/contacts';
// import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Badge from 'material-ui/lib/badge';

class RelatedContactsCard extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'RelatedContactsCard';
        this.state = {
            isLoaded: false,
            contacts: []
        }
    }
    componentDidMount() {
        ContactActions.GetContactsByCustomerId(this.props.customerId)
            .then(contacts => this.setState({contacts, isLoaded: true}))
            .catch(err => this.setState({isLoaded: false}));
    }
    onContactClick(id) {
        ContactActions.ShowContactPage(id);
    }
    render() {
        var {contacts, isLoaded} = this.state;
        var title = 'Related Contacts';
        var items = _.map(contacts, c => {
            return [<ListItem
                        primaryText={<div style={{fontSize: 14}}>{c.displayName}</div>}
                        secondaryText={<div style={{fontSize: 12}}>{c.email}</div>}
                        onTouchTap={this.onContactClick.bind(this, c.id)}/>]
        })
        return (
            <ListCard
                length={contacts.length || 0}
                listTitle={title}
                isLoading={!isLoaded}
                disabled={items.length === 0}
                cardTextStyle={{padding: 0}}
                type="list"
                limit={3}>
                    {items}
            </ListCard>
        );
    }
}
export default RelatedContactsCard;
