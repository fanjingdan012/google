import React from 'react';

import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import LinearProgress from 'material-ui/lib/linear-progress';
import IconButton from 'material-ui/lib/icon-button';

class ListCard extends React.Component {

    static propTypes = {
        title: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.string,
        ]),
        expanded: React.PropTypes.bool,
        expandable: React.PropTypes.bool,
    };

    static defaultProps = {
        expanded: true,
        expandable: true,
    };

    constructor(props) {
        super(props);
        this.displayName = 'ListCard';
        this.state = {
            expanded: !props.expandable && props.expanded,
        };

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.expanded !== this.props.expanded) {
            this.setState({
                expanded: nextProps.expanded
            });
        }
    }

    onExpand() {

        this.setState({ expanded: !this.state.expanded });
    }

    render() {
        var {listTitle, isLoading, length, rightButtonEl, expandable} = this.props;
        var title = _.isString(listTitle) ? listTitle + (length ? ` (${length})` : '') : listTitle;
        var expanded = this.state.expanded;
        var styles = {
            divider: {
                color:'#c6d7ed',
                border: 'none',
                borderBottom:'1px dashed #c6d7ed',
                backgroundColor:'transparent',
                marginRight: 24,
            },
            iconBtn: {
                width: 24,
                height: 24,
                position: 'absolute',
                left: 0,
                top: 11,
                padding: 0,
            },
            icon: {
                color: expanded ? '#474747': '#8b8a8a',
                transform: `rotate(${expanded ? '0' : '180deg'})`,
                transition: 'transform 500ms',
            }
        }
        var subheader = (
            <div style={{
                color: expanded ? '#474747': '#8b8a8a',
                fontSize:16,
                fontWeight:'bold',
                whiteSpace:'nowrap',
                position:'relative',
                left:-12
            }}>
                {expandable ? <IconButton style={styles.iconBtn} iconStyle={styles.icon} onTouchTap={ ev => this.onExpand() }>
                                    <span className="material-icons">keyboard_arrow_up</span>
                                </IconButton>
                : null }
                <div style={{ paddingLeft: expandable ? 24 : 0, cursor: expandable ? 'pointer' : 'initial' }} onTouchTap={ expandable ? e => this.onExpand() : null }>
                    {title}
                </div>
                {!isLoading ?
                     <Divider style={styles.divider}/>
                    : <LinearProgress mode="indeterminate"/>
                }
            </div>
        )
        var rightBtn = rightButtonEl ? React.cloneElement(rightButtonEl, {
            style: {
                position: 'absolute',
                top: 13,
                right: 0,
                zIndex: 1
            }
        }) : null;

        return(
            <Card style={{position: 'relative', boxShadow:'none'}}>
                {rightBtn}
                <CardText style={{padding: 7}}>
                    <List
                        subheader={subheader}>
                        {isLoading || !expanded ? null : this.props.children}
                    </List>
                </CardText>
            </Card>

        );
    }
}

export default ListCard;
