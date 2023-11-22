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
                // Sorting by the field dateCreateAt
                return new Date(b.dateCreateAt) - new Date(a.dateCreateAt);
            });
        }
        res.send(categories);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while fetching categories');
    }
}

async function getCategoriesById(req, res) {
    const { id } = req.params;
    try {
        let categories = await readFileData(filePath);
        const category = categories.find(category => category.id === id);
        if (!category) return res.status(404).send('Category not found');
        res.send(category);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while fetching category');
    }
}

async function deleteCategories(req, res) {
    const { id } = req.params;
    try {
        let categories = await readFileData(filePath);
        const index = categories.findIndex(category => category.id === id);
        if (index === -1)  return res.status(404).send('Category not found');
        categories.splice(index, 1);
        await fs.writeFile(filePath, JSON.stringify(categories, null, 2));
        res.send('Category successfully deleted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while deleting category');
    }
}

async function updateCategories(req, res) {
    const { id } = req.params;
    const { name, nickname } = req.body;
    try {
        let categories = await readFileData(filePath);
        const index = categories.findIndex(category => category.id === id);
        if (index === -1) return res.status(404).send('Category not found');
        categories[index] = {
            ...categories[index],
            name,
            nickname,
        };
        await fs.writeFile(filePath, JSON.stringify(categories, null, 2));
        res.send('Category successfully updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while updating category');
    }
}


module.exports = router;
