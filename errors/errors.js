exports.handlePathErrors = (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
};
