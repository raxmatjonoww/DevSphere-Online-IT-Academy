
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ChatWindow } from './ChatWindow';

interface ChatButtonProps {
  receiverName: string;
  receiverId: string;
}

export function ChatButton({ receiverName, receiverId }: ChatButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsChatOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        Chat
      </Button>
      
      {isChatOpen && (
        <ChatWindow
          receiverName={receiverName}
          receiverId={receiverId}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  );
}
