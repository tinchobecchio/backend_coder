import { Router } from "express";
import { destroySession } from "../controllers/session.controller.js";
import passport from "passport";

const sessionsRouter = new Router();

sessionsRouter.post(
  "/signup",
  passport.authenticate("register", {
    failureRedirect: "/errorSignup",
    successRedirect: "/products",
  })
);

sessionsRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/errorLogin",
    successRedirect: "/products",
  })
);

sessionsRouter.get("/logout", destroySession);

// Passport con github
sessionsRouter.get("/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

sessionsRouter.get("/github/callback", passport.authenticate("github", {
    failureRedirect: "/",
    successRedirect: "/products",
}));

export default sessionsRouter;
