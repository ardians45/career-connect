import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface RiasecTypeCardProps {
  type: string;
  name: string;
  description: string;
  score?: number;
  isDominant?: boolean;
}

const RIASECTypeCard = ({ type, name, description, score, isDominant = false }: RiasecTypeCardProps) => {
  return (
    <Card className={isDominant ? "border-2 border-primary" : ""}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge className={isDominant ? "text-lg font-bold" : "text-base font-semibold"} variant={isDominant ? "default" : "secondary"}>
            {type}
          </Badge>
          {score !== undefined && (
            <span className="font-bold">{score}</span>
          )}
        </div>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default RIASECTypeCard;