import { GamePage } from "@/components/GamePage";
export const revalidate = 60;
export default function ValorantPage() {
  return <GamePage game="valorant" />;
}
