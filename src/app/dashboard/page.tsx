"use client";

import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  MessageCircle,
  Send,
  Plus,
  Loader2,
  Search,
  Edit2,
  Trash2,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createClient } from "../../../supabase/client";
import {
  sendMessageAction,
  getConversationsAction,
  getMessagesAction,
  renameConversationAction,
  deleteConversationAction,
} from "../actions";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export default function Dashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameConversationId, setRenameConversationId] = useState<
    string | null
  >(null);
  const [newTitle, setNewTitle] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConversationId, setDeleteConversationId] = useState<
    string | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const initializeAuth = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/sign-in";
          return;
        }

        setUser(user);
        await loadConversations();
      } catch (error) {
        console.error("Error initializing auth:", error);
        window.location.href = "/sign-in";
      }
    };

    initializeAuth();
  }, [mounted]);

  useEffect(() => {
    if (currentConversation && mounted) {
      loadMessages(currentConversation);
    }
  }, [currentConversation, mounted]);

  useEffect(() => {
    const filtered = conversations.filter((conversation) =>
      conversation.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredConversations(filtered);
  }, [conversations, searchTerm]);

  const loadConversations = async () => {
    try {
      const result = await getConversationsAction();
      if (result.error) {
        toast({
          title: "Erro",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setConversations(result.conversations || []);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conversas",
        variant: "destructive",
      });
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const result = await getMessagesAction(conversationId);
      if (result.error) {
        toast({
          title: "Erro",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setMessages(result.messages || []);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar mensagens",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const messageToSend = newMessage;
    setNewMessage("");
    setIsLoading(true);

    // Add user message to UI immediately
    const tempUserMessage: Message = {
      id: "temp-" + Date.now(),
      content: messageToSend,
      role: "user",
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    const formData = new FormData();
    formData.append("message", messageToSend);
    if (currentConversation) {
      formData.append("conversationId", currentConversation);
    }

    const result = await sendMessageAction(formData);

    if (result.error) {
      toast({
        title: "Erro",
        description: result.error,
        variant: "destructive",
      });
      // Remove the temporary message on error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== tempUserMessage.id),
      );
    } else {
      // Set current conversation if it's a new one
      if (result.conversationId && !currentConversation) {
        setCurrentConversation(result.conversationId);
        loadConversations(); // Refresh conversations list
      }

      // Add AI response to UI
      const aiMessage: Message = {
        id: "ai-" + Date.now(),
        content: result.message || "",
        role: "assistant",
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => {
        // Remove temp message and add both real user message and AI response
        const withoutTemp = prev.filter((msg) => msg.id !== tempUserMessage.id);
        return [
          ...withoutTemp,
          { ...tempUserMessage, id: "user-" + Date.now() },
          aiMessage,
        ];
      });
    }

    setIsLoading(false);
  };

  const startNewConversation = () => {
    setCurrentConversation(null);
    setMessages([]);
  };

  const handleRenameConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameConversationId || !newTitle.trim()) return;

    const formData = new FormData();
    formData.append("conversationId", renameConversationId);
    formData.append("newTitle", newTitle.trim());

    const result = await renameConversationAction(formData);

    if (result.error) {
      toast({
        title: "Erro",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Conversa renomeada com sucesso",
      });
      loadConversations();
      setRenameDialogOpen(false);
      setRenameConversationId(null);
      setNewTitle("");
    }
  };

  const handleDeleteConversation = async () => {
    if (!deleteConversationId) return;

    const formData = new FormData();
    formData.append("conversationId", deleteConversationId);

    const result = await deleteConversationAction(formData);

    if (result.error) {
      toast({
        title: "Erro",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Conversa excluída com sucesso",
      });
      if (currentConversation === deleteConversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
      loadConversations();
      setDeleteDialogOpen(false);
      setDeleteConversationId(null);
    }
  };

  const openRenameDialog = (conversationId: string, currentTitle: string) => {
    setRenameConversationId(conversationId);
    setNewTitle(currentTitle);
    setRenameDialogOpen(true);
  };

  const openDeleteDialog = (conversationId: string) => {
    setDeleteConversationId(conversationId);
    setDeleteDialogOpen(true);
  };

  // Show loading state until component is mounted and user is loaded
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">ChatBot IA</h1>
          </div>
          <Button
            onClick={startNewConversation}
            className="w-full mb-4"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Conversa
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`group cursor-pointer transition-colors hover:bg-accent ${
                  currentConversation === conversation.id ? "bg-accent" : ""
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => setCurrentConversation(conversation.id)}
                    >
                      <p className="text-sm font-medium truncate">
                        {conversation.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {mounted
                          ? new Date(
                              conversation.created_at,
                            ).toLocaleDateString("pt-BR")
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          openRenameDialog(conversation.id, conversation.title);
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(conversation.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredConversations.length === 0 && searchTerm && mounted && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Nenhuma conversa encontrada para &quot;{searchTerm}&quot;
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            Logado como: {user?.email || ""}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <DashboardNavbar />

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Bem-vindo ao ChatBot IA
                </h2>
                <p className="text-muted-foreground mb-4">
                  Comece uma nova conversa digitando uma mensagem abaixo.
                </p>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <Card
                      className={`max-w-[70%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <CardContent className="p-3">
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p className={`text-xs mt-2 opacity-70`}>
                          {mounted
                            ? new Date(message.created_at).toLocaleTimeString(
                                "pt-BR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : ""}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <Card className="bg-muted">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">IA está digitando...</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}

          {/* Message Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 min-h-[60px] max-h-32 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || isLoading}
                  className="self-end"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear Conversa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRenameConversation} className="space-y-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Novo nome da conversa"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setRenameDialogOpen(false);
                  setRenameConversationId(null);
                  setNewTitle("");
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!newTitle.trim()}>
                Renomear
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Conversa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja excluir esta conversa? Esta ação não pode
              ser desfeita.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setDeleteConversationId(null);
                }}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteConversation}>
                Excluir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
