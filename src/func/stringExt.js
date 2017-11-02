if (!String.prototype.format) {
  // eslint-disable-next-line
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] !== 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

const delay = ms => {
    return (result => {
        return new Promise((resolve, reject) => {
            setTimeout( () => resolve(result), ms);
        });
    })};

const getEnvironmentVars = () => {
  return process.env;
};

const getEnvironmentVar = (name) => {
  return process.env[name];
};