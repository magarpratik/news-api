const { selectUsers } = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  // handle request
  // invoke model
  selectUsers().then((users) => {
    // send response
    res.status(200).send({ users });
  });
};
