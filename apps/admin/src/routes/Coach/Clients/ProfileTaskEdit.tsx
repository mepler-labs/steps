import Main from 'atoms/Main';
import styled from 'styled-components';
import TaskForm from 'forms/TaskForm';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getTasks, updateTask } from 'actions/tasks';
import { findById } from 'helpers';
import BackButton from 'atoms/Buttons/BackButton';

interface Props {
  className?: string;
  actions: any;
  task: any;
  user: any;
  history: any;
}

class EditTask extends React.Component<Props, {}> {
  componentWillMount() {
    this.props.actions.getTasks();
  }

  handleSubmit = async task => {
    try {
      await this.props.actions.updateTask(task);
      this.props.history.push(
        `/clients/${this.props.user.id}/tasks/${task.id}`,
      );
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { user, task } = this.props;
    if (!task) return null;

    return (
      <Main>
        <BackButton to={`/clients/${this.props.user.id}/tasks/${task.id}`} />
        <H2>Edit Task</H2>
        <p>
          Personalize this task better for your client by editing, adding, or
          deleting steps.
        </p>
        <TaskForm task={task} user={user} onSubmit={this.handleSubmit} />
      </Main>
    );
  }
}

const H2 = styled.h2`
  margin-bottom: 0;
`;

// TODO: Need to request the specific task in order to get the steps
const mapStateToProps = (state, props) => ({
  task: findById(state.tasks, props.match.params.taskId),
  user: findById(state.clients.clients, props.match.params.id),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ getTasks, updateTask }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditTask);
