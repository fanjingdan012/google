import React from 'react';
import TextField from 'material-ui/lib/text-field';
import RaiseButton from 'material-ui/lib/raised-button';
import SelectField from 'material-ui/lib/select-field';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import TimePicker from 'material-ui/lib/time-picker';
import Toggle from 'material-ui/lib/toggle';
import Divider from 'material-ui/lib/divider';
import Checkbox from 'material-ui/lib/checkbox';

const TIME_FORMAT = 'HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

class ControlledSelect extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'ControlledSelect';
        var {menuItems, ...other} = this.props;
        var defaultValue = menuItems[0];
        if (other.defaultValue) {
            defaultValue = _.find(menuItems, function (item) {
                return item.payload === other.defaultValue;
            });
        }

        this.state = {
            value: defaultValue,
        };
    }
    getValue() {
        return this.state.value && this.state.value.payload;
    }
    render() {
        return <SelectField {...this.props} value={this.state.value.payload} onChange={this._handleChange.bind(this)}/>
    }
    _handleChange(name, event, value) {
        this.setState({value: value});
        this.props.onChange && this.props.onChange(name, event, value)
    }
}
export {ControlledSelect}

class DateTimePicker extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'DateTimePicker';
    }
    getValue() {
        var time = moment(this.refs.timePicker.getTime()).format(TIME_FORMAT);
        var date = moment(this.refs.datePicker.getDate()).format(DATE_FORMAT);
        return moment(`${date}T${time}`, DATE_TIME_FORMAT).toDate();
    }
    render() {
        var { hintText, floatingLabelText, defaultValue, ...other } = this.props;
        var styles = {
            label: { fontSize: 14, display: 'inline-block', width: 92 },
            picker: { display: 'inline-block', marginRight: 20 }
        }
        var value = defaultValue ? new Date(defaultValue) : null;
        var dateProps = {
            ref: 'datePicker',
            style: styles.picker,
            hintText: "Date",
        };
        var timeProps = {
            ref: 'timePicker',
            style: styles.picker,
            hintText: 'Time',
        };
        if (value) {
            timeProps.defaultTime = value;
            dateProps.defaultDate = value;
        }
        return (
            <div style={this.props.style}>
                <div style={styles.label}>
                    {this.props.floatingLabelText}
                </div>
                <DatePicker {...other} {...dateProps}/>
                <TimePicker {...other} {...timeProps}/>
            </div>
        )
    }

}
export {DateTimePicker};

class TextArea extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Form';
    }
    getValue() {
        return this.refs.textField.getValue();
    }
    render() {
        return (
            <TextField {...this.props} multiLine={true} ref="textField"/>
        )
    }
}
export {TextArea};

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Form';
        this.getValues = this.getValues.bind(this);
    }
    getValues() {
        let values = {};
        _.each(this.props.fields, function (field, i) {
            switch (field.type) {
                case 'date':
                    values[i] = this.refs[`field-${i}`].getDate();
                    break;
                case 'toggle':
                    values[i] = this.refs[`field-${i}`].isToggled();
                    break;
                case 'checkbox':
                    values[i] = this.refs[`field-${i}`].isChecked();
                    break;
                default:
                    values[i] = this.refs[`field-${i}`].getValue();
            }
        }.bind(this))
        return values;
    }
    render() {

        var {columns, fields, model} = this.props;
        var keys = _.keys(fields);
        var rows = [], i, j;
        if (columns !== undefined && columns > 1) {
            for (i = 0; i < keys.length; i += 2) {
                var cols= [];
                for (j = 0; j < +columns; j++) {
                    let key = keys[ i + j ];
                    if (key) {
                        if (key === '_divider') {
                            rows.push(<Divider />)
                        } else {
                            cols.push(this.createField(fields[key], key, model));
                        }

                    }

                }
                rows.push(<div style={{clear: 'both', display: 'block'}}>{cols}<div style={{clear: 'both'}}/></div>)
            }
            return <div>{rows}</div>
        }
        return <div>{_.map(fields, (field, key) => this.createField(field, key, model))}</div>;
    }
    createField(field, key, model) {
        var defaultValue = field.defaultValue || (model && model[key]);
        var components = {
            'text': TextField,
            'select': ControlledSelect,
            'date': DatePicker,
            'datetime': DateTimePicker,
            'textarea': TextArea,
            'toggle': Toggle,
            'checkbox': Checkbox
        }
        var defaultProps = {
            floatingLabelText: field.label,
            ref: `field-${key}`,
            key: `field-${key}`,
            fullWidth: true,
            disabled: this.props.disabled,
            defaultValue,
        }
        switch (field.type) {
            case 'select':
                defaultProps.menuItems = field.options;
                // defaultProps.defaultValue = field.defaultValue;
                break;
            case 'toggle':
            case 'checkbox':
                defaultProps.label = field.label;
                break;
            case 'date':
                defaultProps.defaultDate = defaultValue && moment(defaultValue).toDate();
                break;
            case 'time':
                defaultProps.defaultTime = defaultValue && moment(defaultValue).toDate();
                break;
            default:
                defaultProps.fullWidth = true;
        }
        var props = _.extend(defaultProps, field.props);
        var component = React.createElement(field.component || (field.type && components[field.type]) || components['text'], props, null);
        if (this.props.columns !== undefined && this.props.columns > 1) {
            return (
                <div style={{float: 'left', padding: '0 10px', width: `${100/this.props.columns}%`}}>
                    {key === '_divider' ? <Divider /> : component}
                </div>
            )
        }
        return component;

    }
}

export default Form;

