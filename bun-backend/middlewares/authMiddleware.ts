import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { Context, Next } from "hono";
import { getDbInstance, getTenantDb, setTenantDb } from "../database/dbConfig";
import { clientDatabase } from "../database/dbConstants";

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    //AWS token verification
    const token: any = c.req.header("token");
    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID || "",
      tokenUse: "id", 
      clientId: process.env.COGNITO_CLIENT_ID, 
    });

    const payload = await verifier.verify(token || "", {
      tokenUse: "id",
      clientId: process.env.COGNITO_CLIENT_ID || "", 
    });
    c.set("user", payload);

    // Client database verification function

    let tenantName: any = payload["custom:tenant_name"];
    if (tenantName && typeof tenantName !== "string") {
      tenantName = tenantName.toString();
    }

    setTenantDb(tenantName);

    const tenantDb = getDbInstance(tenantName);
    const userEmail: any = payload?.email;

    const userDetails = await tenantDb("users")
      .where({ email: userEmail })
      .first();

    if (userDetails) {
      c.set("userDetails", userDetails); 
      c.set("tenantDb", tenantDb);
    } else {
      throw new Error(" This user does not exist in database");
    }

    await next();
  } catch (e: any) {
    return c.json(
      {
        message: "Unauthorized!",
        error: e?.message,
      },
      401
    );
  }
};
