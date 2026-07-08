module.exports = {
  apps: [
    {
      name: "digital-daari",
      script: "pnpm",
      args: "start",
      cwd: "/var/www/digital-daari",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      max_memory_restart: "500M",
      instances: 1,
      autorestart: true,
      watch: false,
      time: true,
    },
  ],
};
