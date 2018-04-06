    import React from 'react';
import BaseCard from 'core/components/base-card';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FontIcon from 'material-ui/lib/font-icon';
import ListItem from 'material-ui/lib/lists/list-item';
import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';
import EmailLink from 'sap/components/buttons/EmailLink';
// import SapAnywhereButton from 'sap/components/buttons/SapAnywhereButton';

import FlatButton from 'sap/components/buttons/FlatButton';

export default class InformationCard extends React.Component {
    constructor(props) {
        super(props);
    }
    _buildSections(customerDetails, fields, fieldsDescription) {
        var sectionBuild = [], currentSplit, currentFields=[];
        fields.forEach( (field, index) => {
            if (!!~field.indexOf('split')) {
                /// if field is split save in current split
                if (!currentSplit) {
                    currentSplit = field;
                } else {
                    /// if there is a previous split, build the previous split
                    sectionBuild.push({
                        section: fieldsDescription[currentSplit].label,
                        fields: currentFields
                    });
                    currentFields = [];
                    currentSplit = field;
                }

            } else {
                currentFields.push({
                    label: fieldsDescription[field].label,
                    value: customerDetails[field]
                });
            }

            if (index === (fields.length-1)) {
                sectionBuild.push({
                    section: fieldsDescription[currentSplit].label,
                    fields: currentFields
                });
            }
        });

        console.debug('section builds', sectionBuild);
        return sectionBuild;
    }
    onEditClick(ev) {
        // this.props.actions.RenderCreatePage({ model: this.state.currentCustomer });
        this.props.onEditClick && this.props.onEditClick();
    }
    render() {
        let editIcon = <FlatButton
                            onTouchTap={this.onEditClick.bind(this)}>
                                Edit
                        </FlatButton>

        var sections = this._buildSections(this.props.details, this.props.fields, this.props.fieldsDescription);
        var styles = {
            label: {
                color: 'rgba(0, 0, 0, 0.54)',
                fontSize: 12
            },
            value: {
                color: 'rgba(0, 0, 0, 0.87)',
                fontSize: 14,
            },
            container: {
                padding: '17px 16px 13px 16px'
            }
        }
        return (
            <BaseCard rightButtonEl={editIcon}>
                {
                    sections.map(section => {
                        return (
                            <div key={section.section}>
                                <List
                                    key={section.section}
                                    style={{overflowWrap: 'break-word'}}
                                    subheader={
                                        <div style={{color:'#474747', fontSize:16, fontWeight:'bold', whiteSpace:'nowrap', position:'relative', left:-12}}>
                                            {section.section}
                                            <Divider style={{color:'#c6d7ed', border: 'none', borderBottom:'1px dashed #c6d7ed', backgroundColor:'transparent'}}/>
                                        </div>
                                    }>
                                            {
                                                section.fields.filter(field => field.value).map(field => {
                                                    var valueEl;
                                                    if (field.label === 'Phone' || field.label === 'Mobile') {
                                                        valueEl = <a href={`tel:${field.value}`}>{field.value}</a>
                                                    } else if (field.label === 'Email') {
                                                        valueEl = <EmailLink email={field.value}/>
                                                    }else {
                                                        valueEl = field.value || '--';
                                                    }
                                                    return (
                                                        <div style={styles.container} key={field.label}>
                                                            <div style={styles.label}>{field.label}</div>
                                                            <div style={styles.value}>{valueEl}</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                </List>
                            </div>
                        )
                    })
                }
            </BaseCard>
        );
    }
}
