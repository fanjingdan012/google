import React from 'react';
import Reflux from 'reflux';
import Paper from 'material-ui/lib/paper';

export default React.createClass({
        mixins: [Reflux.ListenerMixin],
        //mixins: [Reflux.connect(Stores.Tooltip)],
        // componentWillUpdate: function(nextProps, nextState) {
        //     if (nextState.element) {
        //         this.closePoll();
        //         nextState.selfOut = false;
        //         nextState.parentOut = false;
        //     }
        // },
        getInitialState: function() {
            return this.props.store.getState();
        },
        componentDidMount: function() {
            this.listenTo(this.props.store, this.storeChange);
        },
        storeChange: function(data) {
            if (data.element) {
                this.closePoll();
                data.selfFocus = false;
                data.parentOut = false;
                data.mustClose = false;
            }

            this.setState(data);
        },
        pollHover: function() {
            this.poll = setInterval(function() {
                if (!$(this.state.parentEl).is(':hover')) {
                    this.setState({parentOut: true});
                    this.closePoll();
                }
            }.bind(this), 100)
        },
        closePoll: function() {
            clearInterval(this.poll);
            this.poll = null;
        },
        onMouseOut: function() {
            this.setState({selfFocus: false});
        },
        onMouseEnter: function() {
            this.state.selfFocus = true;
        },
        delayClose: function() {
            setTimeout(() => {
                if (this.state.parentOut && !this.state.selfFocus && !this.state.mustClose) {
                    this.setState({mustClose: true});
                }
            }, 500);
        },
        render: function() {
            var elPosition = this.state.parentEl.getBoundingClientRect ? this.state.parentEl.getBoundingClientRect() : {};

            var style = {
                root: {
                    position: 'absolute',
                    //left: elPosition.left - 80,
                    //top: elPosition.top - 40,
                    bottom: 50,
                    //right: elPosition.right - 1219,
                    right: 302,
                    zIndex: 5,
                    padding: 20,
                    width: 500,
                    height: '75%',
                    overflow: 'auto',
                    fontSize: 14,
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    color: '#222',
                    WebkitFontSmoothing: 'antialiased'
                    //bottom: 50
                }
            };

            var toClose = this.state.parentOut && !this.state.selfFocus;

            if (!toClose && this.state.element && !this.poll) {
                this.pollHover();
            } else {
                this.delayClose();
                this.closePoll();
            }

            return (
                <Paper zDepth={3} className={(this.state.mustClose ? 'hide ':' ') + 'wizy-tooltip'} style={style.root} onMouseLeave={this.onMouseOut} onMouseEnter={this.onMouseEnter}>
                    {this.state.element}
                </Paper>
            );
        }
    });