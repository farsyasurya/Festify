import express from "express";
import dotenv from "dotenv";
import { router } from "./routes/route";
import session from "express-session";
import cookieParser from "cookie-parser"; 
import cors from "cors";
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());


app.use(
  session({
    secret: "flomba_super_secret", 
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, 
      maxAge: 1000 * 60 * 60,
    },
  })
);
app.use("/flearn", router)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});