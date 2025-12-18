// Simple migration script to clean up courses collection
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

async function migrateCourses() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const coursesCollection = db.collection('courses');

    console.log('Starting course migration...');
    
    // Remove deprecated fields from all course documents
    const result = await coursesCollection.updateMany(
      {}, // Match all documents
      {
        $unset: {
          instructor: "",
          instructorRole: "",
          category: "",
          targetAge: "",
          price: "",
          discount: "",
          badge: "",
          isActive: ""
        }
      }
    );

    console.log(`Migration completed. Modified ${result.modifiedCount} documents.`);

    // Convert image arrays to single strings
    const docs = await coursesCollection.find({ image: { $type: "array" } }).toArray();
    
    if (docs.length > 0) {
      console.log(`Found ${docs.length} documents with array images. Converting...`);
      
      for (const doc of docs) {
        const imageValue = Array.isArray(doc.image) && doc.image.length > 0 ? doc.image[0] : "";
        await coursesCollection.updateOne(
          { _id: doc._id },
          { $set: { image: imageValue } }
        );
      }
      
      console.log('Image array conversion completed.');
    } else {
      console.log('No documents with array images found.');
    }

    console.log('All migration tasks completed successfully!');
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

migrateCourses();
