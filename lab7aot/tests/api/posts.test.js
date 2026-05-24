import nock from 'nock';
import axios from 'axios';
import { API_URL } from '../../core/config.js';

describe('GET /posts — отримання всіх записів', () => {
  afterEach(() => nock.cleanAll());

  const fake = new Array(100).fill(null).map((_, index) => ({ id: index + 1, title: `title${index}`, body: `body${index}`, userId: 1 }));

  test('статус 200', async () => {
    nock(API_URL).get('/posts').reply(200, fake);

    const res = await axios.get(`${API_URL}/posts`);

    expect(res.status).toBe(200);
  });

  test('відповідь є масивом', async () => {
    nock(API_URL).get('/posts').reply(200, fake);

    const res = await axios.get(`${API_URL}/posts`);

    expect(Array.isArray(res.data)).toBe(true);
  });

  test('100 записів', async () => {
    nock(API_URL).get('/posts').reply(200, fake);

    const res = await axios.get(`${API_URL}/posts`);

    expect(res.data).toHaveLength(100);
  });

  test('наявні поля id, title, body, userId', async () => {
    nock(API_URL).get('/posts').reply(200, fake);

    const res = await axios.get(`${API_URL}/posts`);

    expect(res.data[0]).toMatchObject({ id: 1, title: 'title0', body: 'body0', userId: 1 });
  });

  test('масив не порожній', async () => {
    nock(API_URL).get('/posts').reply(200, fake);

    const res = await axios.get(`${API_URL}/posts`);

    expect(res.data.length).toBeGreaterThan(0);
  });
});

describe('POST /posts — створення запису', () => {
  afterEach(() => nock.cleanAll());

  test('статус 201', async () => {
    const body = { title: 'x', body: 'y', userId: 1 };
    nock(API_URL).post('/posts').reply(201, { id: 101, ...body });

    const res = await axios.post(`${API_URL}/posts`, body);

    expect(res.status).toBe(201);
    expect(res.data.id).toBeDefined();
  });

  test('відповідь має поле id', async () => {
    const body = { title: 'x', body: 'y', userId: 1 };
    nock(API_URL).post('/posts').reply(201, { id: 101, ...body });

    const res = await axios.post(`${API_URL}/posts`, body);

    expect(res.data).toHaveProperty('id');
  });

  test('title збігається з надісланим', async () => {
    const body = { title: 'x', body: 'y', userId: 1 };
    nock(API_URL).post('/posts').reply(201, { id: 101, ...body });

    const res = await axios.post(`${API_URL}/posts`, body);

    expect(res.data.title).toBe(body.title);
  });

  test('userId збігається з надісланим', async () => {
    const body = { title: 'x', body: 'y', userId: 1 };
    nock(API_URL).post('/posts').reply(201, { id: 101, ...body });

    const res = await axios.post(`${API_URL}/posts`, body);

    expect(res.data.userId).toBe(body.userId);
  });

  test('body збігається з надісланим', async () => {
    const body = { title: 'x', body: 'y', userId: 1 };
    nock(API_URL).post('/posts').reply(201, { id: 101, ...body });

    const res = await axios.post(`${API_URL}/posts`, body);

    expect(res.data.body).toBe(body.body);
  });
});

describe('DELETE /posts/:id — видалення запису', () => {
  afterEach(() => nock.cleanAll());

  test('статус 200', async () => {
    nock(API_URL).delete('/posts/1').reply(200, {}, { 'Content-Type': 'application/json' });

    const res = await axios.delete(`${API_URL}/posts/1`);

    expect(res.status).toBe(200);
  });

  test("порожній об'єкт у відповіді", async () => {
    nock(API_URL).delete('/posts/1').reply(200, {}, { 'Content-Type': 'application/json' });

    const res = await axios.delete(`${API_URL}/posts/1`);

    expect(res.data).toEqual({});
  });

  test('тип відповіді object', async () => {
    nock(API_URL).delete('/posts/1').reply(200, {}, { 'Content-Type': 'application/json' });

    const res = await axios.delete(`${API_URL}/posts/1`);

    expect(typeof res.data).toBe('object');
  });

  test('Content-Type містить json', async () => {
    nock(API_URL).delete('/posts/1').reply(200, {}, { 'Content-Type': 'application/json' });

    const res = await axios.delete(`${API_URL}/posts/1`);

    expect(res.headers['content-type']).toContain('application/json');
  });

  test('виконується без помилок', async () => {
    nock(API_URL).delete('/posts/1').reply(200, {}, { 'Content-Type': 'application/json' });

    await expect(axios.delete(`${API_URL}/posts/1`)).resolves.toBeDefined();
  });
});
