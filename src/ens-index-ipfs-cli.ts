#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import { DockerManager } from './utils/docker';

const program = new Command();
const base_api_url = "http://0.0.0.0:42069"
const dockerManager = new DockerManager();

program
  .command('start')
  .description('Start all ENS-IPFS services using Docker')
  .action(async () => {
    try {
      await dockerManager.startServices();
    } catch (error) {
      console.error('Failed to start services:', error);
      process.exit(1);
    }
  });

program
  .command('stop')
  .description('Stop all ENS-IPFS services')
  .action(async () => {
    try {
      await dockerManager.stopServices();
    } catch (error) {
      console.error('Failed to stop services:', error);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Check the status of all services')
  .action(async () => {
    try {
      await dockerManager.checkStatus();
    } catch (error) {
      console.error('Failed to check status:', error);
      process.exit(1);
    }
  });

const nodesCommand = program.command('nodes').description('Manage nodes');

nodesCommand
  .command('get')
  .description('Get all nodes or a specific node by ID')
  .argument('[id]', 'Node ID to retrieve')
  .action((id) => {
    if (id) {
      axios.get(base_api_url + '/nodes/' + id)
        .then(response => {
          let current_node = response.data["node"];
          if (current_node) {
            console.log(
              current_node.id.padEnd(10) +
              current_node.name.padEnd(20) +
              current_node.url.padEnd(30) +
              current_node.type.padEnd(10) + 
              current_node.usage.toString()
            );
          }
          else {
            console.log(`Node with ID ${id} not found.`);
          }
        })
    } else {
      axios.get(base_api_url + '/nodes')
        .then(response => {
          if (response.data["nodes"].length === 0) {
            console.log('No nodes found.');
            return;
          }
          console.log('ID'.padEnd(10) + 'Name'.padEnd(20) + 'URL'.padEnd(30) + 'Type');
          console.log('-'.repeat(60));
          response.data["nodes"].forEach((node: { id: string, name: string; url: string, type: string}) => {
            console.log(
              node.id.padEnd(10) +
              node.name.padEnd(20) +
              node.url.padEnd(30) +
              node.type.padEnd(10)
            );
          });
        })
        .catch(error => {
          console.error('Error retrieving nodes:', error.message);
        });
    }
  });

nodesCommand
  .command('add')
  .description('Add a new node')
  .argument('<name>', 'Name of the node to add')
  .argument('<url>', 'URL of the node to add')
  .action((name, url) => {

    if (!name || !url) {
      console.error('Both name and URL are required to add a new node.');
      return;
    }

    axios.post(base_api_url + '/nodes', new URLSearchParams({
      name,
      url
    }).toString(), {
      headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then((response) => {
      let current_node = response.data["node"];
      console.log(
        current_node.id.padEnd(10) +
        current_node.name.padEnd(20) +
        current_node.url.padEnd(30) +
        current_node.type
      );
    })
    .catch(error => {
      console.error('Error adding new node:', error.message);
    });
  });

nodesCommand
  .command('count')
  .description('Get the total count of all nodes')
  .action(() => {
    axios.get(base_api_url + '/nodes/count')
      .then(response => {
        console.log(`Total nodes: ${response.data["count"]}`);
      })
      .catch(error => {
        console.error('Error retrieving node count:', error.message);
      });
  });

nodesCommand
  .command('delete')
  .description('Remove a node by ID')
  .argument('<id>', 'Node ID to delete')
  .action((id) => {
    axios.delete(base_api_url + '/nodes/' + id)
      .then(response => {
        if (response.data["deleted"]) {
          console.log(`Node with ID ${id} deleted successfully.`);
        } else {
          console.log(`Node with ID ${id} not found.`);
        }
      }
      )
});

program
 .command('hosted-files')
 .description('Get all hosted files')
 .action(() => {
  axios.get(base_api_url + '/hosted')
    .then(response => {
      if (response.data["users"].length === 0) {
        console.log('No hosted files found.');
        return;
      }
      console.log('ID'.padEnd(10) + 'Name'.padEnd(20) + 'URL'.padEnd(30) + 'Type');
      console.log('-'.repeat(60));
      response.data["users"].forEach((file: { node: string, name: string; hash: string, file_size: number}) => {
        console.log(
          file.node.padEnd(100) +
          file.name.padEnd(50) +
          file.hash.padEnd(100) +
          file.file_size.toString().padEnd(10)
        );
      });
    })
    .catch(error => {
      console.error('Error retrieving hosted files:', error.message);
    });
 })

program.parse(process.argv);