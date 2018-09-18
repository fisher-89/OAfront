import env from './.env.json';

export default {
  entry: "src/index.js",
  extraBabelPlugins: [
    ["import", { libraryName: "antd", libraryDirectory: "es", style: true }]
  ],
  define: {
    OA_PATH: env.OA_PATH,
    OA_CRM_UPLOAD: env.OA_CRM_UPLOAD,
    OA_CLIENT_ID: env.OA_CLIENT_ID,
    OA_CLIENT_SECRET: env.OA_CLIENT_SECRET,
    AUTH_NAME: env.AUTH_NAME,
    TOKEN_PREFIX: env.TOKEN_PREFIX,
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
    },
    extraBabelIncludes: [],
  },
  ignoreMomentLocale: true,
  theme: "./src/theme.js",
  html: {
    template: "./src/index.ejs"
  },
  publicPath: "/",
  disableDynamicImport: true,
  hash: true,
  extraBabelIncludes: [
    'node_modules/xlsx',
    'node_modules/adler-32',
    'node_modules/cfb',
    'node_modules/codepage',
    'node_modules/commander',
    'node_modules/exit-on-epipe',
    'node_modules/printj',
    'node_modules/crc-32',
    'node_modules/ssf',
    'node_modules/frac',
  ],
}
