"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageSquare, X } from 'lucide-react';
import ChatDialog from './chat-dialog';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="rounded-full w-16 h-16 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
            aria-label="Open chat"
          >
            {open ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0 border-0" side="top" align="end" sideOffset={16}>
          <ChatDialog />
        </PopoverContent>
      </Popover>
    </div>
  );
}
