module.exports = {
  ...require('moleculer'),
  eventName: function(name) {
    return name;
  },
};
