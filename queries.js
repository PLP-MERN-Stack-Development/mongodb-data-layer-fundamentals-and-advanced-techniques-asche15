// queries.js
// All MongoDB queries for the Week 1 assignment

// NOTE: These functions assume you have a connected `db` object and a `books` collection.
// You can import and use these functions in your main script after connecting to MongoDB.

// Task 2: Basic CRUD Operations

// Find all books in a specific genre
async function findBooksByGenre(collection, genre) {
  return await collection.find({ genre }).toArray();
}

// Find books published after a certain year
async function findBooksAfterYear(collection, year) {
  return await collection.find({ published_year: { $gt: year } }).toArray();
}

// Find books by a specific author
async function findBooksByAuthor(collection, author) {
  return await collection.find({ author }).toArray();
}

// Update the price of a specific book
async function updateBookPrice(collection, title, newPrice) {
  return await collection.updateOne({ title }, { $set: { price: newPrice } });
}

// Delete a book by its title
async function deleteBookByTitle(collection, title) {
  return await collection.deleteOne({ title });
}

// Task 3: Advanced Queries

// Find books that are both in stock and published after 2010
async function findInStockBooksAfter2010(collection) {
  return await collection.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray();
}

// Use projection to return only the title, author, and price fields
async function findBooksProjection(collection, filter = {}) {
  return await collection.find(filter, { projection: { _id: 0, title: 1, author: 1, price: 1 } }).toArray();
}

// Sort books by price ascending
async function sortBooksByPriceAsc(collection) {
  return await collection.find({}).sort({ price: 1 }).toArray();
}

// Sort books by price descending
async function sortBooksByPriceDesc(collection) {
  return await collection.find({}).sort({ price: -1 }).toArray();
}

// Pagination: limit and skip (5 books per page)
async function paginateBooks(collection, page = 1, pageSize = 5) {
  return await collection.find({}).skip((page - 1) * pageSize).limit(pageSize).toArray();
}

// Task 4: Aggregation Pipeline

// Calculate the average price of books by genre
async function averagePriceByGenre(collection) {
  return await collection.aggregate([
    { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
  ]).toArray();
}

// Find the author with the most books in the collection
async function authorWithMostBooks(collection) {
  return await collection.aggregate([
    { $group: { _id: "$author", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]).toArray();
}

// Group books by publication decade and count them
async function booksByDecade(collection) {
  return await collection.aggregate([
    { $addFields: { decade: { $concat: [ { $substr: ["$published_year", 0, 3] }, "0s" ] } } },
    { $group: { _id: "$decade", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]).toArray();
}

// Task 5: Indexing

// Create an index on the title field
async function createTitleIndex(collection) {
  return await collection.createIndex({ title: 1 });
}

// Create a compound index on author and published_year
async function createAuthorYearIndex(collection) {
  return await collection.createIndex({ author: 1, published_year: 1 });
}

// Use explain() to demonstrate performance improvement
async function explainTitleQuery(collection, title) {
  return await collection.find({ title }).explain();
}

module.exports = {
  findBooksByGenre,
  findBooksAfterYear,
  findBooksByAuthor,
  updateBookPrice,
  deleteBookByTitle,
  findInStockBooksAfter2010,
  findBooksProjection,
  sortBooksByPriceAsc,
  sortBooksByPriceDesc,
  paginateBooks,
  averagePriceByGenre,
  authorWithMostBooks,
  booksByDecade,
  createTitleIndex,
  createAuthorYearIndex,
  explainTitleQuery
};
