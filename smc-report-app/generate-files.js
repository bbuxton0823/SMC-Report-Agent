const fs = require('fs'); console.log('Starting...'); fs.writeFileSync('test-output.txt', 'This is a test', 'utf8'); console.log('File written');
