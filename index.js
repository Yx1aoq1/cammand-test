#! /usr/bin/env node

var program = require('commander')
var rename = require('./src/rename')
var init = require('./src/init')

program.parse(process.argv)