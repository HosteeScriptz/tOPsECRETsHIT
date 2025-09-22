import PlayerList, { Player } from "../PlayerList";

export default function PlayerListExample() {
  // todo: remove mock functionality
  const mockPlayers: Player[] = [
    {
      id: "1",
      name: "Alice",
      score: 5,
      isCurrentTurn: true,
      isHost: true
    },
    {
      id: "2", 
      name: "Bob",
      score: 3,
      isCurrentTurn: false,
      isHost: false
    },
    {
      id: "3",
      name: "Charlie", 
      score: -1,
      isCurrentTurn: false,
      isHost: false
    },
    {
      id: "4",
      name: "Diana",
      score: 2,
      isCurrentTurn: false,
      isHost: false
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <PlayerList players={mockPlayers} currentPlayerId="1" />
      </div>
    </div>
  );
}