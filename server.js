// ✅ server.js
import cluster from 'cluster';
import os from 'os';
import server from './index.js';

 
const PORT = process.env.PORT || 4007;
 
if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  // Fork workers for each CPU
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
 
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
 
} else {
  server.listen(PORT, () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
}