import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export class DockerManager {
    private composePath: string;

    constructor() {
        // Get the absolute path to the docker-compose.yml file
        this.composePath = path.resolve(process.cwd(), 'docker/docker-compose.yml');
        
        // Ensure the docker-compose file exists
        if (!fs.existsSync(this.composePath)) {
            throw new Error(`docker-compose.yml not found at ${this.composePath}. Please ensure you are in the correct directory.`);
        }
    }

    private async runCommand(command: string[], options: { cwd?: string } = {}): Promise<string> {
        return new Promise((resolve, reject) => {
            const proc = spawn('docker-compose', command, {
                stdio: 'inherit',
                ...options
            });

            let output = '';

            proc.on('error', (err) => {
                reject(new Error(`Failed to execute docker-compose: ${err.message}`));
            });

            proc.on('close', (code) => {
                if (code === 0) {
                    resolve(output);
                } else {
                    reject(new Error(`docker-compose exited with code ${code}`));
                }
            });
        });
    }

    public async startServices(): Promise<void> {
        try {
            console.log('Starting ENS-IPFS services...');
            await this.runCommand(['up', '-d'], { cwd: path.dirname(this.composePath) });
            console.log('Services started successfully!');
            console.log('\nAvailable services:');
            console.log('- Dashboard: http://localhost');
            console.log('- API: http://localhost:42069');
            console.log('- IPFS Gateway: http://localhost:8080');
            console.log('- IPFS API: http://localhost:5001');
        } catch (error) {
            console.error('Failed to start services:', error);
            throw error;
        }
    }

    public async stopServices(): Promise<void> {
        try {
            console.log('Stopping ENS-IPFS services...');
            await this.runCommand(['down'], { cwd: path.dirname(this.composePath) });
            console.log('Services stopped successfully!');
        } catch (error) {
            console.error('Failed to stop services:', error);
            throw error;
        }
    }

    public async checkStatus(): Promise<void> {
        try {
            await this.runCommand(['ps'], { cwd: path.dirname(this.composePath) });
        } catch (error) {
            console.error('Failed to check service status:', error);
            throw error;
        }
    }
} 