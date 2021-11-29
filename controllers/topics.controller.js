const selectTopics = require("../models/topics.model");

const getTopics = (req, res) => {
  // handle request
  // invoke model
  // send response
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

module.exports = getTopics;