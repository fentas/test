

process.on('message', function(m) {
  casper.echo('CHILD got message:', m);
});


casper.test.begin('Cow can moo', 0, function suite(test) {
    casper.echo("Hey, I'm executed after the suite.");

    test.done();
});
