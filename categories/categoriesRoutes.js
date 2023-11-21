const express = require('express');
const router = express.Router();
const path = require('path');
const { readFileData } = require("../readFileData");
const fs = require('fs').promises;

const filePath = path.join(__dirname, 'categories.json');

router.get('/v1/api/categories', getCategories);
router.get('/v1/api/categories/:id', getCategoriesById);
router.delete('/v1/api/categories/:id', deleteCategories);
router.patch('/v1/api/categories/:id', updateCategories);


async function getCategories(req, res) {
    const { orderBy } = req.query;
    try {
        let categories = await readFileData(filePath);
        if (orderBy === 'dateCreateAt') {
            categories = categories.sort((a, b) => {
                // Сортируем по полю dateCreateAt
                return new Date(b.dateCreateAt) - new Date(a.dateCreateAt);
            });
        }
        res.send(categories);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении категорий');
    }
}

async function getCategoriesById(req, res) {
    const { id } = req.params;
    try {
        let categories = await readFileData(filePath);
        const category = categories.find(category => category.id === id);
        if (!category) return res.status(404).send('Категория не найдена');
        res.send(category);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении категории');
    }
}

async function deleteCategories(req, res) {
    const { id } = req.params;
    try {
        let categories = await readFileData(filePath);
        const index = categories.findIndex(category => category.id === id);
        if (index === -1)  return res.status(404).send('Категория не найдена');
        categories.splice(index, 1);
        await fs.writeFile(filePath, JSON.stringify(categories, null, 2));
        res.send('Категория успешно удалена');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при удалении категории');
    }
}

async function updateCategories(req, res) {
    const { id } = req.params;
    const { name, nickname } = req.body;
    try {
        let categories = await readFileData(filePath);
        const index = categories.findIndex(category => category.id === id);
        if (index === -1) return res.status(404).send('Категория не найдена');
        categories[index] = {
            ...categories[index],
            name,
            nickname,
        };
        await fs.writeFile(filePath, JSON.stringify(categories, null, 2));
        res.send('Категория успешна обновлен');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при обновлении категории');
    }
}


module.exports = router;
