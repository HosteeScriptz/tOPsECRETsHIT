import GameRoomCreator from "../GameRoomCreator";

export default function GameRoomCreatorExample() {
  const handleCreateRoom = (playerName: string, roomCode: string) => {
    console.log("Room created:", { playerName, roomCode });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <GameRoomCreator
        selectedMode="friends"
        selectedDifficulty="medium"
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}