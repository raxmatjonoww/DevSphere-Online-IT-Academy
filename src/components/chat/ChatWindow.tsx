
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types';

interface ChatWindowProps {
  receiverName: string;
  receiverId: string;
  onClose: () => void;
}

export function ChatWindow({ receiverName, receiverId, onClose }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { sendMessage, messages, getMessagesByUser } = useContent();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (currentUser) {
      const userMessages = getMessagesByUser(currentUser.id)
        .filter(msg => 
          (msg.senderId === currentUser.id && msg.receiverId === receiverId) ||
          (msg.senderId === receiverId && msg.receiverId === currentUser.id)
        )
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      setChatMessages(userMessages);
    }
  }, [currentUser, receiverId, messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !currentUser) return;

    sendMessage(currentUser.id, receiverId, message.trim());
    setMessage('');
    
    toast({
      title: "Хабарлама жіберілді",
      description: `Сіздің хабарламаңыз ${receiverName} қолданушысына жіберілді`,
    });
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Чат: {receiverName}
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          ✕
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] overflow-y-auto mb-4 p-4 space-y-4 bg-muted rounded-md">
          {chatMessages.length > 0 ? (
            chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col space-y-1 ${
                  msg.senderId === currentUser?.id ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 ${
                    msg.senderId === currentUser?.id
                      ? 'bg-brand-blue text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <div className="flex flex-col space-y-1">
              <p className="text-sm text-muted-foreground">Әзірше хабарлама жоқ</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Textarea
            placeholder="Хабарлама жазыңыз..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            className="h-20"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
