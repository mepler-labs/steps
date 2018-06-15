import client from 'client';

type DispatchFn = (any) => any;

export const createTask = async (data): Promise<any> => {
  try {
    await client.post('/tasks', data);
    return { type: 'foo' };
  } catch (error) {
    console.error(error);
  }
};

export const getTasks = (): DispatchFn => async dispatch => {
  try {
    const tasks = await client.get('/tasks');
    return dispatch(setTasks(tasks.data));
  } catch (error) {
    Promise.reject(error);
  }
};

export const SET_TASKS = 'SET_TASKS';
export const setTasks = tasks => {
  return {
    type: SET_TASKS,
    tasks,
  };
};

export const SET_TASK_STATUS = 'SET_TASK_STATUS';
export const setTaskStatus = (task, status): DispatchFn => async dispatch => {
  const newTask = { ...task, status };
  delete newTask.steps;
  try {
    await client.put(`/tasks/${task.id}`, newTask);
    return dispatch({ type: SET_TASK_STATUS, id: task.id, status });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const completeTask = id => {
  return { type: SET_TASK_STATUS, id, status: 'COMPLETED' };
};

export const setTaskActive = (id, status) => {
  return { type: SET_TASK_STATUS, id, status: 'ACTIVE' };
};

export const setTaskArchived = (id, status) => {
  return { type: SET_TASK_STATUS, id, status: 'ARCHIVED' };
};

export const DELETE_TASK = 'DELETE_TASK';
export const deleteTask = (id): DispatchFn => async dispatch => {
  try {
    const tasks = await client.delete(`/tasks/${id}`);
    return { type: DELETE_TASK, tasks };
  } catch (error) {
    return Promise.reject(error);
  }
};

export const ADD_TASK = 'ADD_TASK';
export const addTask = (task): DispatchFn => async dispatch => {
  try {
    await client.post('/tasks', task);
    return {
      type: ADD_TASK,
      task,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};
