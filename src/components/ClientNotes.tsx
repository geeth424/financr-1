
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Note {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface ClientNotesProps {
  clientId: string;
}

const ClientNotes = ({ clientId }: ClientNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchNotes();
  }, [clientId]);

  const fetchNotes = async () => {
    try {
      // Since we don't have a notes table yet, we'll simulate this
      // In a real app, you would have a client_notes table
      setNotes([]);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return;

    try {
      // Simulate saving note - in real app would save to database
      const newNote: Note = {
        id: Date.now().toString(),
        content: noteContent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingNote) {
        setNotes(notes.map(note => 
          note.id === editingNote.id 
            ? { ...newNote, id: editingNote.id, created_at: editingNote.created_at }
            : note
        ));
        toast({
          title: "Success",
          description: "Note updated successfully",
        });
      } else {
        setNotes([newNote, ...notes]);
        toast({
          title: "Success",
          description: "Note added successfully",
        });
      }

      setNoteContent('');
      setEditingNote(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: "Failed to save note",
        variant: "destructive",
      });
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteContent(note.content);
    setIsDialogOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Notes & Comments
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => {
                setEditingNote(null);
                setNoteContent('');
              }}>
                <Plus className="h-4 w-4 mr-1" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingNote ? 'Edit Note' : 'Add Note'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Add your note here..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={5}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveNote}>
                    {editingNote ? 'Update' : 'Save'} Note
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="border rounded p-3">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-muted-foreground">
                  {format(new Date(note.created_at), 'MMM dd, yyyy at h:mm a')}
                  {note.updated_at !== note.created_at && ' (edited)'}
                </p>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditNote(note)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className="text-sm">{note.content}</p>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No notes yet. Add your first note to track important information about this client.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientNotes;
