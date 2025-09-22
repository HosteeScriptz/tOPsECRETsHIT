import ScoreBoard from "../ScoreBoard";
import { Player } from "../PlayerList";

export default function ScoreBoardExample() {
  // todo: remove mock functionality
  const mockPlayers: Player[] = [
    {
      id: "1",
      name: "Alice",
      score: 7,
      isCurrentTurn: false,
      isHost: true
    },
    {
      id: "2",
      name: "Bob", 
      score: 5,
      isCurrentTurn: true,
      isHost: false
    },
    {
      id: "3",
      name: "Charlie",
      score: 2,
      isCurrentTurn: false,
      isHost: false
    },
    {
      id: "4",
      name: "Diana",
      score: -1,
      isCurrentTurn: false,
      isHost: false
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <ScoreBoard 
          players={mockPlayers}
          roomCode="ABC123"
          gameMode="Friends"
          gameDifficulty="Medium"
        />
      </div>
    </div>
  );
}