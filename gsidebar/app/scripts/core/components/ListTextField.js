import React from 'react';

import TextField from 'material-ui/lib/text-field';



class ListTextField extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'ListTextField';

        var defaultValue = (_.isArray(this.props.defaultValue) && this.props.defaultValue.length > 0) ?
            _.map(this.props.defaultValue, (val, index) => ({
                    ref: index,
                    value: val
            })) : [{
                ref: 0,
                value: ''
            }]

        this.state = {
            fields:  defaultValue
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.fields.length === 0) {
            this.setState({
                fields: [{
                    ref: 0,
                    value: ''
                }]
            });
        }
    }
    getValue() {
        return _.map(this.state.fields, f => this._getInputField(f).getValue());
    }
    removeField(index) {
        var fields = this.state.fields;
        fields.splice(index, 1);
        this.setState({fields: fields});
    }
    addField() {
        var fields = this.state.fields;
        fields.push({
            ref: fields[fields.length - 1].ref + 1,
            val: ''
        });
        this.setState({fields}, () => {
            var ref = 'field-' + this.state.fields[this.state.fields.length - 1].ref;
            this.refs[ref].focus();
        });
    }
    _getInputField(field) {
        return this.refs['field-' + field.ref];
    }
    _buildTextField(field, index) {
        var styles = {
            root: {
                position: 'relative'
            },
            delIconContainer: {
                cursor: 'pointer',
                position: 'absolute',
                bottom: 15,
                right: 0
            },
            delIcon: {
                fontSize: 14,
                color: '#757575'
            },
            textField: {
                paddingRight: 25
            }
        }
        return (
            <div style={styles.root} key={field.ref + '-container'}>
                <div>
                    <TextField
                        key={field.ref}
                        defaultValue={field.value}
                        ref={'field-' + field.ref}
                        fullWidth={this.props.fullWidth || true}
                        floatingLabelText={index === 0 ? this.props.floatingLabelText : null}
                        style={styles.textField}
                        onEnterKeyDown={this.onAdd}
                        disabled={this.props.disabled}
                        />
                </div>
                <div
                    style={styles.delIconContainer}
                    onClick={() => {
                        this.removeField(index);
                    }}>

                    <i className="material-icons" style={styles.delIcon}>delete</i>
                </div>
            </div>
        )
    }
    render() {
        var styles = {
            root: {
                position: 'relative'
            },
            addBtn: {
                float: 'right',
                color: '#2196F3',
                cursor: 'pointer',
                fontSize: 13
            }
        }
        var fields = _.map(this.state.fields, (field, index) => {
            return this._buildTextField(field, index);
        })
        return (
            <div {...this.props} style={_.extend(this.props.style || {}, styles.root)}>
                {fields}
                <div style={styles.addBtn} onClick={() => this.addField()}>
                    Add
                </div>
            </div>
        )
    }
}

export default ListTextField;
