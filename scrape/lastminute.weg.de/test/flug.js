var system = require('system')

system.stdout.write('Hello, system.stdout.write!\n');
var line = system.stdin.readLine();
system.stdout.writeLine(JSON.stringify(line));

var casper = require("casper").create();

casper.echo('here!!!');

casper.exit();
