const selectTopics = require("../models/topics.model");

const getTopics = (req, res) => {
  // handle request
  // invoke model
  selectTopics().then((topics) => {
    // send response
    res.status(200).send({ topics });
  });
};

module.exports = getTopics;
