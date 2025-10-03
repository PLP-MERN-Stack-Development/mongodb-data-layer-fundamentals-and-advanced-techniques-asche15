

// === MongoDB Connection Setup ===
require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const dbName = 'plp_bookstore';
const collectionName = 'books';

// === Sample Book Data ===
const books = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    published_year: 1960,
    price: 12.99,
    in_stock: true,
    pages: 336,
    publisher: 'J. B. Lippincott & Co.'
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    published_year: 1949,
    price: 10.99,
    in_stock: true,
    pages: 328,
    publisher: 'Secker & Warburg'
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    published_year: 1925,
    price: 9.99,
    in_stock: true,
    pages: 180,
    publisher: 'Charles Scribner\'s Sons'
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian',
    published_year: 1932,
    price: 11.50,
    in_stock: false,
    pages: 311,
    publisher: 'Chatto & Windus'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    published_year: 1937,
    price: 14.99,
    in_stock: true,
    pages: 310,
    publisher: 'George Allen & Unwin'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    published_year: 1951,
    price: 8.99,
    in_stock: true,
    pages: 224,
    publisher: 'Little, Brown and Company'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    published_year: 1813,
    price: 7.99,
    in_stock: true,
    pages: 432,
    publisher: 'T. Egerton, Whitehall'
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    published_year: 1954,
    price: 19.99,
    in_stock: true,
    pages: 1178,
    publisher: 'Allen & Unwin'
  },
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    genre: 'Political Satire',
    published_year: 1945,
    price: 8.50,
    in_stock: false,
    pages: 112,
    publisher: 'Secker & Warburg'
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction',
    published_year: 1988,
    price: 10.99,
    in_stock: true,
    pages: 197,
    publisher: 'HarperOne'
  },
  {
    title: 'Moby Dick',
    author: 'Herman Melville',
    genre: 'Adventure',
    published_year: 1851,
    price: 12.50,
    in_stock: false,
    pages: 635,
    publisher: 'Harper & Brothers'
  },
  {
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    genre: 'Gothic Fiction',
    published_year: 1847,
    price: 9.99,
    in_stock: true,
    pages: 342,
    publisher: 'Thomas Cautley Newby'
  }
];


// === Query & Aggregation Functions ===
async function findBooksByGenre(collection, genre) {
  return await collection.find({ genre }).toArray();
}
async function findBooksAfterYear(collection, year) {
  return await collection.find({ published_year: { $gt: year } }).toArray();
}
async function findBooksByAuthor(collection, author) {
  return await collection.find({ author }).toArray();
}
async function updateBookPrice(collection, title, newPrice) {
  return await collection.updateOne({ title }, { $set: { price: newPrice } });
}
async function deleteBookByTitle(collection, title) {
  return await collection.deleteOne({ title });
}
async function findInStockBooksAfter2010(collection) {
  return await collection.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray();
}
async function findBooksProjection(collection, filter = {}) {
  return await collection.find(filter, { projection: { _id: 0, title: 1, author: 1, price: 1 } }).toArray();
}
async function sortBooksByPriceAsc(collection) {
  return await collection.find({}).sort({ price: 1 }).toArray();
}
async function sortBooksByPriceDesc(collection) {
  return await collection.find({}).sort({ price: -1 }).toArray();
}
async function paginateBooks(collection, page = 1, pageSize = 5) {
  return await collection.find({}).skip((page - 1) * pageSize).limit(pageSize).toArray();
}
async function averagePriceByGenre(collection) {
  return await collection.aggregate([
    { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
  ]).toArray();
}
async function authorWithMostBooks(collection) {
  return await collection.aggregate([
    { $group: { _id: "$author", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]).toArray();
}
async function booksByDecade(collection) {
  return await collection.aggregate([
    { $addFields: { decade: { $concat: [ { $substr: ["$published_year", 0, 3] }, "0s" ] } } },
    { $group: { _id: "$decade", count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]).toArray();
}
async function createTitleIndex(collection) {
  return await collection.createIndex({ title: 1 });
}
async function createAuthorYearIndex(collection) {
  return await collection.createIndex({ author: 1, published_year: 1 });
}
async function explainTitleQuery(collection, title) {
  return await collection.find({ title }).explain();
}

// === Main Script ===
async function insertBooks() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB server');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`ℹ️  Collection already contains ${count} documents. Dropping collection...`);
      await collection.drop();
      console.log('🗑️  Collection dropped successfully');
    }
    const result = await collection.insertMany(books);
    console.log(`📚 ${result.insertedCount} books were successfully inserted into the database`);
    console.log('\nInserted books:');
    const insertedBooks = await collection.find({}).toArray();
    insertedBooks.forEach((book, index) => {
      console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
    });

od    // === Example Query Demonstrations ===
    // You can comment/uncomment these as needed for your assignment
    const fictionBooks = await findBooksByGenre(collection, 'Fiction');
    console.log(`\nFiction books:`, fictionBooks.map(b => b.title));

    const after2000 = await findBooksAfterYear(collection, 2000);
    console.log(`\nBooks published after 2000:`, after2000.map(b => b.title));

    const avgPrice = await averagePriceByGenre(collection);
    console.log(`\nAverage price by genre:`, avgPrice);

    const topAuthor = await authorWithMostBooks(collection);
    console.log(`\nAuthor with most books:`, topAuthor);

    const decadeGroups = await booksByDecade(collection);
    console.log(`\nBooks grouped by decade:`, decadeGroups);

    // Create indexes and show explain
    await createTitleIndex(collection);
    await createAuthorYearIndex(collection);
    const explain = await explainTitleQuery(collection, '1984');
    console.log(`\nExplain for title index query:`, explain.queryPlanner ? explain.queryPlanner : explain);

    console.log('\n✅ All operations completed successfully!');

  } catch (err) {
    console.error('❌ Error occurred:', err.message || err);
  } finally {
    await client.close();
    console.log('🔒 Connection closed');
  }
}

insertBooks().catch(err => {
  console.error('❌ Unhandled error:', err.message || err);
});

