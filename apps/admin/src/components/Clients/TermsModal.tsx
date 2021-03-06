import Button from 'atoms/Buttons/Button';
import { formatNumber } from 'libphonenumber-js';
import React from 'react';
import styled from 'styled-components';
import { green } from 'styles/colors';
import { sansSerif, serif } from 'styles/type';

interface Props {
  phoneNumber: string;
  onClose(): void;
}

export const TERMS = 'TERMS';

export class TermsModal extends React.Component<Props> {
  formattedPhoneNumber() {
    return formatNumber(this.props.phoneNumber, 'US', 'National');
  }

  render() {
    return (
      <Container>
        <h1>
          Text START to <address>{this.formattedPhoneNumber()}</address> to get
          started.
        </h1>
        <p>
          By continuing, you (the Client) agree to receive autodialed text
          messages to the mobile device phone number you provided and push
          notifications from the Steps application to your mobile device. You
          may opt-out of receiving text messages at any time by replying STOP to
          any Steps text message. Message and data rates may apply.
        </p>

        <p>
          The information you provide to this application (such as chat content,
          your financial plan, etc) may be used by your financial coach and{' '}
          <a href="https://www.ideo.org">IDEO.org</a>, the Step application’s
          creators (a non-profit) to evaluate the effectiveness of the app. Your
          information may also be used in promotional materials; but if we do
          so, your information will be anonymized.
        </p>

        <p>
          You will never be asked for personal information such as your Social
          Security Number, bank accounts, or credit card numbers. For your own
          privacy and protection never send this type of information when
          communicating with the app.
        </p>

        <p>By texting the number, you agree to these terms and conditions.</p>

        <p className="terms-link">
          <a href="http://steps.ideo.org/#/terms">Terms & Conditions</a>
        </p>

        <a onClick={this.props.onClose}>
          <Button>Next</Button>
        </a>
      </Container>
    );
  }
}

const Container = styled.div`
  text-align: center;
  h1 {
    font-family: ${serif};
    font-weight: 600;
  }
  p {
    font-family: ${sansSerif};
    text-align: left;
    a {
      text-decoration: none;
      color: ${green};
    }
  }
  address {
    display: inline;
    color: ${green};
    font-style: normal;
  }
  button {
    margin-top: 14px;
  }
  .terms-link {
    text-align: center;
  }
`;

export default TermsModal;
