const mongoCollections = require('./mongoCollections');
const tasks = mongoCollections.tasks;
const comments = mongoCollections.comments;
const { ObjectId } = require("mongodb").ObjectId;


async function create(title, description, hoursEstimated, completed) {
    if (!title || typeof (title) !== "string") throw "You must provide valid string as title";
    if (!description || typeof (description) !== "string") throw "You must provide valid string as description";
    if (!hoursEstimated || typeof (hoursEstimated) !== "number") throw "You must provide valid number";


    const tasksCollection = await tasks();

    let newtask = {
        title: title,
        description: description,
        hoursEstimated: hoursEstimated,
        completed: completed,
        comments: []
    };

    const insertInfo = await tasksCollection.insertOne(newtask);
    if (insertInfo.insertedCount === 0) throw " Could not add the task succesfully ";

    const newId = insertInfo.insertedId;
    const task = await getTaskById(newId);
    return task;
}

async function getAll(take, skip) {
    const tasksCollection = await tasks();
    skip = Number(skip);
    take = Number(take);
    const a1 = await tasksCollection.find({}).skip(skip).limit(take).toArray();
    // let a = {};
    // let x = 0;
    // let i = Number(skip);
    // let j = Number(skip) + Number(take);
    // for (i; i < j; i++) {
    //     a[x] = a1[i];
    //     x++;
    // }
    if (!a1) throw "No tasks are currently present";
    return a1;
}

async function getTaskById(id) {
    const tasksCollection = await tasks();
    const a1 = await tasksCollection.findOne({ _id: ObjectId(id) });
    if (!a1) throw 'User not found';
    return a1;
}

async function addCommentToTask(id, commentId, commentName, comment) {
    let currentUser = await getTaskById(id)
    console.log(currentUser);

    const userCollection = await tasks();
    const updateInfo = await userCollection.updateOne(
        { _id: ObjectId(id) },
        { $addToSet: { comments: { id: commentId, name: commentName, comment: comment } } }
    );
    if (updateInfo.modifiedCount === 0) {
        throw 'could not update animal successfully';
    }

}


async function removeCommentFromTask(id, commentId) {
    const userCollection = await tasks();
    const updateInfo = await userCollection.updateOne({ _id: ObjectId(id) }, { $pull: { "comments": { id: ObjectId(commentId) } } });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    return getTaskById(id);
}

async function modifyTask(id, newTitle, newDescription, newhoursEstimated, newCompleted) {
    if (!id) throw 'You must provide an id to search for';
    if (!ObjectId.isValid(id)) throw "Please input a valid Id"
    if (!newTitle || typeof (newTitle) !== "string") throw "You must provide a title for your task";
    if (!newDescription || typeof (newDescription) !== "string") throw "You must provide a desciption for your task";
    const taskCollection = await tasks();
    const updatedanimal = {
        title: newTitle,
        description: newDescription,
        hoursEstimated: newhoursEstimated,
        completed: newCompleted
    };
    const updatedInfo = await taskCollection.updateOne({ _id: ObjectId(id) }, { $set: updatedanimal });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update animal successfully';
    }

    return await getTaskById(id);
}

async function modifyTask(id, newTitle, newDescription, newhoursEstimated, newCompleted) {
    if (!id) throw 'You must provide an id to search for';
    if (!ObjectId.isValid(id)) throw "Please input a valid Id";
    let temp = await getTaskById(id);
    if (!newTitle) {
        newTitle = temp.title;
    }
    if (!newDescription) {
        newDescription = temp.description;
    }
    if (!newhoursEstimated) {
        newhoursEstimated = temp.hoursEstimated;
    }
    if (newCompleted == undefined) {
        newCompleted = temp.completed;
    }
    if (!newTitle || typeof (newTitle) !== "string") throw "You must provide a title for your task";
    if (!newDescription || typeof (newDescription) !== "string") throw "You must provide a desciption for your task";
    const taskCollection = await tasks();
    const updatedanimal = {
        title: newTitle,
        description: newDescription,
        hoursEstimated: newhoursEstimated,
        completed: newCompleted
    };
    const updatedInfo = await taskCollection.updateOne({ _id: ObjectId(id) }, { $set: updatedanimal });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update animal successfully';
    }

    return await getTaskById(id);
}

module.exports = {
    removeCommentFromTask,
    addCommentToTask,
    getTaskById,
    getAll,
    create, modifyTask
}