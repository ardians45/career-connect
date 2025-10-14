import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, GraduationCap, Briefcase, Star, DollarSign, Clock, TrendingUp } from 'lucide-react';

interface RecommendationCardProps {
  id: string;
  type: 'major' | 'career';
  title: string;
  description: string;
  riasecType: string;
  matchPercentage: number;
  isSaved?: boolean;
  onSaveToggle: (id: string, type: 'major' | 'career') => void;
  onViewDetail: (id: string, type: 'major' | 'career') => void;
  additionalInfo: {
    institution?: string; // For majors
    industry?: string;    // For careers
    studyDuration?: number; // For majors
    averageTuition?: number; // For majors
    salaryRange?: { min: number; max: number }; // For careers
    jobGrowthRate?: number; // For careers
  };
}

const RecommendationCard = ({ 
  id, 
  type, 
  title, 
  description, 
  riasecType, 
  matchPercentage, 
  isSaved = false, 
  onSaveToggle, 
  onViewDetail,
  additionalInfo
}: RecommendationCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="mb-2">
            {riasecType}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSaveToggle(id, type)}
            className="p-2"
          >
            <Heart 
              className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
            />
          </Button>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        {type === 'major' && additionalInfo.institution && (
          <CardDescription>{additionalInfo.institution}</CardDescription>
        )}
        {type === 'career' && additionalInfo.industry && (
          <CardDescription>{additionalInfo.industry}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-3 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {type === 'major' && additionalInfo.studyDuration && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {additionalInfo.studyDuration} Tahun
            </div>
          )}
          {type === 'major' && additionalInfo.averageTuition && (
            <div className="flex items-center text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3 mr-1" />
              {additionalInfo.averageTuition.toLocaleString('id-ID')}
            </div>
          )}
          {type === 'career' && additionalInfo.salaryRange && (
            <div className="flex items-center text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3 mr-1" />
              {additionalInfo.salaryRange.min.toLocaleString('id-ID')} - {additionalInfo.salaryRange.max.toLocaleString('id-ID')}
            </div>
          )}
          {type === 'career' && additionalInfo.jobGrowthRate !== undefined && (
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              {additionalInfo.jobGrowthRate}% growth
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center text-sm">
          <Star className="h-4 w-4 text-yellow-500 mr-1" />
          <span>{matchPercentage}% cocok</span>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onViewDetail(id, type)}
        >
          Detail
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecommendationCard;