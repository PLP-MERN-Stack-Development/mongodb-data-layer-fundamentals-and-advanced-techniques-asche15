
async function findBooksByGenre(collection, genre) {
  return collection.find({ genre }).toArray();
}
async function findBooksAfterYear(collection, year) {
  return collection.find({ published_year: { $gt: year } }).toArray();
}
async function findBooksByAuthor(collection, author) {
  return collection.find({ author }).toArray();
}
async function updateBookPrice(collection, title, newPrice) {
  return collection.updateOne({ title }, { $set: { price: newPrice } });
}
async function deleteBookByTitle(collection, title) {
  return collection.deleteOne({ title });
}
async function findInStockBooksAfter2010(collection) {
  return collection.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray();
}
async function findBooksProjection(collection, filter = {}) {
  return collection.find(filter, { projection: { _id: 0, title: 1, author: 1, price: 1 } }).toArray();
}
async function sortBooksByPriceAsc(collection) {
  return collection.find({}).sort({ price: 1 }).toArray();
}
async function sortBooksByPriceDesc(collection) {
  return collection.find({}).sort({ price: -1 }).toArray();
}
async function paginateBooks(collection, page = 1, pageSize = 5) {
  return collection.find({}).skip((page - 1) * pageSize).limit(pageSize).toArray();
}
async function averagePriceByGenre(collection) {
  return collection.aggregate([
    { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
  ]).toArray();
}
async function authorWithMostBooks(collection) {
  return collection.aggregate([
    { $group: { _id: "$author", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]).toArray();
}
async function booksByDecade(collection) {
  return collection.aggregate([
    { $addFields: { decade: { $concat: [ { $substr: ["$published_year", 0, 3] }, "0s" ] } } },
    { $group: { _id: "$decade", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]).toArray();
}
async function createTitleIndex(collection) {
  return collection.createIndex({ title: 1 });
}
async function createAuthorYearIndex(collection) {
  return collection.createIndex({ author: 1, published_year: 1 });
}
async function explainTitleQuery(collection, title) {
  return collection.find({ title }).explain();
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
