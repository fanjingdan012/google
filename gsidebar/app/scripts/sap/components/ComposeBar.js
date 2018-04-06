import React from 'react';
import {getValues, getInputField} from 'core/utils/compose';


class SaveToSapCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'SaveToSapCheckbox';
    }
    onCheckboxClick(ev) {
        var {composeId, target} = this.props;
        this.props.onChange && this.props.onChange(ev.target.checked, composeId);
    }
    render() {
        return (
            <td className="track-email" style={{paddingTop: '7px'}}>
              <input type="checkbox" checked={this.props.isChecked} onChange={(ev) => this.onCheckboxClick(ev)} className="filled-in trck-cb" id={'trck-' + this.props.composeId}/>
              <label
                htmlFor={'trck-' + this.props.composeId}
                className="wizy-btn-text"
                style={{
                    color: 'black',
                    fontSize: '13px',
                    // backgroud: `url(${chrome.extension.getURL('images/sap-anywhere-logo.jpg')})`
                }}>
                    Save to <img src={chrome.extension.getURL('images/sap-anywhere-logo.jpg')} style={{transform: 'translateY(4px)', height: 15}}/>
                </label>
            </td>
        );
    }
}



class ComposeBar extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'ComposeBar';
        this.state = {
            isChecked: this.props.isChecked
        }
    }
    componentDidMount() {
        this.setEventListeners(this.props.target);
    }
    onComposeSend(ev) {
        if (this.state.isChecked) {
            var {composeId, target} = this.props;
            var values = getValues(target);
            values.content = getInputField(target, 'body').get(0).innerText.trim();
            this.props.onComposeSend(composeId, values);
        }
    }
    onChange(checked, composeId) {
        this.setState({ isChecked: checked});
    }
    setEventListeners(target) {
        var self = this,
            $target = $(target);

        $target.find('.T-I.J-J5-Ji.aoO.T-I-atl.L3').mousedown((ev) => {
            this.onComposeSend(ev);
        });
        $target.find('.T-I.J-J5-Ji.aoO.L3.T-I-ax7').mousedown((ev) => {
            this.onComposeSend(ev);
        });
        $target.find('.T-I.J-J5-Ji.Uo.T-I-atl.L3').mousedown((ev) => {
            this.onComposeSend(ev);
        });

        // compose old UI, listen to send button
        $('.Q4uFlf.Cq.J-Jw').find('.T-I.J-J5-Ji.Bq.nS.T-I-KE.L3').unbind('mousedown').mousedown((ev) => {
            this.onComposeSend(ev);
        });

        // listen to reply send button old UI
        $('.Q4uFlf.Cq.J-Jw').find('.T-I.J-J5-Ji.Bq.nS.T-I-ax7.L3').unbind('mousedown').mousedown((ev) => {
            this.onComposeSend(ev);
        });

        getInputField(target, 'subject', true).keydown((ev) => {
            if ((event.metaKey || event.ctrlKey) &&  event.keyCode == 13) {
                this.onComposeSend(ev);
            }
        });
        getInputField(target, 'body').keydown((ev) => {
            if ((event.metaKey || event.ctrlKey) &&  event.keyCode == 13) {
                this.onComposeSend(ev);
            }
        });
    }
    render() {
        // <a href="http://wizy.io" target="_blank"><img src={chrome.extension.getURL('images/wizy_logo.png')} style={{width:'24px',height:'24px'}}/></a>
        return (
            <div >
                <div className="wizy-compose-bar wzmat"style={{overflowY: 'visible', opacity: 1}}>
                  <table className="IZ">
                    <tbody>
                        <tr className="n1tfz wizy-compose-tools">
                            <td className="wizy-logo" style={{padding: '7px 1px 0 1px', width: 0}}></td>

                            <SaveToSapCheckbox
                                {...this.props}
                                onChange={(checked, composeId)=> this.onChange(checked, composeId)}
                                isChecked={this.state.isChecked}
                            />

                        </tr>
                    </tbody>
                  </table>
                </div>

            </div>
        );
    }
}

export default ComposeBar;
