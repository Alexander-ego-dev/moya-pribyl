import {defineConfig,devices} from '@playwright/test';
export default defineConfig({testDir:'./e2e',workers:1,use:{...devices['iPhone 13'],defaultBrowserType:'chromium',channel:'msedge',baseURL:'http://localhost:4173'},webServer:{command:'npm run preview -- --port 4173 --strictPort',url:'http://localhost:4173',reuseExistingServer:true},reporter:'list'});
