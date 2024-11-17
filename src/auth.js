const authAdmine = function (req, res, next) {
  console.log("admin auth geting cheked");

  const token = "xyz";

  const isAdminAutherized = token === "xyz";

  if (!isAdminAutherized) {
    res.status(401).send("unautharized Request");
  } else {
    next();
  }
};

module.exports{}