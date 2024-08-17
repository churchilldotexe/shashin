import { cn } from "@/lib/utils";

const getPercentage = ({
  baseNumber,
  limit,
}: {
  baseNumber: number;
  limit: number;
}) => {
  return Math.floor(((limit - baseNumber) / limit) * 100);
};

export function CharacterLimitIndicator({
  characterLimit,
  textCount,
}: {
  characterLimit: number;
  textCount: number;
}) {
  const basePercentage = getPercentage({
    baseNumber: textCount,
    limit: characterLimit,
  });

  return (
    <div
      style={{
        width: `${basePercentage}%`,
        transition: "width 0.5s ease-out",
      }}
      className={cn("h-1 bg-green-500", {
        "bg-destructive": basePercentage < 10,
      })}
    />
  );
}
