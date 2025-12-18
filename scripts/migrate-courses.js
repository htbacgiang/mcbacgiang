// Migration script to update existing courses to new schema
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

// Migration function
async function migrateCourses() {
  try {
    console.log('Starting course migration...');
    
    // Update all courses to remove deprecated fields and fix schema
    const result = await mongoose.connection.db.collection('courses').updateMany(
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
        },
        $set: {
          // Ensure image is a string, not an array
          image: { $cond: { if: { $isArray: "$image" }, then: { $arrayElemAt: ["$image", 0] }, else: "$image" } }
        }
      }
    );

    console.log(`Migration completed. Modified ${result.modifiedCount} documents.`);

    // Also update any documents where image is still an array
    const imageArrayDocs = await mongoose.connection.db.collection('courses').find({ 
      image: { $type: "array" } 
    }).toArray();

    if (imageArrayDocs.length > 0) {
      console.log(`Found ${imageArrayDocs.length} documents with array images. Converting...`);
      
      for (const doc of imageArrayDocs) {
        await mongoose.connection.db.collection('courses').updateOne(
          { _id: doc._id },
          { 
            $set: { 
              image: Array.isArray(doc.image) && doc.image.length > 0 ? doc.image[0] : ""
            }
          }
        );
      }
      
      console.log('Image array conversion completed.');
    }

    console.log('All migration tasks completed successfully!');
    
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await connectDB();
    await migrateCourses();
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

main();
