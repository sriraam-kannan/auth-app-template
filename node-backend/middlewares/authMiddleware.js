import { CognitoJwtVerifier } from "aws-jwt-verify";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.idtoken;
  try {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      tokenUse: "id", // "id" for ID tokens, "access" for Access tokens
      clientId: process.env.COGNITO_CLIENT_ID, // Optional
    });

    const payload = await verifier.verify(token);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "Unauthorized!",
      error: e?.message,
    });
  }
};
