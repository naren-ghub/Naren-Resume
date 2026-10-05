import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function syncTemplatePlugin(): Plugin {
  return {
    name: 'sync-template-plugin',
    configureServer(server) {
      server.middlewares.use('/_api/sync-template', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (data && data.header && data.sections) {
                const filePath = path.resolve(__dirname, 'src/data/initialTemplate.ts');
                const fileContent = `import { ResumeData } from '../types/resume';\n\nexport const initialResumeData: ResumeData = ${JSON.stringify(
                  data,
                  null,
                  2
                )};\n`;
                fs.writeFileSync(filePath, fileContent, 'utf-8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
                return;
              }
            } catch (err) {
              console.error('Error syncing template:', err);
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false }));
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), syncTemplatePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
