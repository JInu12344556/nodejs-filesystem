const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Ensure the directory exists
const directoryPath = path.join(__dirname, 'texts');
if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
}

// Helper function to get current date-time in the desired format
function getFormattedDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
}

// Endpoint to create a text file with the current timestamp
app.post('/create-file', (req, res) => {
    const currentDateTime = getFormattedDateTime();
    const filename = `${currentDateTime}.txt`;
    const filepath = path.join(directoryPath, filename);
    const timestamp = currentDateTime;

    fs.writeFile(filepath, timestamp, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error writing file', error: err });
        }
        res.status(200).json({ message: 'File created successfully', filename });
    });
});

// Endpoint to retrieve all text files in the folder
app.get('/list-files', (req, res) => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading directory', error: err });
        }
        const textFiles = files.filter(file => file.endsWith('.txt'));
        res.status(200).json({ files: textFiles });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
