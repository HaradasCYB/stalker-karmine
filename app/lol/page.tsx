import { GamePage } from "@/components/GamePage";
export const revalidate = 60;
export default function LoLPage() {
  return <GamePage game="lol" />;
}
