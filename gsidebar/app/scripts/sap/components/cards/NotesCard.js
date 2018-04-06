import React from 'react';
import BaseCard from 'core/components/base-card';

import CustomersApi from 'sap/api/customers';
import ContactsApi from 'sap/api/contact-persons';

// import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import FontIcon from 'material-ui/lib/font-icon';
import Badge from 'material-ui/lib/badge';

import ListCard from './ListCard';
import sapUtils from 'sap/utils';

class NotesCard extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'NotesCard';
        this.state = {
            notes: [],
            isLoaded: false
        }
    }
    componentDidMount() {
        var {type, id} = this.props;
        switch(type) {
            case 'customer':
                CustomersApi.getNotes(id)
                    .then(res => this.onGetNoteCompleted(res))
                    .catch(err => this.onGetNoteFailed(err));
                break;
            case 'contact':
                ContactsApi.getNotes(id)
                    .then(res => this.onGetNoteCompleted(res))
                    .catch(err => this.onGetNoteFailed(err));
                break;
        }
    }
    onGetNoteCompleted(res) {
        this.setState({
            isLoaded: true,
            notes: res
        });
    }
    onGetNoteFailed(err) {
        this.setState({
            isLoaded: true,
            notes: []
        });
    }
    render() {
        var {isLoaded, notes} = this.state;
        var title = 'Notes';
        var items = _.map(notes, note => {
            return <ListItem
                        disabled={true}
                        primaryText={note.content}
                        key={note.id}
                        onTouchTap={(ev) => window.open(sapUtils.getPermaLink('Note', note.id))}/>
        });
        return (
            <ListCard
                length={notes.length || 0}
                listTitle={title}
                isLoaded={isLoaded}
                disabled={notes.length === 0}
                cardTextStyle={{padding: 0}}
                limit={3}>
                    {items}
            </ListCard>
        );
    }
}

export default NotesCard;
