import { useState, useEffect } from 'react';
import { Search, GraduationCap, DollarSign, Calendar, ExternalLink, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { api, Scholarship } from '@/services/api';

export function ScholarshipsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'Scholarship' | 'Internship'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    setIsLoading(true);
    try {
      const data = await api.getScholarships();
      setScholarships(data);
    } catch (error) {
      console.error("Failed to load scholarships", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    try {
        const results = await api.scanScholarships({ major: user?.major || "General" }); 
        setScholarships(results);
    } catch(e) {
        console.error(e);
    } finally {
        setIsScanning(false);
    }
  }

  // Helper to parse strings safely
  const getTags = (tags: string | string[]) => {
      if (Array.isArray(tags)) return tags;
      return tags.split(',').filter(t => t.trim());
  }

  const filteredScholarships = scholarships.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.tags.includes(filterType) || item.title.includes(filterType);
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scholarships</h1>
          <p className="text-muted-foreground mt-2">
            AI-curated opportunities matched to your profile.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-muted rounded-md p-1 mr-2">
            <Button 
                variant={filterType === 'all' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setFilterType('all')}
            >
                All
            </Button>
            <Button 
                variant={filterType === 'Scholarship' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setFilterType('Scholarship')}
            >
                Scholarships
            </Button>
            <Button 
                variant={filterType === 'Internship' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setFilterType('Internship')}
            >
                Internships
            </Button>
          </div>
          <Button onClick={handleScan} disabled={isScanning}>
            {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            {isScanning ? 'Scanning...' : 'Scan for New'}
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search scholarships..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin opacity-50" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((item) => (
            <Card key={item.id} className="flex flex-col hover:border-black transition-all">
                <CardHeader>
                <div className="flex justify-between items-start">
                    <Badge variant={item.match_score > 90 ? "default" : "secondary"}>
                    {item.match_score}% Match
                    </Badge>
                    <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="mt-4">{item.title}</CardTitle>
                <CardDescription>{item.provider}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                <div className="flex items-center text-sm font-medium">
                    <span className="text-2xl font-bold">{item.amount}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    Deadline: {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'Rolling'}
                </div>
                <div className="flex flex-wrap gap-2">
                    {getTags(item.tags).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                    </Badge>
                    ))}
                </div>
                </CardContent>
                <CardFooter>
                <Button className="w-full group" asChild>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                        Apply Now
                        <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                </Button>
                </CardFooter>
            </Card>
            ))}
        </div>
      )}
    </div>
  );
}
