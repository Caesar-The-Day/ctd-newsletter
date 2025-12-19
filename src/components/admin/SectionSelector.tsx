import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface Section {
  id: string;
  label: string;
  description: string;
  default: boolean;
}

interface SectionSelectorProps {
  sections: Section[];
  enabledSections: string[];
  onChange: (sections: string[]) => void;
  aiSuggestions?: string[];
}

export function SectionSelector({ 
  sections, 
  enabledSections, 
  onChange, 
  aiSuggestions 
}: SectionSelectorProps) {
  const toggleSection = (sectionId: string) => {
    if (enabledSections.includes(sectionId)) {
      onChange(enabledSections.filter(id => id !== sectionId));
    } else {
      onChange([...enabledSections, sectionId]);
    }
  };

  const selectAll = () => {
    onChange(sections.map(s => s.id));
  };

  const selectNone = () => {
    onChange([]);
  };

  const applyAiSuggestions = () => {
    if (aiSuggestions) {
      onChange(aiSuggestions);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick actions */}
      <div className="flex gap-2 flex-wrap">
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
          onClick={selectAll}
        >
          Select All
        </Badge>
        <Badge 
          variant="outline" 
          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
          onClick={selectNone}
        >
          Select None
        </Badge>
        {aiSuggestions && aiSuggestions.length > 0 && (
          <Badge 
            variant="secondary" 
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground gap-1"
            onClick={applyAiSuggestions}
          >
            <Sparkles className="h-3 w-3" />
            Apply AI Suggestions
          </Badge>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {enabledSections.length} of {sections.length} sections enabled
      </div>

      {/* Section toggles */}
      <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2">
        {sections.map((section) => {
          const isEnabled = enabledSections.includes(section.id);
          const isAiSuggested = aiSuggestions?.includes(section.id);

          return (
            <div
              key={section.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isEnabled ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <Switch
                  id={section.id}
                  checked={isEnabled}
                  onCheckedChange={() => toggleSection(section.id)}
                />
                <div>
                  <Label 
                    htmlFor={section.id} 
                    className="font-medium cursor-pointer flex items-center gap-2"
                  >
                    {section.label}
                    {isAiSuggested && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Sparkles className="h-2 w-2" />
                        AI
                      </Badge>
                    )}
                  </Label>
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
