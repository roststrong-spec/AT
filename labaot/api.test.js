import axios from 'axios';
import nock from 'nock';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const mockPosts = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  title: `Post title ${index + 1}`,
  body: `Post body ${index + 1}`,
  userId: (index % 10) + 1,
}));

const mockPost = {
  id: 1,
  title: 'Post title 1',
  body: 'Post body 1',
  userId: 1,
};

const newPost = {
  title: 'New post title',
  body: 'New post body',
  userId: 1,
};

const mockCreated = {
  id: 101,
  ...newPost,
};

const updatedPost = {
  id: 1,
  title: 'Updated post title',
  body: 'Updated post body',
  userId: 1,
};

beforeAll(() => {
  nock.disableNetConnect();
});

afterAll(() => {
  nock.enableNetConnect();
  nock.cleanAll();
});

afterEach(() => {
  nock.cleanAll();
});

describe('GET /posts — отримання всіх записів', () => {
  let response;

  beforeEach(async () => {
    nock(BASE_URL).get('/posts').reply(200, mockPosts);
    response = await axios.get(`${BASE_URL}/posts`);
  });

  test('статус код дорівнює 200', () => {
    expect(response.status).toBe(200);
  });

  test('тіло відповіді є масивом', () => {
    expect(Array.isArray(response.data)).toBe(true);
  });

  test('масив не є порожнім', () => {
    expect(response.data.length).toBeGreaterThan(0);
  });

  test('кожен елемент містить поля id, title, body, userId', () => {
    expect(
      response.data.every(item =>
        item &&
        typeof item === 'object' &&
        item.hasOwnProperty('id') &&
        item.hasOwnProperty('title') &&
        item.hasOwnProperty('body') &&
        item.hasOwnProperty('userId')
      )
    ).toBe(true);
  });

  test('повертає рівно 100 записів', () => {
    expect(response.data.length).toBe(100);
  });
});

describe('GET /posts/:id — отримання конкретного запису', () => {
  let response;

  beforeEach(async () => {
    nock(BASE_URL).get('/posts/1').reply(200, mockPost);
    response = await axios.get(`${BASE_URL}/posts/1`);
  });

  test('статус код дорівнює 200', () => {
    expect(response.status).toBe(200);
  });

  test('повертає об’єкт, а не масив', () => {
    expect(Array.isArray(response.data)).toBe(false);
  });

  test('id у відповіді відповідає запитуваному (1)', () => {
    expect(response.data.id).toBe(1);
  });

  test('поле userId є числом', () => {
    expect(typeof response.data.userId).toBe('number');
  });

  test('title та body є непорожніми рядками', () => {
    expect(typeof response.data.title).toBe('string');
    expect(response.data.title.length).toBeGreaterThan(0);
    expect(typeof response.data.body).toBe('string');
    expect(response.data.body.length).toBeGreaterThan(0);
  });
});

describe('POST /posts — створення нового запису', () => {
  let response;

  beforeEach(async () => {
    nock(BASE_URL).post('/posts', newPost).reply(201, mockCreated);
    response = await axios.post(`${BASE_URL}/posts`, newPost);
  });

  test('статус код дорівнює 201 (Created)', () => {
    expect(response.status).toBe(201);
  });

  test('відповідь містить поле id', () => {
    expect(response.data).toHaveProperty('id');
  });

  test('повернутий title збігається з надісланим', () => {
    expect(response.data.title).toBe(newPost.title);
  });

  test('повернутий body збігається з надісланим', () => {
    expect(response.data.body).toBe(newPost.body);
  });

  test('повернутий userId збігається з надісланим', () => {
    expect(response.data.userId).toBe(newPost.userId);
  });
});

describe('PUT /posts/:id — повне оновлення запису', () => {
  let response;

  beforeEach(async () => {
    nock(BASE_URL).put('/posts/1', updatedPost).reply(200, updatedPost);
    response = await axios.put(`${BASE_URL}/posts/1`, updatedPost);
  });

  test('статус код дорівнює 200', () => {
    expect(response.status).toBe(200);
  });

  test('повернутий title збігається з оновленим', () => {
    expect(response.data.title).toBe(updatedPost.title);
  });

  test('повернутий body збігається з оновленим', () => {
    expect(response.data.body).toBe(updatedPost.body);
  });

  test('id у відповіді залишається 1', () => {
    expect(response.data.id).toBe(1);
  });

  test('відповідь містить усі обов’язкові поля', () => {
    expect(response.data).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String),
        userId: expect.any(Number),
      })
    );
  });
});

describe('DELETE /posts/:id — видалення запису', () => {
  let response;

  beforeEach(async () => {
    nock(BASE_URL)
      .delete('/posts/1')
      .reply(200, {}, { 'Content-Type': 'application/json' });
    response = await axios.delete(`${BASE_URL}/posts/1`);
  });

  test('статус код дорівнює 200', () => {
    expect(response.status).toBe(200);
  });

  test('тіло відповіді є порожнім об’єктом {}', () => {
    expect(response.data).toEqual({});
  });

  test('тип відповіді — object', () => {
    expect(typeof response.data).toBe('object');
  });

  test('запит виконується без помилок', async () => {
    await expect(Promise.resolve(response)).resolves.toBeDefined();
  });

  test('Content-Type містить application/json', () => {
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });
});
