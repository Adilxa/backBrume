import swaggerJsDoc from "swagger-jsdoc"; 

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopServer API Documentation',
      version: '1.0.0',
      description: 'Документация для ShopServer API',
    },
    servers: [
      {
        url: process.env.PORT, 
      },
    ],
  },
  apis: ['./src/routes/*.js'], 
};

 const swaggerSpecs = swaggerJsDoc(options);

export default swaggerSpecs;
