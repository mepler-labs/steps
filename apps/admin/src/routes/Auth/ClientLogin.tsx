import React from 'react';

import auth0 from 'services/auth0';
import MagicLinkLoginForm from 'forms/MagicLinkLoginForm';
import { AlertLevel } from 'components/Alert/types';
import Panel from 'atoms/Panel';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import { darkBlue, lightBlue } from 'styles/colors';
import { bindActionCreators } from 'redux';
import { addAlert } from 'actions/alerts';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import Alert from 'containers/Alert';

const LoginForm: React.SFC<any> = ({ onSubmit }) => {
  return (
    <Flex flexDirection="column">
      <h1>Welcome back!</h1>
      <p>
        Enter your email address below and we'll send a "magic link" to your
        inbox. Just click the link and we'll take you to your workplan.
      </p>
      <MagicLinkLoginForm onSubmit={onSubmit} />
    </Flex>
  );
};

const EmailIcon = styled.div`
  text-align: center;
  i {
    font-size: 200px;
  }
  color: ${lightBlue};
`;

const Submitted: React.SFC<any> = () => {
  return (
    <Flex flexDirection="column">
      <EmailIcon>
        <i className="material-icons">email</i>
      </EmailIcon>
      <h1>Email sent!</h1>
      <p>
        Please check your email for a new message. Click the magic link and
        we'll take you to your workplan.
      </p>
    </Flex>
  );
};

class ClientLogin extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
    };
  }

  private onSubmit = async ({ email }) => {
    try {
      await auth0.magicLink(email);
      this.setState({ submitted: true });
    } catch (err) {
      this.props.actions.addAlert({
        id: err.message,
        level: AlertLevel.Error,
        message: err.message,
      });
    }
  };

  render() {
    return this.props.isAuthenticated ? (
      <Redirect to="/" />
    ) : (
      <div>
        <Alert />
        <Flex justifyContent="center">
          <Box width={[1, 3 / 4, 1 / 2, 1 / 3]} mt={[0, 4, 4, 4]}>
            <StyledPanel>
              {this.state.submitted ? (
                <Submitted />
              ) : (
                <LoginForm onSubmit={this.onSubmit} />
              )}
            </StyledPanel>
          </Box>
        </Flex>
      </div>
    );
  }
}

const StyledPanel = styled(Panel)`
  padding: 1em 4em;

  h1 {
    color: ${darkBlue};
  }
`;

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ addAlert }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(ClientLogin));
