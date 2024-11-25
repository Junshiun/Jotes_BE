// const jwt = require("jsonwebtoken");
// const user = require("../models/userModel.js");
// const asyncHandler = require("express-async-handler");

import expressAsyncHandler from "express-async-handler";
import jwt, { Secret } from "jsonwebtoken";
import user from "@models/userModel";
import { NextFunction, Request, Response } from "express";
import { JwtSecret } from "@utils/jwtSecret";

const asyncHandler = expressAsyncHandler;

const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const scrt = await JwtSecret();

      //decodes token id
      const decoded = jwt.verify(token, scrt as Secret) as jwt.JwtPayload;

      res.locals.user = await user.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({
        errorDesc: "Not authorized, token failed"
      });
      // throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401).json({
      errorDesc: "Not authorized, no token"
    });
    // throw new Error("Not authorized, no token");
  }
});

export { protect };
