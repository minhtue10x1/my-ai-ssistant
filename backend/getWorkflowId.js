import sequelize from './config/database.js';
import { Workflow } from './models/index.js';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    try {
        const w = await Workflow.findOne();
        if (w) {
            console.log(`WORKFLOW_ID=${w.id}`);
        } else {
            console.log('No workflow found.');
        }
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
};

run();
