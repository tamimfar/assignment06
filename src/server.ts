import { prisma } from "./app/lib/prisma";
import app from "./app";
import config from "./app/config";


const PORT = config.PORT

async function main() {
    try {
        // database connection
        await prisma.$connect()
        console.log("Database connected");

        //start server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })

    } catch (error) {
        console.log(error)
        await prisma.$disconnect()
        process.exit(1)

    }
}

main()