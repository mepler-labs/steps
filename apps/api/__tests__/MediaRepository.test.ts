import { MediaRepository, Media } from '../src/repository/MediaRepository';
import { fixtures, getTestConnectionPool, Pool } from './db_helper';

describe('media entity operations', () => {
  let pool: Pool;
  let media: Media;
  let repo: MediaRepository;

  beforeAll(async () => {
    pool = await getTestConnectionPool({ createFixtures: true });
    repo = new MediaRepository(pool);
    media = await repo.save(
      new Media({
        task_id: fixtures.task.id,
        title: 'TITLE',
        category: 'CATEGORY',
        description: 'DESCRIPTION',
        url: 'URL',
        image: 'IMAGE',
        published_by: fixtures.org.id,
        type: 'GENERAL_EDUCATION',
      }),
    );
  });

  afterAll(async () => {
    await repo.delete(media.id);
    await pool.end();
  });

  it('find a media', async () => {
    let actual = await repo.getOne(media.id);
    expect(actual.id).toBe(media.id);
  });

  it('gets all media', async () => {
    let actual = await repo.getAll();
    expect(actual.filter(x => x.id == media.id).length).toBe(1);
  });
});
