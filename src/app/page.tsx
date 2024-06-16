import { ImageSlider } from "@/components/ImageSlider";

const sampleImages = ["/AZKi.png", "/furina-white.jpg", "/furina.jpeg", "/watame.png"];

export default function HomePage() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center  text-white">
      <ImageSlider url={sampleImages} />
      <ImageSlider url={sampleImages} />
      <ImageSlider url={sampleImages} />
      <ImageSlider url={sampleImages} />
      <ImageSlider url={sampleImages} />
      <ImageSlider url={sampleImages} />
      <ImageSlider url={sampleImages} />
    </section>
  );
}
