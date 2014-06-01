[http://influxdb.org](influxdb) forwarder for [http://github.com/nodejitsu/godot](godot).

### Example

    var godot = require('godot');
    var influxdb = require('godot-influxdb');
    godot.createServer({
      type: 'tcp',
      multiplex: false,
      reactors: [
        function(socket) {
          socket
            .pipe(godot.console())
            .pipe(influxdb({
              username: 'root',
              password: 'root',
              database: 'a-existing-influx-database',
              port: 8083,
              host: 'localhost'
            }));
        }
        
      ]
    }).listen(1337);

### Warning

[http://github.com/nodejitsu/godot](godot) currently added as dependency, I'm gonna move it `peerDependency` as soon as 1.0.0 will be released.