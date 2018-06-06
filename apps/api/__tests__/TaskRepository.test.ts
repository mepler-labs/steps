import { TaskRepository, Task } from '../src/repository/TaskRepository';
import { fixtures, getTestConnectionPool } from './db_helper';

let activeConn;

describe('Task entity operations', () => {
  let task: Task;
  let repo: TaskRepository;

  beforeAll(async () => {
    const pool = await getTestConnectionPool({ createFixtures: true })
    repo = new TaskRepository(pool);
    task = await repo.save(new Task({
      title: "TITLE",
      category: "CATEGORY",
      description: "DESCRIPTION",
      status: "ACTIVE",
      created_by: fixtures.org.id,
      user_id: fixtures.user.id,
      difficulty: "EASY",
      date_created: new Date(),
      date_completed: new Date(),
    }));
  });

  afterAll(async () => {
    repo.delete(task.id);
  });

  it('find a task', async () => {
    let actual = await repo.getOne(task.id);
    expect(actual.id).toBe(task.id);
  });

  it('gets all tasks', async () => {
    let actual = await repo.getAll();
    expect(actual.filter(x => x.id == task.id).length).toBe(1);
  });

  it('updates the task', async () => {
    const expectedTitle = "NEW TITLE";
    let newTask = await repo.getOne(task.id);
    newTask.title = expectedTitle;
    const actual = await repo.update(newTask);
    expect(actual.title).toBe(expectedTitle);
  });
});
