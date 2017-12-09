module.exports = function (w) {

    return {
      name: 'PML Developer Evaluation',
      files: [
        { pattern: 'src/**/*.ts', load: false },
        { pattern: 'src/**/*.spec.ts', ignore: true }
      ],
      filesWithNoCoverageCalculated: [
      ],
      tests: [
        { pattern: 'src/**/*.spec.ts', load: true }
      ],
      testFramework: 'mocha',
      env: {
        type: 'node'
      },
      compilers: {
        '**/*.ts': w.compilers.typeScript({ module: 'commonjs' })
      },
      workers: {
        initial: 5,
        regular: 2,
        recycle: false
      },
      setup: function (wallaby) {

      }
    };
  };
