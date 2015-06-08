var config = require('../config.js'),
    mongo = require('mongodb')

var _ = module.exports = {
  db: {$: null},

  connect: function(cb) {
    var uri = 'mongodb://'+config.mongo.host+':'+config.mongo.port+'/'+config.mongo.name

    mongo.MongoClient.connect(uri, function(err, db) {
      if ( err ) return cb(err)

      _.db.$ = db;
      for ( var i = 0 ; i < config.mongo.collections.length ; i++ )
        _.db[config.mongo.collections[i]] = db.collection(config.mongo.collections[i]);

      cb();
    })
  }
}
