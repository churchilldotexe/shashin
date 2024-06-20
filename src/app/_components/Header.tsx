import { type HTMLAttributes } from "react";

export function Header(props: HTMLAttributes<HTMLElement>) {
  return (
    <header {...props}>
      <nav>
        <ul>
          <li>Home</li>
          <li>My Posts</li>
          <li>Bookmarks</li>
          <li>Gallery</li>
          <li>
            <ul>
              <li>Albums</li>
              <li>Posts</li>
              <li>Images</li>
              <li>Favorites</li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
}
