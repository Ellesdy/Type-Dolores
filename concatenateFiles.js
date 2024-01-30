const fs = require('fs');
const path = require('path');

function listFilesRecursive(dir, fileList = []) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fileList = listFilesRecursive(fullPath, fileList);
        } else {
            fileList.push(fullPath);
        }
    });
    return fileList;
}

function concatenateFiles(fileList, numberOfParts) {
    const totalContent = fileList.map(file => `File: ${file}\n\n${fs.readFileSync(file, 'utf-8')}`).join('\n\n');
    const partLength = Math.ceil(totalContent.length / numberOfParts);
    let parts = [];

    for (let i = 0; i < numberOfParts; i++) {
        const start = i * partLength;
        const end = start + partLength;
        parts.push(totalContent.slice(start, end));
    }

    return parts;
}

const srcPath = path.join(__dirname, 'src'); // Adjust 'src' if needed
const fileList = listFilesRecursive(srcPath);
const parts = concatenateFiles(fileList, 10);

// Save each part into a separate file
parts.forEach((part, index) => {
    fs.writeFileSync(`concatenatedPart_${index + 1}.txt`, part);
});

console.log('Concatenation complete. Files saved.');
