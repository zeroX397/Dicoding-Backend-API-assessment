import { nanoid } from 'nanoid';
import books from './books.js';

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Halaman yang dibaca tidak boleh lebih besar dari total halaman.'
        }).code(400);
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt
    };

    books.push(newBook);

    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id
        }
    }).code(201);
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = books;

    if (name) {
        filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter(book => book.reading === !!Number(reading));
    }

    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter(book => book.finished === !!Number(finished));
    }

    const bookSummaries = filteredBooks.map(({ id, name, publisher }) => ({
        id, name, publisher
    }));

    return h.response({
        status: 'success',
        data: {
            books: bookSummaries
        }
    }).code(200);
};

// Handler to retrieve a specific book by ID
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.find(b => b.id === bookId);

    if (!book) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        }).code(404);
    }

    return h.response({
        status: 'success',
        data: {
            book
        }
    }).code(200);
};

const updateBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon mengisi nama buku'
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Halaman yang dibaca tidak boleh lebih besar dari total halaman.'
        }).code(400);
    }

    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. ID buku tidak ditemukan'
        }).code(404);
    }

    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    books[bookIndex] = {
        ...books[bookIndex],
        name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt
    };

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
    }).code(200);
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. ID buku tidak ditemukan'
        }).code(404);
    }

    books.splice(bookIndex, 1);

    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
    }).code(200);
};

export {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler
};
