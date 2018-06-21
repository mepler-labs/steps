import React, { Component } from 'react';
import styled from 'styled-components';
import { SortableElement } from 'react-sortable-hoc';
import { Flex, Box } from 'grid-styled';
import { blue, lightGrey, green, white } from 'styles/colors';
import { remCalc, sansSerif } from 'styles/type';
import { Link } from 'react-router-dom';
import { Task } from 'reducers/tasks';

const StyledLink = styled(Link)`
  color: ${green};
  font-size: 0.8em;
  margin-top: 0.5em;
  text-decoration: none;
  text-transform: uppercase;
`;

interface Props {
  key: string;
  setTaskStatus;
  index: number;
  task: Task;
  url: string;
}

export default SortableElement((props: Props) => {
  const { setTaskStatus, task, url } = props;
  const toggleTaskStatus = e => {
    const status = task.status === 'COMPLETED' ? 'ACTIVE' : 'COMPLETED';
    setTaskStatus(task, status);
  };

  const checked =
    task.status === 'COMPLETED' ? 'check_circle' : 'check_circle_outline';

  return (
    <Background
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="center"
      p={20}
      width={1}
    >
      <Flex flexDirection="row" alignItems="center">
        <div onClick={toggleTaskStatus}>
          <i className={`material-icons ${checked}`}>{checked}</i>
        </div>
        <Title>{task.title}</Title>
      </Flex>
      <Box ml={34}>
        <StyledLink to={`${url}/${task.id}`}>View Steps &rarr;</StyledLink>
      </Box>
    </Background>
  );
});

const Background = styled(Flex)`
  background: ${white};
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;

  i.material-icons {
    cursor: pointer;
    width: 24px;
  }

  .check_circle {
    color: ${blue};
  }

  .check_circle_outline {
    color: ${lightGrey};
  }
`;

const Title = styled.h3`
  font-family: ${sansSerif};
  font-size: ${remCalc(24)};
  font-weight: 500;
  margin-top: 0;
  margin-left: 10px;
  margin-right: 0;
  margin-bottom: ${remCalc(10)};
`;
