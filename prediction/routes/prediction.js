var express       = require("express"),
  	router        = express.Router(),
    functions     = require("../functions/logic");

router.get("/", (req, res) => {
      functions.update(res);
});

module.exports = router;
