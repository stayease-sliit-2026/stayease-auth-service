import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = (process.env.MONGO_URI || "").trim();

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    if (error?.code === 8000 || error?.message?.includes("bad auth")) {
      console.error(
        "MongoDB authentication failed. Check username/password in MONGO_URI and ensure any special characters in the password are URL-encoded."
      );
    }

    console.error(error);
    throw error;
  }
};

export default connectDB;