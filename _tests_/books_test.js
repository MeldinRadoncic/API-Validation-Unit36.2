

process.env.Node_ENV='test';

const app = required('../app')
const db = required('../db')
const { request } = require("../app");
const request = required('supertest')

let book_isbn;

beforeEach(async () => {
    let result = await db.query(`
      INSERT INTO
        books (isbn, amazon_url,author,language,pages,publisher,title,year)
        VALUES(
          '000000000000',
          'https://springboard.com/',
          'Meldin',
          'English',
          500,
          'Rythm School',
          'Software Engineer', 2022)
        RETURNING isbn`);
  
    book_isbn = result.rows[0].isbn
  });


  describe('post/books', function() { 
    test('Create a new book', async function() {
        const res = await request(app).send.post('/books').send({
            isbn: '123443211',
          amazon_url: "https://google.com",
          author: "ME",
          language: "English",
          pages: 6526,
          publisher: "ME AGAIN",
          title: "My Mentor is the best",
          year: 2022
        })
        expect(res.statusCode).toBe(201)
        expect(response.body.book).toHaveProperty("author");

    })
test('Prevents creating books with empty title', async function() {
  const response = request(app).post('/books').send({year:2018})
  expect(response.statusCode).toBe(400))
})




describe("put /books/:id", function () {
  test("Updates a single book", async function () {
    const response = await request(app)
        .put(`/books/${book_isbn}`)
        .send({
          amazon_url: "https://taco.com",
          author: "mctest",
          language: "english",
          pages: 1000,
          publisher: "yeah right",
          title: "UPDATED BOOK",
          year: 2000
        });
    expect(response.body.book).toHaveProperty("isbn");
    expect(response.body.book.title).toBe("UPDATED BOOK");
  });


  test("Responds 404 if can't find book in question", async function () {
    // delete book first
    await request(app)
        .delete(`/books/${book_isbn}`)
    const response = await request(app).delete(`/books/${book_isbn}`);
    expect(response.statusCode).toBe(404);
  });
});


describe("delete /books/:id", function () {
  test("Deletes a single a book", async function () {
    const response = await request(app)
        .delete(`/books/${book_isbn}`)
    expect(response.body).toEqual({message: "Book deleted"});
  });
});


afterEach(async function () {
  await db.query("DELETE FROM BOOKS");
});


afterAll(async function () {
  await db.end()
});
