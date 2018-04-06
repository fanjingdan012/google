import React from 'react';
import BaseDialog from './BaseDialog';
import Form from 'core/components/form';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import LinearProgress from 'material-ui/lib/linear-progress';
import FlatButton from 'sap/components/buttons/FlatButton';
import colors from 'sap/styles/colors';


class ModalForm extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'ModalForm';
        this.state= {
            open: true,
            isLoading: false
        }
        this.columns = 2;
    }
    componentWillReceiveProps(nextProps) {
        this.setState({open: true});
    }
    close() {
        this.setState({open: false});
    }
    onDialogSubmit() {
        this.setState({isLoading: true});
        var formValues = this.refs.form.getValues();
        if (this.props.onSubmit) {
            var promise = this.props.onSubmit(formValues, () => {
                this.setState({open: false, isLoading: false})
            }, () => this.showLoading(false));
        }
        this.onSubmit && this.onSubmit(formValues);
    }
    showLoading(bool=true) {
        this.setState({isLoading: bool});
    }
    onRequestFail() {
        this.showLoading(false);
    }
    onRequestSuccess() {
        this.setState({
            open: false,
            isLoading: false
        });
    }
    getFields() {
        return this.props.fields;
    }
    getTitle() {
        return this.props.title;
    }
    getModel() {
        return this.props.model;
    }
    getStyles() {
        return {};
    }
    onSubmit() {
        this.onRequestSuccess();
    }
    render() {
        var {open, isLoading} = this.state,
            styles = this.getStyles(),
            fields = this.getFields(),
            title = this.getTitle(),
            titleStyle = {
                margin: 0,
                color: colors.text,
                fontSize: 24,
                lineHeight: '32px',
                fontWeight: 400,
                padding: 24
            },
            dialogTitle = (
                <div>
                    <h3 style={titleStyle}>{title}</h3>
                    {isLoading ? <LinearProgress mode="indeterminate" /> : null}
                </div>
            );

        var actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={() => this.close()}
                disabled={isLoading}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onTouchTap={() => this.onDialogSubmit()}
                disabled={isLoading}
            />
        ];
        return (
            <BaseDialog
                open={open}
                actions={actions}
                autoDetectWindowHeight={true}
                autoScrollBodyContent={true}
                bodyStyle={{ paddingTop: 5, borderBottom: `1px solid ${colors.border}` }}
                onRequestClose={this.close.bind(this)}
                title={dialogTitle}
            >
                <CardText style={styles.cardText}>
                    <Form
                        fields={fields}
                        ref="form"
                        columns={this.columns}
                        disabled={this.state.isLoading}
                        model={this.getModel()}
                    />
                </CardText>
            </BaseDialog>
        );
    }
}

export default ModalForm;
