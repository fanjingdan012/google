import React from 'react';
import LoginForm from './LoginForm';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import Container from 'core/components/Container';
import Store from 'sap/stores/authentication';

class Authentication extends React.Component {
	constructor(props) {
		super(props);
	}
	getView(status) {
		let view;
		switch(status) {
			case 'authenticating':
				view =
					<div>
						<RefreshIndicator top={180} left={125} status="loading"/>
						<div>Authenticating</div>
					</div>;
				break;
			/// test views to check status
			case 'fail':
				view = <LoginForm {...this.props}/>;
				break;
			case 'success':
				view =
					<div>
						Authentication Success
					</div>;
				break;
		}

		return view;
	}
	render() {
		return this.getView(this.props.authStatus);
	}
}

Authentication.propTypes = {
	authStatus: React.PropTypes.string
};

export default Container(Authentication, Store);
