
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  
  use: {
    baseURL: 'http://localhost:5173',
    
    
    screenshot: 'only-on-failure',
    
    trace: 'retain-on-failure',
  },

 
  testDir: './tests',

  
  reporter: [
    ['list'],
    ['./my-excel-reporter.js'] 
  ],

 
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});