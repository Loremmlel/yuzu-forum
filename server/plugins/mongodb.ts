import mongoose from "mongoose";

export default defineNitroPlugin(async () => {
    const url = useRuntimeConfig().MONGODB_URL
    await mongoose.connect(url)
    console.log(`MongoDB: ${url} connection successful!`)
});