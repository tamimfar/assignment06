import dotenv from 'dotenv'
import path from 'node:path'


dotenv.config({path:path.join(process.cwd(), '.env')})

export default {
    node_env: process.env.NODE_ENV,
    PORT: process.env.PORT || 300,

    // database
    DATABASE_URL: process.env.DATABASE_URL,

    // google
    google_client_id: process.env.GOOGLE_CLIENT_ID!,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    
    // jwt
    jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,

    // redis
    redis_host: process.env.REDIS_HOST!,
    redis_port: process.env.REDIS_PORT!,
    redis_username: process.env.REDIS_USER!,
    redis_password: process.env.REDIS_PASSWORD!,

    // smtp
    smtp_username: process.env.SMTP_USER!,
    smtp_password: process.env.SMTP_PASSWORD!,

    // cloudinary
    cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME!,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY!,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET!,

    // bkash 
    bkash_base_url:process.env.BKASH_URL!,
    bkash_username:process.env.BKASH_USERNAME!,
    bkash_password:process.env.BKASH_PASSWORD!,
    bkash_app_key:process.env.BKASH_APP_KEY!,
    bkash_app_secret:process.env.BKASH_APP_SECRET!,

}
  