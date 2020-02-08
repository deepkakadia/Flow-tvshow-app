const mongoCollections = require("./mongoCollections");
const comments = mongoCollections.comments
const { ObjectId } = require("mongodb").ObjectId;
const tasks = require("./tasks");



async function addcomments(id, name, comment) {
    if (!id) throw "Please provide task id";
    if (!name) throw "You must provide a title";
    if (!comment) throw "You must provide a content";

    const commentCollection = await comments();
    //const animalThatPosted = await animals.getAnimalById(posterId);

    const newCommentInfo = {
        name: name,
        comment: comment
    };
    const insertInfo = await commentCollection.insertOne(newCommentInfo);
    const newId = insertInfo.insertedId;

    await tasks.addCommentToTask(id, newId, name, comment)
    if (insertInfo.insertedCount === 0) throw "Could not add post";
    let newComment = await getCommentById(newId);
    return newComment;
};

async function getCommentById(id) {
    const commentsCollection = await comments();
    const a1 = await commentsCollection.findOne({ _id: ObjectId(id) });
    if (!a1) throw 'Comment not found';
    return a1;
}

async function removeCommentById(id) {
    const commentsCollection = await comments();
    const a1 = await commentsCollection.removeOne({ _id: ObjectId(id) });
    if (!a1) throw 'Comment not found';
    return a1;
}


module.exports = {
    addcomments,
    getCommentById,
    removeCommentById
}