import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    apiUrl: 'https://api.tradeunion.online/api',
    email: 'admin1@example.com',
    password: 'AsDf1234',
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    excludeSpecPattern: '**/_examples/**/*.cy.js',
  },
});
