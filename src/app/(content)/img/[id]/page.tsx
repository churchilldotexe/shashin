export default function ImagePage({
  params: { id },
}: {
  params: { id: string };
}) {
  return <div>{id}</div>;
}
