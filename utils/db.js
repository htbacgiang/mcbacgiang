import mongoose, { mongo } from "mongoose";
const connection = {};

async function connectDb() {
  try {
    // Kiểm tra kết nối hiện tại
    if (mongoose.connections.length > 0) {
      const currentState = mongoose.connections[0].readyState;
      // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      if (currentState === 1) {
        connection.isConnected = 1;
        return;
      }
      // Nếu đang kết nối, đợi một chút
      if (currentState === 2) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (mongoose.connections[0].readyState === 1) {
          connection.isConnected = 1;
          return;
        }
      }
      // Nếu đã ngắt kết nối, disconnect trước khi kết nối lại
      if (currentState === 0 || currentState === 3) {
        try {
          await mongoose.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
      }
    }
    
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("New connection to the database.");
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error("Database connection error:", error);
    connection.isConnected = 0;
    throw error;
  }
}

async function disconnectDb() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("not disconnecting from the database.");
    }
  }
}
const db = { connectDb, disconnectDb };
export default db;