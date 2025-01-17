module.exports = {
  globDirectory: "build/",
  globPatterns: [
    "**/*.{wav,mp3,WAV,png,jpg,js,json,css,html}",
    
    "lang/**/*.json"
  ],
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
  swDest: "build/sw.js",
  swSrc: "sw-src.js",
  globIgnores: [
    "lang/**/*.{wav,mp3,WAV,png,jpg}",

  ]
};
