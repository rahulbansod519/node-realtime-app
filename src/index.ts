import express from 'express';
import {Server} from 'socket.io';
import db from './db';
import redis from './redis';
import todosRouter from './routes/todos';
import { createServer } from 'http';

const app = express();
app.use(express.json());

app.get("/healthz", (req, res) => {
    res.send("OK");
})

app.get("/readyz", async (req, res) => {
    try {
        await db.query('SELECT 1');
        await redis.ping();
        res.send("OK");
    } catch (error) {
        console.error("Readiness check failed:", error);
    }
});

app.use("/api/todos", todosRouter);

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("New client connected");
    
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    // Handle other socket events here
})

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});