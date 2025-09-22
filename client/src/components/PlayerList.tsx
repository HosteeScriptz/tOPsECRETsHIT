import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Zap, Users } from "lucide-react";
import type { Player } from "@shared/schema";

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
  currentTurnPlayerId?: string;
}

export default function PlayerList({ players, currentPlayerId, currentTurnPlayerId }: PlayerListProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...players.map(p => p.score));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Players ({players.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              player.id === currentTurnPlayerId 
                ? "bg-primary/10 border-2 border-primary" 
                : "bg-muted/50"
            } ${
              player.id === currentPlayerId ? "ring-2 ring-accent" : ""
            }`}
            data-testid={`player-card-${player.id}`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="font-semibold">
                    {player.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {player.isHost && (
                  <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                )}
                {player.id === currentTurnPlayerId && (
                  <Zap className="absolute -bottom-1 -right-1 w-4 h-4 text-primary" />
                )}
              </div>
              
              <div>
                <p className="font-medium">{player.name}</p>
                <div className="flex items-center gap-2">
                  {index === 0 && maxScore > 0 && (
                    <Badge variant="default" className="text-xs">Leader</Badge>
                  )}
                  {player.isHost && (
                    <Badge variant="secondary" className="text-xs">Host</Badge>
                  )}
                  {player.id === currentTurnPlayerId && (
                    <Badge variant="outline" className="text-xs">Current Turn</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1">
                <span className={`text-lg font-bold ${
                  player.score > 0 ? "text-green-600" : 
                  player.score < 0 ? "text-red-600" : 
                  "text-muted-foreground"
                }`}>
                  {player.score > 0 ? "+" : ""}{player.score}
                </span>
                <span className="text-xs text-muted-foreground">pts</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Rank #{index + 1}
              </div>
            </div>
          </div>
        ))}
        
        {players.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            No players yet. Share the room code to invite friends!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

