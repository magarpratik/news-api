exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePathErrors = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};
