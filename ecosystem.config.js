module.exports = {
  apps: [
    {
      name: 'cs-linker',
      script: './bin/www',
      interpreter: 'bun',
      
      instances: 1,
      exec_mode: 'fork',

      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 5005,
      },

      // Resource limits for low resource usage
      max_memory_restart: '128M',

      // Restart settings
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',

      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Performance optimizations for low resource usage
      node_args: ['--max-old-space-size=128', '--optimize-for-size'],

      // Process management
      kill_timeout: 5000,
      listen_timeout: 3000,

      // Health monitoring
      health_check_grace_period: 3000,

      // Disable clustering to save resources
      merge_logs: true,

      // Additional settings for resource efficiency
      ignore_watch: [
        'node_modules',
        'logs',
        'test',
        'tests',
        'client-vite',
        'playwright-report',
        'test-results',
      ],
    },
  ],
}
