import React from 'react';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import CardTitle from 'material-ui/lib/card/card-title';
import LinearProgress from 'material-ui/lib/linear-progress';
import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';
import IconButton from 'material-ui/lib/icon-button';

class Logo extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'CardLogo';
    }
    render() {
        var styles = {
            container: {
                minHeight: 48,
                position: 'relative',
                width: 32,
                margin: '0 15px',
                float: 'left'
            },
            img: {
                margin: 0,
                position: 'absolute',
                transform:' translate(0, -50%)',
                top: '50%'
            },
            icon: {
                margin: 0,
                position: 'absolute',
                transform:' translate(0, -50%)',
                top: '50%',
                fontSize: 32,
                color: this.props.leftIconColor
            }
        }
        if (this.props.leftLogo) {
            return <div style={styles.container}>
                        <img src={this.props.leftLogo} style={styles.img}/>
                    </div>
        } else if (this.props.leftIcon) {
            return <div style={styles.container}>
                        <i className="material-icons" style={styles.icon}>{this.props.leftIcon}</i>
                    </div>
        }
        return null;
    }
}


class BaseCard extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'BaseCard';
        this.state = {
            showAll: false
        }
    }
    viewButtonClick(ev) {
        this.setState({
            showAll: !this.state.showAll
        })
    }
    render() {
        var { children,
            type,
            cardTitle,
            avatarTitle,
            disabled,
            isLoading,
            rightButtonEl,
            bottomElement,
            limit,
            cardTextStyle,
            listTitle,
            ...other
        } = this.props;
        var showAll = this.state.showAll;
        var styles = {
            title: {
                fontSize: 16,
                color: '#9e9e9e',
                lineHeight: '16px'
            },
            rootTitle: {
                // borderBottom: '1px solid #e0e0e0'
                textAlign:'center'
            },
            card: {
                overflow: 'visible',
                margin: '0.5rem 0 1rem 0',
                width: '100%',
                opacity: 1,
                position: 'relative',
                zIndex: 'initial',
                opacity: disabled ? 0.5 : 1,
                boxShadow:'none',
                // borderBottom:'1px solid #C6D7ED'
            },
            loading: {
                marginTop: 60
            },
            rightButtonEl: {
                position: 'absolute',
                top: 13,
                right: 0,
                zIndex: 1
            },
            cardText: {
                padding: 7
            }
        }
        var title = cardTitle ? <CardTitle
                                title={cardTitle}
                                style={styles.rootTitle}
                                titleStyle={styles.title}
                                avatar={avatarTitle}/> : null;
        var loading = isLoading ?
            <div>
                <div>
                    <LinearProgress mode="indeterminate"/>
                </div>
            </div>
        : null;
        var rightButtonEl = rightButtonEl ? React.cloneElement(rightButtonEl, {style: styles.rightButtonEl}) : null;
        var content = children, viewButton;
        if (type === 'list' && Array.isArray(children)) {
            content = <List
                            subheader={
                                <div style={{
                                    color:'#474747',
                                    fontSize:16,
                                    fontWeight:'bold',
                                    whiteSpace:'nowrap',
                                    position:'relative',
                                    left:-12
                                }}>
                                    {listTitle}
                                    <Divider
                                        style={{
                                            color:'#c6d7ed',
                                            border:'1px dashed #c6d7ed',
                                            backgroundColor:'transparent'
                                        }}/>
                                </div>}>
                            {showAll ? children : children.slice(0, limit)}
                        </List>
            if (limit < children.length) {
                viewButton = <IconButton
                            color='#42A5F5'
                            iconClassName="material-icons"
                            data-tooltip={showAll ? 'VIEW LESS' : 'VIEW MORE'}
                            onTouchTap={(ev) => this.viewButtonClick(ev)}
                            style={{
                                padding: 1,
                                width: 25,
                                height: 25,
                                left: '45%'
                            }}
                            iconStyle={{color: '#42A5F5'}}>
                                {showAll? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        </IconButton>
            }

        }
        return (
            <Card style={styles.card} className='wz-card'>
                <Logo {...other}/>
                {title}
                {rightButtonEl}
                {loading}
                {children && !disabled && !isLoading ?
                    <CardText style={_.extend(styles.cardText, cardTextStyle)}>
                        {content}
                    </CardText>
                : null}
                {viewButton}
                {bottomElement && !isLoading ? bottomElement : null}
            </Card>
        );
    }
}

export default BaseCard;
