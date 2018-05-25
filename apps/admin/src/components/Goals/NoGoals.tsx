import React, { Component } from 'react';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import { yellow } from 'styles/colors';
import ButtonLink from 'atoms/ButtonLink'
import Panel from 'atoms/Panel';

interface Props {
  className?: string;
}

class NoGoals extends React.Component<Props, {}> {

  render() {
    const { className } = this.props;

    return (
      <Box width={1} p={4} className={className}>
        <Panel>
          <div className='star'>★</div>
          <div>Create your first goal.</div>
          <Box m={2}><ButtonLink to='/clients/:id/goals/new'>Add Goal</ButtonLink></Box>
        </Panel>
      </Box>
    );
  }
}

const StyledNoGoals = styled(NoGoals)`
  text-align: center;
  font-size: 1.5em;
  line-height: 1.5;

  button {
    margin-top: 1em;
  }
  .star {
    color: ${yellow};
    font-size: 5em;
  }
`;

export default StyledNoGoals;
