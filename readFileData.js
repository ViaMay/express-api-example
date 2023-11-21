// Функция для чтения файла
const path = require('path');
const fs = require('fs').promises; // использование fs.promises для асинхронного чтения файла
async function readFileData(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Ошибка чтения файла: ${error.message}`);
    }
}



module.exports = { readFileData };
