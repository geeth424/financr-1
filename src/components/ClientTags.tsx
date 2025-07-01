
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface ClientTagsProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const ClientTags = ({ tags, onTagsChange }: ClientTagsProps) => {
  const [newTag, setNewTag] = useState('');

  const predefinedTags = [
    'Active', 'Recurring', 'High Value', 'New Client', 'VIP',
    'Slow Payer', 'Corporate', 'Individual', 'Seasonal', 'Priority'
  ];

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(newTag);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={() => handleRemoveTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add custom tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          onClick={() => handleAddTag(newTag)}
          disabled={!newTag || tags.includes(newTag)}
          size="sm"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Quick add:</p>
        <div className="flex flex-wrap gap-2">
          {predefinedTags
            .filter(tag => !tags.includes(tag))
            .map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                onClick={() => handleAddTag(tag)}
                className="text-xs"
              >
                {tag}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ClientTags;
