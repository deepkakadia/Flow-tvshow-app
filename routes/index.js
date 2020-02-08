
const taskRoutes = require("./tasks");


const constructorMethod = app => {
    app.use("/tvapi/shows", taskRoutes);


    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethod;