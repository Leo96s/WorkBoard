// lib/tagColor.ts
const TAG_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-orange-100 text-orange-700",
];

export function tagColor(tag: string) {
  const index = tag.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return TAG_COLORS[index % TAG_COLORS.length];
}