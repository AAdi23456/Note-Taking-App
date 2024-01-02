const request = require('supertest');
const app = require('../server');
const Note = require('../model/notes');

describe('Note API', () => {
  beforeEach(async () => {
    await Note.deleteMany();
  });

  test('POST /api/notes should create a new note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({
        title: 'Test Note',
        content: 'This is a test note.',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'Test Note');
    expect(res.body).toHaveProperty('content', 'This is a test note.');
  });

  test('POST /api/notes should return an error for missing title', async () => {
    const res = await request(app)
      .post('/api/notes')
      .send({
        content: 'This is a test note.',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Title and content are required');
  });

  test('GET /api/notes should retrieve all notes', async () => {
    // Create test notes
    await Note.create([
      { title: 'Note 1', content: 'Content 1234' },  
      { title: 'Note 2', content: 'Content 5678' },
    ]);
    
    const res = await request(app).get('/api/notes');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(2);
  });

  test('GET /api/notes/:noteId should retrieve a single note by ID', async () => {
    const note = await Note.create({ title: 'Test Note', content: 'This is a test note.' });

    const res = await request(app).get(`/api/notes/${note._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'Test Note');
    expect(res.body).toHaveProperty('content', 'This is a test note.');
  });

  test('GET /api/notes/:noteId should return an error for non-existent note ID', async () => {
    const nonExistentId = '5f69aa979c3b5f001e2e78c0'; // An ID that doesn't exist

    const res = await request(app).get(`/api/notes/${nonExistentId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Note not found');
  });

  test('PUT /api/notes/:noteId should update an existing note', async () => {
    const note = await Note.create({ title: 'Original Title', content: 'Original Content' });

    const res = await request(app)
      .put(`/api/notes/${note._id}`)
      .send({
        title: 'Updated Title',
        content: 'Updated Content',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'Updated Title');
    expect(res.body).toHaveProperty('content', 'Updated Content');
  });

  test('PUT /api/notes/:noteId should return an error for non-existent note ID', async () => {
    const nonExistentId = '5f69aa979c3b5f001e2e78c0'; // An ID that doesn't exist

    const res = await request(app)
      .put(`/api/notes/${nonExistentId}`)
      .send({
        title: 'Updated Title',
        content: 'Updated Content',
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Note not found');
  });

  test('DELETE /api/notes/:noteId should delete an existing note', async () => {
    const note = await Note.create({ title: 'Note to be deleted', content: 'Content to be deleted' });

    const res = await request(app).delete(`/api/notes/${note._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Note deleted successfully');

    // Verify that the note has been deleted
    const deletedNote = await Note.findById(note._id);
    expect(deletedNote).toBeNull();
  });

  test('DELETE /api/notes/:noteId should return an error for non-existent note ID', async () => {
    const nonExistentId = '5f69aa979c3b5f001e2e78c0'; // An ID that doesn't exist

    const res = await request(app).delete(`/api/notes/${nonExistentId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'Note not found');
  });
});
