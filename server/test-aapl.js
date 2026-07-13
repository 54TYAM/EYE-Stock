import { runInvestmentAgent } from './lib/agent.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  console.log("Running AAPL...");
  const res = await runInvestmentAgent('AAPL');
  console.log(res);
}

run();



run();
