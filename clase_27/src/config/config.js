import dotenv from 'dotenv';

dotenv.config()

export default {
    mongo_url: process.env.MONGO_URL,
    port: process.env.PORT,
    signed_cookie: process.env.SIGNED_COOKIE,
    session_secret: process.env.SESSION_SECRET,
    salt: process.env.SALT,
    github_client_id: process.env.GITHUB_CLIENT_ID,
    github_client_secret: process.env.GITHUB_CLIENT_SECRET,
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD

}