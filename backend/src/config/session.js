import session from "express-session";
import MongoStore from "connect-mongo";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing.");
}

const sessionMiddleware = session({
  name: "smartshop.sid",

  secret: process.env.SESSION_SECRET,

  resave: false,

  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 60 * 60 * 24 * 7,
  }),
  
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});

export default sessionMiddleware;