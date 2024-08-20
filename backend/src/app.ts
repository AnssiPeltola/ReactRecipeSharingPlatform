import express, { Express } from "express";
import { Request as ExpressRequest } from "express";
import cors from "cors";
import session from "express-session";
import flash from "express-flash";
import passport from "./middleware/passportConfig";
import { TestController } from "./controllers/TestController";
import UserController from "./controllers/UserController";
import UserService from "./services/UserService";
import UserRepository from "./repositories/UserRepository";
import jwt from "jsonwebtoken";
import User from "./models/User";
import RecipeController from "./controllers/RecipeController";
import RecipeService from "./services/RecipeService";
import RecipeRepository from "./repositories/RecipeRepository";
import multer from "multer";

const app: Express = express();
const upload = multer({ storage: multer.memoryStorage() });
const testController = new TestController();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const recipeRepository = new RecipeRepository();
const recipeService = new RecipeService(recipeRepository);
const recipeController = new RecipeController(recipeService);

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Use the controller to handle the route
app.get("/test", testController.getTestMessage);

// User routes below this line ----------------------------

app.post("/register", (req, res) => userController.register(req, res));

app.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    (err: any, user: any, info: { message: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ message: info.message });
      }
      req.logIn(user, (err: any) => {
        if (err) {
          return next(err);
        }
        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET || "your-jwt-secret"
        );
        return res.json({ message: "Login successful", token });
      });
    }
  )(req, res, next);
});

app.post(
  "/register-details",
  passport.authenticate("jwt", { session: false }),
  (req, res) =>
    userController.registerDetails(req as ExpressRequest & { user?: User }, res)
);

app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error logging out" });
    } else {
      res.json({ message: "Logout successful" });
    }
  });
});

app.get(
  "/checkAuthentication",
  passport.authenticate("jwt", { session: false }),
  (req, res) => userController.checkAuthentication(req, res)
);

app.get(
  "/getUserDetails",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user) {
      const user: User = req.user as User;
      try {
        const userDetails = await userRepository.findById(user.id);
        res.json(userDetails);
      } catch (error) {
        res.status(500).json({ message: "Error fetching user details" });
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  }
);

app.get("/check-nickname", (req, res) =>
  userController.checkNickname(req, res)
);

app.post(
  "/uploadProfilePicture",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  (req, res) => userController.uploadProfilePicture(req, res)
);

app.get(
  "/getProfilePicture",
  passport.authenticate("jwt", { session: false }),
  (req, res) => userController.getProfilePicture(req, res)
);

app.get(
  "/hasProfilePicture",
  passport.authenticate("jwt", { session: false }),
  (req, res) => userController.hasProfilePicture(req, res)
);

app.delete(
  "/deleteProfilePicture",
  passport.authenticate("jwt", { session: false }),
  (req, res) => userController.deleteProfilePicture(req, res)
);

app.get("/profile_picture/:id", (req, res) =>
  userController.getProfilePictureById(req, res)
);

// Recipe routes below this line ----------------------------

app.post("/recipeCreate", upload.single("file"), (req, res) =>
  recipeController.createRecipe(req, res)
);

app.post("/uploadRecipePicture", upload.single("file"), (req, res) =>
  recipeController.uploadFile(req, res)
);

app.get("/recipePicture/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send("Invalid ID");
  }

  try {
    const file = await recipeRepository.getRecipePicture(id);

    if (!file) {
      return res.status(404).send("File not found");
    }

    res.setHeader("Content-Type", file.type);
    res.send(file.data);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).send("Error fetching file");
  }
});

// Recipe search
app.get("/search", (req, res) => recipeController.searchRecipes(req, res));

// Get recipe by ID
app.get("/recipe/:id", (req, res) => recipeController.getRecipeById(req, res));

// Get random recipe ID
app.get("/random-recipe", (req, res) =>
  recipeController.getRandomRecipeId(req, res)
);

// Get user recipes by user ID
app.get(
  "/getUserRecipes",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user) {
      const user: User = req.user as User;
      try {
        const recipes = await recipeController.getUserRecipes(user.id);
        res.json(recipes);
      } catch (error) {
        res.status(500).json({ message: "Error fetching user recipes" });
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  }
);

app.post(
  "/likeRecipe/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => recipeController.likeRecipe(req, res)
);

app.delete(
  "/unlikeRecipe/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => recipeController.unlikeRecipe(req, res)
);

app.get(
  "/likedRecipes",
  passport.authenticate("jwt", { session: false }),
  (req, res) => recipeController.getLikedRecipes(req, res)
);

app.get(
  "/isRecipeLiked/:recipeId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => recipeController.isRecipeLiked(req, res)
);

app.get("/recipeLikes/:recipeId", (req, res) =>
  recipeController.getRecipeLikes(req, res)
);

app.post(
  "/recipe/:recipeId/comment",
  passport.authenticate("jwt", { session: false }),
  (req, res) => recipeController.addComment(req, res)
);

app.get("/recipe/:recipeId/comments", (req, res) =>
  recipeController.getComments(req, res)
);

app.delete(
  "/comment/:commentId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => recipeController.deleteComment(req, res)
);

app.get("/latestRecipes", async (req, res) => {
  try {
    await recipeController.getLatestRecipes(req, res);
  } catch (error) {
    res.status(500).json({ message: "Error fetching latest recipes" });
  }
});

export default app;
