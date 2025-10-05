import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  try {
    // 1. Uzmi token iz cookies ili headera
    let token = req.cookies?.access_token;
    if (!token) {
      const authHeader = req.headers["authorization"];
      token = authHeader?.split(" ")[1]; // Bearer TOKEN
    }

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    // 2. Verify
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log("JWT error:", err.message); // dodaj log za debug
        return res
          .status(401)
          .json({ error: "Invalid or expired access token" });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export { authenticateToken };
