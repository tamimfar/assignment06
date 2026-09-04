import { prisma } from "./app/lib/prisma";
import app from "./app";
import config from "./app/config";
import { redisClient } from "./app/lib/redis";
import transporter from "./app/lib/nodemailer";


const PORT = config.PORT

async function main() {
    try {
        // database connection
        await prisma.$connect()
        console.log("Database connected");
        // redis connection
        await redisClient.connect()
        console.log("Redis connected");
        // SMTP
        await transporter.verify();
        console.log("connected to smtp");
        //start server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })

    } catch (error) {
        console.log(error)
        // database disconnection
        if (redisClient.isOpen) {
            await redisClient.disconnect();
        }
        process.exit(1)

    }
}

main()