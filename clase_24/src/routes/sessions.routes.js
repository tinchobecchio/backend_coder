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

// Desafio clase 24
sessionsRouter.get("/current", (req,res) => {
  if(req.user) {
    return res.status(200).send(req.user)
  } else {
    return res.status(200).json({message: 'No user found'})
  }
});

export default sessionsRouter;
