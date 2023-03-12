{
    // rest of the webpack config
    resolve: {
      // ... rest of the resolve config
      fallback: {
        "path": require.resolve("path-browserify")
      }
    },
  }
  