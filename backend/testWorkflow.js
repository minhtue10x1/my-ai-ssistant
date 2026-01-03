import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const WORKFLOW_ID = 'e2c31696-a4a9-473a-9e72-753e37529d7e'; // From previous step

const runTest = async () => {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('Login successful. Token acquired.');

    // 2. Trigger Workflow
    console.log(`Triggering Workflow ID: ${WORKFLOW_ID}...`);
    const triggerRes = await axios.post(
      `${API_URL}/workflow/${WORKFLOW_ID}/run`,
      { 
        owner: 'minhtue10x1', // Replace with your repo owner if needed
        repo: 'my-ai-ssistant', // Replace with your repo name
      },
      {
        headers: { 'x-auth-token': token }
      }
    );

    console.log('Workflow Execution Result:');
    console.log(JSON.stringify(triggerRes.data, null, 2));

  } catch (error) {
    if (error.response) {
        console.error('Error:', error.response.status, error.response.data);
    } else {
        console.error('Error:', error.message);
    }
  }
};

runTest();
