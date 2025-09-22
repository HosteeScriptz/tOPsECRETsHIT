import GamePage from "../../pages/GamePage";
import { Player } from "../PlayerList";

export default function GamePageExample() {
  // todo: remove mock functionality
  const currentPlayer: Player = {
    id: "1",
    name: "Alice",
    score: 3,
    isCurrentTurn: true,
    isHost: true
  };

  return (
    <GamePage
      roomCode="ABC123"
      gameMode="friends"
      gameDifficulty="medium"
      currentPlayer={currentPlayer}
    />
  );
}