
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';
import { useLanguage } from '@/context/LanguageContext';
import { MessageCircle } from 'lucide-react';
import { ChatWindow } from '@/components/chat/ChatWindow';

const ChatPage = () => {
  const { currentUser } = useAuth();
  const { teachers, students } = useContent();
  const { t } = useLanguage();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  // Determine available chat contacts based on user role
  const contacts = currentUser?.role === 'teacher' ? students : teachers;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">{t('chats')}</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Contacts List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>{t('contacts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {contacts?.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedChat(contact.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                      selectedChat === contact.id
                        ? 'bg-brand-blue text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{contact.username}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="md:col-span-2">
            <CardContent className="p-0">
              {selectedChat ? (
                <ChatWindow
                  receiverId={selectedChat}
                  receiverName={contacts?.find(c => c.id === selectedChat)?.username || ''}
                  onClose={() => setSelectedChat(null)}
                />
              ) : (
                <div className="h-[500px] flex items-center justify-center text-gray-500">
                  {t('selectContactToChat')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
