var base  = process.env.BASE || '../.dummy',

    spawn = require('child_process').spawn,
    gulp  = require('gulp'),
    gutil = require('gulp-util');
    shell = require('gulp-sell'),

    mongo = require(base + '/lib/mongo')

gulp.task('default', function() {

})

gulp.task('test', function() {
  var argv  = require('yargs')
        .usage('Usage: $0 test <scrape: _id> [<script: _id>]')
        .demand(2).argv,
      _id = argv._[1],
      _script = argv._[2]

  if ( fs.lstatSync(_id).isDirectory() ) {
    var casperChild = spawn(
      'casperjs',
      ['test', _id+'/test/'+(_script?_script:''), '--web-security=no'],
      {stdio: 'inherit'}) //stdio: 'inherit' -- ['pipe', process.stdout, 'pipe']

    //casperChild.stdout.on('data', function (data) {
    //    gutil.log('CasperJS:', data.toString().slice(0, -1)); // Remove \n
    //})
    casperChild.on('close', function (code) {
        var success = code === 0; // Will be 1 in the event of failure

        // Do something with success here
    })
  }
})

gulp.task('flug', function() {

})
