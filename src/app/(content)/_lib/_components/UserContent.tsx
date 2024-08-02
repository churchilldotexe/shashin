"use client";

import { cn } from "@/lib/utils/cn";
import {
  type ElementRef,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { logoutAction } from "../Actions";

function AvatarWithFallBack({
  displayName,
  avatar,
}: {
  avatar: string | null;
  displayName: string;
}) {
  const splittedString = displayName.split(" ");
  const initials = splittedString.map((string) => string.slice(0, 1)).join("");

  return avatar ? (
    <img
      src={avatar}
      alt="profile avatar"
      className="size-8 rounded-full object-cover object-center "
    />
  ) : (
    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-foreground">
      {initials}
    </div>
  );
}

export function UserContent({
  userName,
  displayName,
  avatar,
}: {
  displayName: string;
  userName: string;
  avatar: string | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<ElementRef<"input">>(null);
  const containerRef = useRef<ElementRef<"label">>(null);
  console.log(inputRef.current, "inputref");
  console.log(containerRef.current?.contains, "label node");
  useEffect(() => {
    console.log("did i run?");
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (inputRef.current) {
          inputRef.current.checked = false;
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // TODO: User Profile
  // [x] - get the userInfo by userId
  // [x] - define new table for users for avatar
  // [] - create a userProfile action(popover)
  // [] - display user avatar as a trigger
  // [] - chekout useTransition
  // [] - list the user basic information including the logout button
  return (
    <label ref={containerRef} htmlFor="tool-tip" className=" tool-tip relative">
      <input ref={inputRef} type="checkbox" id="tool-tip" className="peer sr-only" />
      <AvatarWithFallBack avatar={avatar} displayName={displayName} />
      <div
        className={cn(
          " -translate-x0/2 invisible absolute bottom-full left-full opacity-0 transition-all duration-500",
          " peer-checked:visible peer-checked:opacity-100"
        )}
      >
        <div>{displayName}</div>
        <button type="button" popoverTarget="warning">
          logout
        </button>
        <div>
          <button
            popover=""
            id="warning"
            type="button"
            onClick={async () => {
              setLoading(true);
              await logoutAction();
              setLoading(false);
            }}
          >
            {loading ? "loggingOut" : "Logout "}
          </button>
        </div>
      </div>
    </label>
  );
}
// after:content-[' '] after:fixed after:inset-0 after:w-screen after:h-screen after:bg-red-50

//  const  asd = {
// <details
//       className={cn("group  ", {
//         "after:bg-red-500 after:fixed after:inset-0  after:content-[' '] after:w-screen after:h-screen after:-translate-x-[10%] ": false,
//       })}
//       open={isOpen}
//       onToggle={(e) => {
//         setIsOpen(e.currentTarget.open);
//       }}
//       onKeyPress={(e) => {
//         handleKeyPress(e);
//       }}
//     >
//       <summary className="cursor-pointer  list-none">
//         <AvatarWithFallBack avatar={avatar} displayName={displayName} />
//       </summary>{" "}
//       {/* {createPortal( */}
//       <div
//         className={cn(
//           "  group-open:bg-red-500",
//           "after:bg-red-500 after:absolute after:inset-0  after:content-[' '] after:w-screen after:h-screen after:-translate-x-[10%] ",
//           isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
//         )}
//       >
//         <div>{displayName}</div>
//         <button type="button" popoverTarget="warning">
//           logout
//         </button>
//         <div>
//           <button
//             popover=""
//             id="warning"
//             type="button"
//             onClick={async () => {
//               setLoading(true);
//               await logoutAction();
//               setLoading(false);
//             }}
//           >
//             {loading ? "loggingOut" : "Logout "}
//           </button>
//         </div>
//       </div>
//     </details>
// }
