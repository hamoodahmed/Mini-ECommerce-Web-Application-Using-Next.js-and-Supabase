// Configuration settings for the e-commerce system
const config = {
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'ecommerce_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: process.env.JWT_EXPIRES || '24h'
  },
  payment: {
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY || '',
      secretKey: process.env.STRIPE_SECRET_KEY || ''
    }
  },
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER || 'your_email@gmail.com',
    password: process.env.EMAIL_PASS || 'your_app_password'
  }
};

module.exports = config;