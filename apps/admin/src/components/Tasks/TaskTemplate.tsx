import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import { green, white } from 'styles/colors';
import Input from 'atoms/Input';
import Badge from 'atoms/Badge';
import Button from 'atoms/Button';
import Panel from 'atoms/Panel';
import StackedInputRow from 'components/Forms/StackedInputRow';
import { Task } from '../../reducers/tasks';

interface Props {
  className?: string;
  task: Task;
  addTask(task: Task): void;
  history: any;
}

class TaskTemplate extends React.Component<Props, {}> {
  render() {
    const { className, task } = this.props;

    return (
      <div onClick={this.handleClick}>
        <Panel className={className}>
          <Box>
            <Badge text={task.category} />
          </Box>
          <Flex alignItems="center" className="task-row">
            <Box width={5 / 6}>
              <h3>{task.title}</h3>
            </Box>
            {/* TODO: circle should link to edit page */}
            <Box className="edit-link" width={1 / 6}>
              <Link to={{ pathname: `/clients/6/tasks/${task.id}/edit` }}>
                <div className="circle">Edit</div>
              </Link>
            </Box>
          </Flex>
        </Panel>
      </div>
    );
  }

  private handleClick = async event => {
    await this.props.addTask(this.props.task);
    this.props.history.push(`/clients/${this.props.task.user_id}/tasks`);
  };
}

const StyledTaskTemplate = styled(TaskTemplate)`
  .task-row {
    height: 100%;
  }
  .edit-link {
    a {
      color: ${white};
      text-decoration: none;
    }
  }
  .circle {
    background-color: ${green};
    border-radius: 50%;
    display: table-cell;
    height: 50px;
    text-align: center;
    vertical-align: middle;
    width: 50px;
  }
`;

export default StyledTaskTemplate;
