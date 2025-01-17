import { GLOBAL } from "./src/global/index.js";

GLOBAL.mongoose.set('strictQuery', false)
export const databaseConnection = async () => {
    try {
       
        GLOBAL.mongoose.connect(`mongodb+srv://peteraondoyavenga:Johndoe2023@gurusdb.u5fu2.mongodb.net/?retryWrites=true&w=majority&appName=gurusdb`);
        // GLOBAL.mongoose.connect(process.env.MONGODB);
    } catch (error) {
        console.log('Error ============');
    }
};
