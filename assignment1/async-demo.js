
const fs = require('fs');
const path = require('path');

const sampleDir = path.join(__dirname, 'sample-files');
const sampleFile = path.join(sampleDir, 'sample.txt');

// Write a sample file for demonstration
async function createSampleFile() {
  await fs.promises.mkdir(sampleDir, { recursive: true });
  await fs.promises.writeFile(sampleFile, 'Hello, async world!');
}

// 1. Callback style
function readWithCallback() {
  fs.readFile(sampleFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('Callback:', data);
  });
}

// Callback hell example (kept in comments):
/*
fs.readFile('first.txt', 'utf8', (err, first) => {
  if (err) return console.error(err);

  fs.readFile('second.txt', 'utf8', (err, second) => {
    if (err) return console.error(err);

    fs.readFile('third.txt', 'utf8', (err, third) => {
      if (err) return console.error(err);

      console.log(first, second, third);
    });
  });
});
*/

// 2. Promise style
function readWithPromise() {
  return fs.promises.readFile(sampleFile, 'utf8')
    .then((data) => {
      console.log('Promise:', data);
    })
    .catch((err) => {
      console.error(err);
    });
}

// 3. Async/Await style
async function readWithAsyncAwait() {
  try {
    const data = await fs.promises.readFile(sampleFile, 'utf8');
    console.log('Async/await:', data);
  } catch (err) {
    console.error(err);
  }
}

async function main() {
  try {
    await createSampleFile();

    readWithCallback();
    await readWithPromise();
    await readWithAsyncAwait();
  } catch (err) {
    console.error(err);
  }
}

main();
