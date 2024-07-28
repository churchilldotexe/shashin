import "server-only";
import { queryDBUserData } from "../data-access/users";
import { getAuthenticatedId } from "./auth/tokenManagement";

export async function getUserInfo() {
  // to ensure that user is logged in and to make use JWT benefit
  const user = await getAuthenticatedId();

  if (user === undefined) {
    throw new Error("please login");
  }
  const { userId } = user;
  try {
    const userInfo = await queryDBUserData(userId);
    return userInfo;
  } catch (error) {
    throw new Error("an error Occured while getting the users Info ");
  }
}
