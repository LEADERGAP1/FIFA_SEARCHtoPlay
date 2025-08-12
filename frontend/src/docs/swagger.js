import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: { title: 'FIFA SearchToPlay API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000/api' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        Player: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            short_name: { type: 'string' },
            long_name: { type: 'string' },
            age: { type: 'integer' },
            club_name: { type: 'string' },
            club_position: { type: 'string' },
            fifa_version: { type: 'string' },
            nationality_name: { type: 'string' },
            fifa_update_date: { type: 'string', format: 'date' }
          },
          required: ['short_name','age','nationality_name','fifa_update_date']
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'] // ajustá paths
};

export function mountSwagger(app) {
  const spec = swaggerJSDoc(options);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
}

