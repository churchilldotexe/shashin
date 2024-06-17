import { type HTMLAttributes } from "react";

export function Header(props: HTMLAttributes<HTMLElement>) {
  return (
    <header {...props}>
      <nav>
        <ul>
          <li>Home</li>
          <li>Gallery</li>
          <ul>
            <li>Albums</li>
            <li>Posts</li>
            <li>Images</li>
          </ul>
          <li>Favorites</li>
        </ul>
      </nav>
    </header>
  );
}
