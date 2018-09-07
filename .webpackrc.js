import env from './.env.json';

export default {
  entry: "src/index.js",
  extraBabelPlugins: [
    ["import", { libraryName: "antd", libraryDirectory: "es", style: true }]
  ],
  define: {
    OA_PATH: env.OA_PATH,
    OA_CRM_UPLOAD: "http://112.74.177.132:8003/admin/",
    OA_CLIENT_ID: env.OA_CLIENT_ID,
    OA_CLIENT_SECRET: env.OA_CLIENT_SECRET,
    AUTH_NAME: "pro",
    TOKEN_PREFIX: "OA_"
  },
  env: {
    development: {
      extraBabelPlugins: [
        "dva-hmr"
      ],
      define: {
        OA_PATH: "http://112.74.177.132:8002/",
        OA_CRM_UPLOAD: "http://112.74.177.132:8003/admin/",
        OA_CLIENT_ID: "2",
        OA_CLIENT_SECRET: "Z77PmFkOD9SMAIbVDZcKRxOD6f0YA0ck54amYEr1"
      }
    }
  },
  ignoreMomentLocale: true,
  theme: "./src/theme.js",
  html: {
    template: "./src/index.ejs"
  },
  publicPath: "/",
  disableDynamicImport: true,
  hash: true
}
