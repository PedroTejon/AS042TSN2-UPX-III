const asyncHandler = require("express-async-handler");

exports.get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User GET");
});