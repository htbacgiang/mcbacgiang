// Simple script to clean up courses collection
const { MongoClient } = require('mongodb');

// You need to replace this with your actual MongoDB URI
const MONGODB_URI = 'mongodb+srv://your-connection-string-here';

async function cleanCourses() {
  if (MONGODB_URI === 'mongodb+srv://your-connection-string-here') {
    console.log('Please update the MONGODB_URI in the script with your actual connection string');
    console.log('You can find it in your .env file or environment variables');
    return;
  }

  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const coursesCollection = db.collection('courses');

    console.log('Starting course cleanup...');
    
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

    console.log(`Cleanup completed. Modified ${result.modifiedCount} documents.`);

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

    console.log('All cleanup tasks completed successfully!');
    
  } catch (error) {
    console.error('Cleanup error:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

cleanCourses();
