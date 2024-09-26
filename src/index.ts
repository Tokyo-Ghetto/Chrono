import express, { Request, Response } from "express";
import { routes } from "./routes/index.js";

const app = express();
const port: number = 3000;

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hi! Chrono placedholder page.');
// });

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
