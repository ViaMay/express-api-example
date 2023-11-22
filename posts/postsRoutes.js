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
                    parseInt(a.dateCreateAt.split('.')[2]), // Year
                    parseInt(a.dateCreateAt.split('.')[1]) - 1, // Month (0 to 11)
                    parseInt(a.dateCreateAt.split('.')[0]) // Day
                );
                const dateB = new Date(
                    parseInt(b.dateCreateAt.split('.')[2]), // Year
                    parseInt(b.dateCreateAt.split('.')[1]) - 1, // Month (0 to 11)
                    parseInt(b.dateCreateAt.split('.')[0]) // Day
                );

                return dateB - dateA; // Return the result of sorting in descending order of date

            });
        }
        res.send(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while getting posts');
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
        res.status(500).send('Error while adding post and writing to file');
    }
}

async function getPostById(req, res) {
    const { id } = req.params;
    try {
        let posts = await readFileData(filePath);
        const post = posts.find(post => post.id === id);
        if (!post) return res.status(404).send('Post not found');
        res.send(post);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while getting post');
    }
}

async function deletePost(req, res) {
    const { id } = req.params;
    try {
        let posts = await readFileData(filePath);
        const index = posts.findIndex(post => post.id === id);
        if (index === -1)  return res.status(404).send('Post not found');
        posts.splice(index, 1);
        await fs.writeFile(filePath, JSON.stringify(posts, null, 2));
        res.send('Post successfully deleted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while deleting post');
    }
}

async function updatePost(req, res) {
    const { id } = req.params;
    const { title, text, author, tags, categoryId } = req.body;
    try {
        let posts = await readFileData(filePath);
        const index = posts.findIndex(post => post.id === id);
        if (index === -1) return res.status(404).send('Post not found');

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
        res.send('Post successfully updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while updating post');
    }
}

module.exports = router;
