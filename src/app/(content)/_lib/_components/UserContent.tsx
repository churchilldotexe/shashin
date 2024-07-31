"use client";

import { useState } from "react";
import { logoutAction } from "../Actions";

export function UserContent() {
  const [loading, setLoading] = useState<boolean>(false);

  // TODO: User Profile
  // [] - get the userInfo by userId
  // [] - create a userProfile action(popover)
  // [] - list the user basic information including the logout button
  //       [] - the logout button should give a popup DIALOG for confirmation
  return (
    <button
      type="button"
      onClick={async () => {
        setLoading(true);
        await logoutAction();
        setLoading(false);
      }}
    >
      {loading ? "loggingOut" : "Logout "}
    </button>
  );
}
