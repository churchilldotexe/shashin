import { ImageSlider } from "@/components/ImageSlider";

const sampleImages = ["/AZKi.png", "/furina-white.jpg", "/furina.jpeg", "/watame.png"];

export default function HomePage() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center  text-white">
      <article className="size-full border border-foreground p-6">
        <header className="flex items-center justify-between">
          <h1>AZKi</h1>
          <time dateTime={new Date().toISOString()}>{new Date().toLocaleDateString()}</time>
        </header>
        <figure>
          <figcaption>this is the description about the photo. limit of 255 characters</figcaption>
          <ImageSlider url={sampleImages} />
        </figure>
      </article>
      <article className="size-full border border-foreground p-6">
        <header className="flex items-center justify-between">
          <h1>AZKi</h1>
          <time dateTime={new Date().toISOString()}>{new Date().toLocaleDateString()}</time>
        </header>
        <figure>
          <figcaption>this is the description about the photo. limit of 255 characters</figcaption>
          <ImageSlider url={["/AZKi.png"]} />
        </figure>
      </article>
      <article className="size-full border border-foreground p-6">
        <header className="flex items-center justify-between">
          <h1>AZKi</h1>
          <time dateTime={new Date().toISOString()}>{new Date().toLocaleDateString()}</time>
        </header>
        <figure>
          <figcaption>this is the description about the photo. limit of 255 characters</figcaption>
          <ImageSlider url={["/furina-white.jpg", "/furina.jpeg", "/watame.png"]} />
        </figure>
      </article>
    </section>
  );
}
