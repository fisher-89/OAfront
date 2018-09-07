export default {
  "entry": "src/index.js",
  "extraBabelPlugins": [
    [
      "import",
      {
        "libraryName": "antd",
        "libraryDirectory": "es",
        "style": true
      }
    ]
  ],
  "define": {
    "OA_PATH": "http://of.xigemall.com/",
    "OA_CRM_UPLOAD": "http://112.74.177.132:8003/admin/",
    "OA_CLIENT_ID": "9",
    "OA_CLIENT_SECRET": "6gfA4APghrptH5bBhudctfFrxQFC8ZxFA7VRwHcz",
    "AUTH_NAME": "pro",
    "TOKEN_PREFIX": "OA_"
  },
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr"
      ],
      "define": {
        "OA_PATH": "http://112.74.177.132:8002/",
        "OA_CRM_UPLOAD": "http://112.74.177.132:8003/admin/",
        "OA_CLIENT_ID": "2",
        "OA_CLIENT_SECRET": "Z77PmFkOD9SMAIbVDZcKRxOD6f0YA0ck54amYEr1"
      }
    },
    "production": {
      "define": {
        "OA_PATH": "http://of.xigemall.com/",
        "OA_CRM_UPLOAD": "http://112.74.177.132:8003/admin/",
        "OA_CLIENT_ID": "9",
        "OA_CLIENT_SECRET": "6gfA4APghrptH5bBhudctfFrxQFC8ZxFA7VRwHcz"
      }
    }
  },
  "ignoreMomentLocale": true,
  "theme": "./src/theme.js",
  "html": {
    "template": "./src/index.ejs"
  },
  "publicPath": "/",
  "disableDynamicImport": true,
  "hash": true
}