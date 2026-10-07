// pm2 process config. Managed by the ansible playbook (ansible/playbook.yml):
//   pm2 startOrReload ecosystem.config.js --update-env
// Day-to-day on the server:  pm2 status | pm2 logs cs-linker | pm2 restart cs-linker
module.exports = {
  apps: [
    {
      name: 'cs-linker',
      script: './bin/www',
      cwd: __dirname,
      interpreter: 'bun',

      instances: 1,
      exec_mode: 'fork',

      env: {
        NODE_ENV: 'production',
        PORT: 5005, // nginx proxies /api and /g to this port
      },

      // Restart behaviour
      autorestart: true,
      watch: false,
      max_memory_restart: '128M',
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,

      // Logging
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
}
