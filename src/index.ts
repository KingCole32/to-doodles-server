import express, { Express, Request, Response } from "express";
import cors from "cors";

import authRoutes from "./routes/auth"
import doodleRoutes from "./routes/doodles"
import tagRoutes from "./routes/tags"

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  res.send('Welcome to ToDoodles!');
});

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use( express.urlencoded({ extended: true }));
// catch-all for 
// app.use(notFound);
// app.use(handleError);

// api routes (in general, no sanitizing, TODO- express-validator)
app.use("/auth", authRoutes);
app.use("/doodles", doodleRoutes);
app.use("/tags", tagRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// export default db