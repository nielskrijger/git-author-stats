#!/usr/bin/env node

import yargs from 'yargs';
import Commits from './Commits';
import { cwd } from './shell';

const argv = yargs
  .usage('$0 <directory>')
  .demandCommand(1)
  .option('g', {
    alias: 'glob',
    default: '**',
    describe: 'show stats only for files matching this glob',
  })
  .option('t', {
    alias: 'since',
    default: null,
    describe: 'only include commits since this date (YYYY-MM-DD)',
  })
  .help()
  .argv;

cwd(argv._[0]);

const commits = new Commits(argv.since);
const stats = commits.stats(argv.glob);

Object.keys(stats).forEach((name) => {
  console.log(`Name: ${name}`);
  console.log(`Lines added: ${stats[name].lines_added}`);
  console.log(`Lines deleted: ${stats[name].lines_deleted}`);
  console.log(`Commits: ${stats[name].commits}`);
  console.log('');
});
