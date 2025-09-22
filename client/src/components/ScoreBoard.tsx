import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import type { Player } from "@shared/schema";

interface ScoreBoardProps {
  players: Player[];
  roomCode: string;
  gameMode: string;
  gameDifficulty: string;
  currentTurnPlayerId?: string;
}

export default function ScoreBoard({ players, roomCode, gameMode, gameDifficulty, currentTurnPlayerId }: ScoreBoardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const totalTurns = players.reduce((sum, player) => sum + Math.abs(player.score), 0);

  const getPodiumPosition = (index: number) => {
    if (index === 0) return { color: "text-yellow-600", icon: "🥇", label: "1st" };
    if (index === 1) return { color: "text-gray-500", icon: "🥈", label: "2nd" };
    if (index === 2) return { color: "text-amber-600", icon: "🥉", label: "3rd" };
    return { color: "text-muted-foreground", icon: "", label: `${index + 1}th` };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Scoreboard
          </CardTitle>
          <div className="text-right">
            <Badge variant="outline" className="text-xs">{roomCode}</Badge>
            <p className="text-xs text-muted-foreground mt-1">
              {gameMode} • {gameDifficulty}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Game Stats */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold">{totalTurns}</p>
            <p className="text-xs text-muted-foreground">Total Rounds</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{players.length}</p>
            <p className="text-xs text-muted-foreground">Players</p>
          </div>
        </div>

        {/* Player Rankings */}
        <div className="space-y-2">
          {sortedPlayers.map((player, index) => {
            const position = getPodiumPosition(index);
            const scoreChange = player.score;
            
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index < 3 ? "bg-accent/20" : "bg-muted/20"
                } ${player.id === currentTurnPlayerId ? "ring-2 ring-primary" : ""}`}
                data-testid={`scoreboard-player-${player.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 min-w-[60px]">
                    <span className="text-lg">{position.icon}</span>
                    <span className={`font-bold ${position.color}`}>
                      {position.label}
                    </span>
                  </div>
                  
                  <div>
                    <p className="font-medium">{player.name}</p>
                    <div className="flex items-center gap-2">
                      {player.isHost && (
                        <Badge variant="secondary" className="text-xs">Host</Badge>
                      )}
                      {player.id === currentTurnPlayerId && (
                        <Badge variant="default" className="text-xs">Playing</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {scoreChange > 0 && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {scoreChange < 0 && <TrendingDown className="w-4 h-4 text-red-500" />}
                    <span className={`text-xl font-bold ${
                      player.score > 0 ? "text-green-600" : 
                      player.score < 0 ? "text-red-600" : 
                      "text-muted-foreground"
                    }`}>
                      {player.score > 0 ? "+" : ""}{player.score}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            );
          })}
        </div>

        {players.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No scores yet!</p>
            <p className="text-xs">Start playing to see the leaderboard</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}