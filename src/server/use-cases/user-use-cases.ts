import "server-only";

import { getUserInfoById, updateUserInfoById } from "../data-access/users";
import { hasAccess } from "./auth/authentication";

export async function getUserInfo() {
  // to ensure that user is logged in and to make use JWT benefit
  const user = await hasAccess({ errorMsg: "please login" });

  const { userId } = user;
  try {
    const userInfo = await getUserInfoById(userId);
    return userInfo;
  } catch (error) {
    throw new Error("an error Occured while getting the users Info ");
  }
}

export async function setupUserProfile({
  url,
  urlKey,
  displayName,
}: {
  url: string;
  urlKey: string;
  displayName: string;
}) {
  const user = await hasAccess({
    errorMsg: "Please login to setup your profile",
  });

  const { userId } = user;
  try {
    await updateUserInfoById({ userId, displayName, avatar: url, urlKey });
  } catch (error) {
    throw new Error("an error Occured while getting the users Info ");
  }
}
