#! /usr/bin/env node

const command = process.argv[2]

if (command === 'hello') {
  console.log('hello world')
} else if (command === 'bye') {
  console.log('goodbye world')
}