
# MongoDB Fundamentals - Week 1

## Setup Instructions

Before you begin, make sure you have:

1. **MongoDB Community Edition** ([Installation Guide](https://www.mongodb.com/docs/manual/administration/install-community/)) or a MongoDB Atlas account
2. **MongoDB Shell (mongosh)** (included with MongoDB Community Edition)
3. **Node.js** ([Download here](https://nodejs.org/))

### Node.js Package Setup

In your assignment directory, run:

```bash
npm install mongodb
```

## Assignment Overview

This assignment covers:
- Creating and connecting to MongoDB databases
- CRUD operations (Create, Read, Update, Delete)
- MongoDB queries and filters
- Aggregation pipelines
- Indexing for performance

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository
3. Install MongoDB locally or set up a MongoDB Atlas account
4. Run `insert_books.js` to populate your database and access all required queries in one place
5. Review and use the query functions integrated in `insert_books.js` for all assignment tasks

## Files Included

- `Week1-Assignment.md`: Assignment instructions
- `insert_books.js`: Populates your MongoDB database and contains all required query and aggregation functions
- `queries.js`: (Legacy) Contains the same query functions, now integrated into `insert_books.js`

## Usage

Run the following command to insert sample data and access all queries:

```bash
node insert_books.js
```

You can uncomment and use any of the provided query functions in `insert_books.js` after the data is inserted.

## Requirements

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- MongoDB Shell (mongosh) or MongoDB Compass

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)