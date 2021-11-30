// this is a normal middleware
// not a specific error handling one
exports.handlePathErrors = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleServerErrors = (err, req, res) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
