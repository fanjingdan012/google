import React from 'react';

import Divider from 'material-ui/lib/divider';
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';
import CircularProgress from 'material-ui/lib/circular-progress';
import List from 'material-ui/lib/lists/list';

import FlatButton from 'sap/components/buttons/FlatButton';

class Picker extends React.Component {

    static propTypes = {
        defaultOpen: React.PropTypes.bool,
        onFilterChange: React.PropTypes.func,
        isLoaded: React.PropTypes.bool,
        filter: React.PropTypes.string,
    };
    static defaultProps = {
        isLoaded: true,
        onFilterChange: () => {},
        defaultOpen: false,
        filter: '',
    };

    constructor(props) {
        super(props);
        this.displayName = "Picker";

        this.state = {
            open: props.defaultOpen
        };
    }

    onSelect(value) {
        this.props.onSelect && this.props.onSelect(value);
        this.close();
    }
    show() {
        this.setState({open: true});
    }
    close() {
        this.setState({open: false});
    }
    prepareListItem(item) {
        var { onTouchTap, value, ...other } = item.props;
        var onClick = () => {
            this.onSelect(value);
            onTouchTap && onTouchTap(ev, value);
        }
        var props = {
            onTouchTap: onClick
        };
        return [React.cloneElement(item, props), <Divider key={`divider-${item.props.key}`}/>];
    }
    buildContent(children) {
        var items = _.map( children, c => this.prepareListItem(c) );
        return (
            <List>
                {items}
            </List>
        );
    };
    render() {
        var {
            children,
            title,
            onFilterChange,
            isLoaded,
            filter
        } = this.props;
        var { open } = this.state;
        var standardActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={() => this.close()}
            />
        ];
        var styles = {
            title: {
                margin: 0,
                color: 'rgba(0, 0, 0, 0.87)',
                fontSize: 24,
                lineHeight: '32px',
                fontWeight: 400,
            },
            titleContainer: { padding: '24px 24px 0 24px' }
        };

        var len = children && children.length ? `(${children.length})` : '';

        var titleEl = (
            <div style={styles.titleContainer}>
                <h3 style={styles.title}>{`${title} ${len}`}</h3>
                <TextField
                    hintText="Search"
                    fullWidth={true}
                    value={filter}
                    onChange={onFilterChange}/>
            </div>
        )
        return (
            <Dialog
                open={open}
                actions={standardActions}
                autoDetectWindowHeight={true}
                autoScrollBodyContent={true}
                onRequestClose={this.close.bind(this)}
                title={titleEl}
                bodyStyle={{paddingTop: 0}}
                contentStyle={{width: 420}}>
                {isLoaded ?
                    this.buildContent(children)
                    : <div style={{textAlign: 'center'}}><CircularProgress mode="indeterminate" /></div>
                }
            </Dialog>
        );
    }
}
export default Picker;