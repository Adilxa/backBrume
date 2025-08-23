module.exports = {
  apps: [
    {
      name: "brumeserver",
      script: "./index.js", // Main file is in root
      instances: 1,
      exec_mode: "fork",
      node_args: "--experimental-modules",
      env: {
        NODE_ENV: "production",
        PORT: 3000, // or whatever port you want
      },
      env_file: "./.env",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      watch: false,
      ignore_watch: ["node_modules", "logs"],
    },
  ],
};
