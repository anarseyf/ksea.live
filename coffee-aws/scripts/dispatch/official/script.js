const { modifyAll } = require("./scriptUtil");
const { unmarkAsOld } = require("./mappers");

modifyAll(unmarkAsOld);
