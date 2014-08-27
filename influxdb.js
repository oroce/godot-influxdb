var util = require('util');
var influxdb = require('influx');
var ReadWriteStream = require('godot').common.ReadWriteStream;

var Influxdb = module.exports = function Influxdb(options) {
  if (!(this instanceof Influxdb)) { return new Influxdb(options) }
  
  options || (options = {});
  ReadWriteStream.call(this);

  this.prefix   = options.prefix   || 'godot';

  this.client  = options.client    ||
                 influxdb(options.host, options.port, options.user, options.password, options.database);
  
  this.format = options.format || this._format;
};

util.inherits(Influxdb, ReadWriteStream);

Influxdb.prototype._format = function (data) {
  var metricName = util.format('%s.%s.%s',
    this.prefix,
    data.host.replace(/\./g, '_'),
    data.service.replace(/\./g, '_').replace(/\//g, '.')
  );
  return {
    name: metricName,
    metric: {
      time: data.time,
      value: data.metric
    }
  };
};

Influxdb.prototype.write = function (data) {
  var self    = this;
  var point = this.format(data);
  this.client.writePoint(point.name, point.metric, function(err) {
    if (err) {
      return self.emit('reactor:error', err);
    }
  });

  this.emit('data', data);
};
