/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

export const jwtVerify = (token: string) => {
  console.log("hjsJH73jskw92ksldkw9shU37JdkjGd&*78SjDlKsd7#*(ksLdslK");
  try {
    const decoded = jwt.verify(
      token,"jjjnn" as string
    ) as JwtPayload;

    console.log(decoded, "decoded");

    return decoded;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const decode = (token: string) => {
  const decoded = jwtDecode(token) as JwtPayload;

  return decoded;
};