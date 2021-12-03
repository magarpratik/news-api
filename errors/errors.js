exports.handlePathErrors = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handlePsql400Errors = (err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleServerErrors = (err, req, res) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
