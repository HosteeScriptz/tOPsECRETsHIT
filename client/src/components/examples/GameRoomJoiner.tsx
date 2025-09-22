import GameRoomJoiner from "../GameRoomJoiner";

export default function GameRoomJoinerExample() {
  const handleJoinRoom = (playerName: string, roomCode: string) => {
    console.log("Joining room:", { playerName, roomCode });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <GameRoomJoiner onJoinRoom={handleJoinRoom} />
    </div>
  );
}