var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    data  = require('gulp-data'),
    shell = require('gulp-shell'),
    path  = require('path'),
    fs    = require('fs'),
    time  = require('time'),
    mongo = require('./lib/mongo'),
    config = require('./config')

var _ = {
  scrape: {
    ignore: ['node_modules', 'package.json', 'README.md'],

    scan: new function() {
      return data(function(f, cb) {
        if ( fs.lstatSync(f.path).isDirectory() ) {
          var n = path.basename(f.path);
          if ( n[0] === '.' || _.scrape.ignore.indexOf(n) !== -1 ) return cb(undefined, null)
          gutil.log('['+n+']', f.path);

          mongo.db.scrape.findOne({_id: n}, function(err, doc) {
              if ( err ) return cb(err)

              var scfg = config.scrape
              try { scfg = require(f.path+'/config'); } catch(e) { gutil.log('['+n+']', 'no config file found'); }

              if ( doc && ( ! doc.update || doc.last + scfg.update > time.time() ) ) {
                if ( ! doc.last )
                  gutil.log('['+n+']', 'please check test scritps and clean up', doc.update);
                else
                  gutil.log('['+n+']', 'nothing to update');

                return cb(undefined, null)
              }
              else gutil.log('['+n+']', 'is ripe for testing');

              //todo: check if process.id matches?
              mongo.db.scrape.update({_id: n}, {
                _id: n,
                pid: process.env.MONGO_NAME + '-' + process.pid,
                last: time.time()
              }, {upsert: true}, function(err, res) { if ( err ) return cb(err) })

              cb(undefined, f.path);
            })
        }
        else { gutil.warn('expecting folder: ', f); cb() }
      })
    },

    gulp: new function() {
      return shell([
        'gulp --gulpfile <%= file.path %>/gulpfile.js'
      ], {ignoreErrors: true})
    }

  }
}

gulp.task('mongodb', mongo.connect)

gulp.task('default', ['mongodb'], function(cb) {

  gulp.src('./scrape/*', {read: false})
    .pipe(_.scrape.scan)
    .pipe(_.scrape.gulp)
    .on('finish', function() {

      mongo.db.$.close(function() {
        gutil.log('[mongo] closed')
        cb()
      })

    })

})
