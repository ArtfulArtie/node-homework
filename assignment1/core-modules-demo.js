
const os = require('os');
const path = require('path');
const fs = require('fs');

const sampleFilesDir = path.join(__dirname, 'sample-files');

if (!fs.existsSync(sampleFilesDir)) {
  fs.mkdirSync(sampleFilesDir, { recursive: true });
}

async function main() {
  // OS module
  console.log('Platform:', os.platform());
  console.log('CPU:', os.cpus()[0].model);
  console.log('Total Memory:', os.totalmem());

  // Path module
  const joinedPath = path.join(
    sampleFilesDir,
    'folder',
    'file.txt'
  );
  console.log('Joined path:', joinedPath);

  // fs.promises API
  const demoFile = path.join(sampleFilesDir, 'demo.txt');
  await fs.promises.writeFile(demoFile, 'Hello from fs.promises!');
  const data = await fs.promises.readFile(demoFile, 'utf8');
  console.log('fs.promises read:', data);

  // Optional: Streams for large files
  const largeFile = path.join(sampleFilesDir, 'largefile.txt');
  const lines = Array.from(
    { length: 100 },
    (_, i) => `This is line ${i + 1} in a large file.\n`
  ).join('');

  await fs.promises.writeFile(largeFile, lines);

  const stream = fs.createReadStream(largeFile, {
    encoding: 'utf8',
    highWaterMark: 1024
  });

  stream.on('data', (chunk) => {
    console.log('Read chunk:', chunk.slice(0, 40));
  });

stream.on('end', () => {
  console.log('Finished reading large file with streams.');
});

  stream.on('error', (err) => {
    console.error(err);
  });
}

main().catch((err) => {
  console.error(err);
});
