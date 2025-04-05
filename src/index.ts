#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('ens-index-ipfs-cli')
  .description('The CLI to manage the ENS Pinning Service')
  .version('1.0.0');

program
  .command('greet')
  .description('Print a greeting message')
  .argument('<name>', 'Name to greet')
  .action((name) => {
    console.log(`Hello, ${name}!`);
  });

program.parse(process.argv);