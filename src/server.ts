import { prisma } from "./app/lib/prisma";
import app from "./app";
import config from "./app/config";
import { redisClient } from "./app/lib/redis";


const PORT = config.PORT

async function main() {
    try {
        // database connection
        await prisma.$connect()
        console.log("Database connected");
        // redis connection
        await redisClient.connect()
        console.log("Redis connected");

        //start server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })

    } catch (error) {
        console.log(error)
        // database disconnection
        await prisma.$disconnect()
        if (redisClient.isOpen) {
            await redisClient.disconnect();
        }
        process.exit(1)

    }
}

main()