import React from 'react';
import DetailAppbar from 'core/components/detail-appbar';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';
export default React.createClass({
    getInitialState() {
        var labelOpacity = 1,
            position = 'absolute',
            imageSize = 63,
            imageBorder = 2,
            height = 110,
            marginLabel = '10px 2px 5px 10px',
            iconBtnTop = 4,
            peak = false,
            top = 33,
            left = 30,
            labelWidth = 175;
        return {
            detailAppbarState: {labelOpacity, position, imageSize, imageBorder, height, marginLabel, iconBtnTop, peak, top, left, labelWidth}
        }
    },
    componentDidMount() {
        if (this.props.hasDetailAppbar) {
            this.listenToBodyScroll();
        }
    },
    componentWillUnmount() {
        $('.base-page').unbind('scroll');
    },
    listenToBodyScroll: function() {
            var self = this;
            function computeAppbar(ev) {
                var labelOpacity = (ev.target.scrollTop / 116) - 0.2
                var height = 40,
                    //margin = '-29px 0 0 30px',
                    top = 33,
                    position = 'absolute',
                    left = 30,
                    imageSize = '33px',
                    imageBorder = 2,
                    marginLabel = '6px 9px 0',
                    iconBtnTop = 4,
                    labelWidth = 175,
                    peak = true;

                if (labelOpacity < 0) {
                    labelOpacity = 1;
                    //margin = '0 0 0 15px';
                    imageSize = 63;
                    imageBorder = 2;
                    height = 110;
                    marginLabel = '10px 2px 5px 10px';
                    iconBtnTop = 4;
                    peak = false;
                    top = 33;
                    left = 30;
                    labelWidth = 175;
                } else {
                    height = 40;
                    //margin = '-29px 0 0 30px';
                    imageBorder = 2;
                    imageSize = 33;
                    marginLabel = '6px 9px 0';
                    iconBtnTop = 4;
                    peak = true;
                    top = 4;
                    left = 40; 
                    labelWidth = 123;
                }
                if (self.state.detailAppbarState.peak != peak) {
                    self.setState({
                        detailAppbarState: {
                            labelOpacity: 1,
                            height: height,
                            imageSize: imageSize,
                            imageBorder: imageBorder,
                            //margin: margin,
                            marginLabel: marginLabel,
                            iconBtnTop: iconBtnTop,
                            peak: peak,
                            position: position,
                            top: top,
                            left: left,
                            labelWidth: labelWidth
                        }
                    });
                }
            }
            $('.base-page').unbind('scroll').scroll(function(ev) {
                setTimeout(function() {
                    computeAppbar(ev);
                }, 10);
            }.bind(this));
        },
    render: function() {
        if (this.props.isLoading) {
            return this._buildLoadingMarkup();
        }
        var styles = {
            root: {
                overflowY:'auto',
                height: '94%',
                padding: '0 3px 83px 7px'
            }
        };
        return (
            <div style={{height: '100%'}}>
                {this.props.hasDetailAppbar ? <DetailAppbar {...this.props.detailAppbarProps} {...this.state.detailAppbarState}/> : this.props.appBar}
                <div style={_.extend(styles.root, this.props.style)} className="base-page">
                    <div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    },
    _buildLoadingMarkup() {
        return <div style={{position: 'relative'}}>
                    <RefreshIndicator left={125} top={20} status="loading"/>
                </div>
    }
})