const express = require('express');
const router = express.Router();
const path = require('path');
const { readFileData } = require("../readFileData");
const fs = require('fs').promises;

const filePath = path.join(__dirname, 'posts.json');

router.get('/v1/api/posts', getPosts);
router.post('/v1/api/posts', createPost);
router.get('/v1/api/posts/:id', getPostById);
router.delete('/v1/api/posts/:id', deletePost);
router.patch('/v1/api/posts/:id', updatePost);

async function getPosts(req, res) {
    const { orderBy } = req.query;
    try {
        let posts = await readFileData(filePath);
        if (orderBy === 'dateCreateAt') {
            posts = posts.sort((a, b) => {
                const dateA = new Date(
                    parseInt(a.dateCreateAt.split('.')[2]), // Год
                    parseInt(a.dateCreateAt.split('.')[1]) - 1, // Месяц (от 0 до 11)
                    parseInt(a.dateCreateAt.split('.')[0]) // День
                );
                const dateB = new Date(
                    parseInt(b.dateCreateAt.split('.')[2]), // Год
                    parseInt(b.dateCreateAt.split('.')[1]) - 1, // Месяц (от 0 до 11)
                    parseInt(b.dateCreateAt.split('.')[0]) // День
                );

                return dateB - dateA; // Возвращаем результат сортировки по убыванию даты

            });
        }
        res.send(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении постов');
    }
}

async function createPost(req, res) {
    const { title, text, author, tags, categoryId } = req.body;

    try {
        let posts = await readFileData(filePath);
        const dateCreateAt = Date.now().toString();
        const id = Date.now().toString();
        const newPost = {
            id,
            tags,
            categoryId,
            dateCreateAt,
            title,
            text,
            author
        };

        posts.push(newPost);
        await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
        res.send(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при добавлении поста и записи в файл');
    }
}

async function getPostById(req, res) {
    const { id } = req.params;
    try {
        let posts = await readFileData(filePath);
        const post = posts.find(post => post.id === id);
        if (!post) return res.status(404).send('Пост не найден');
        res.send(post);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении поста');
    }
}

async function deletePost(req, res) {
    const { id } = req.params;
    try {
        let posts = await readFileData(filePath);
        const index = posts.findIndex(post => post.id === id);
        if (index === -1)  return res.status(404).send('Пост не найден');
        posts.splice(index, 1);
        await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
        res.send('Пост успешно удален');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при удалении поста');
    }
}

async function updatePost(req, res) {
    const { id } = req.params;
    const { title, text, author, tags, categoryId } = req.body;
    try {
        let posts = await readFileData(filePath);
        const index = posts.findIndex(post => post.id === id);
        if (index === -1) return res.status(404).send('Пост не найден');

        posts[index] = {
            ...posts[index],
            title,
            text,
            author,
            tags: tags.toString(),
            categoryId,
            updatedAt: Date.now().toString()
        };
        await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
        res.send('Пост успешно обновлен');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при обновлении поста');
    }
}

module.exports = router;
