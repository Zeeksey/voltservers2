import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MessageSquare, User, Calendar, Clock, AlertCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface TicketReply {
  id: string;
  date: string;
  name: string;
  message: string;
  admin: string;
  type: string;
}

interface TicketDetails {
  result: string;
  id: string;
  tid: string;
  subject: string;
  status: string;
  priority: string;
  deptname: string;
  name: string;
  email: string;
  date: string;
  lastreply: string;
  replies: {
    reply: TicketReply[];
  };
}

export default function TicketDetails() {
  const { ticketId } = useParams();
  const [, setLocation] = useLocation();
  const [replyMessage, setReplyMessage] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user email from localStorage (from WHMCS login)
  const getClientData = () => {
    const savedClient = localStorage.getItem('whmcs_client_data');
    if (savedClient) {
      try {
        return JSON.parse(savedClient);
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const clientData = getClientData();
  const userEmail = clientData?.email || '';

  const { data: ticketDetails, isLoading, error } = useQuery({
    queryKey: ['/api/whmcs/support/ticket', ticketId],
    enabled: !!ticketId && !!userEmail,
    refetchInterval: 30000, // Refresh every 30 seconds for new replies
  });

  const replyMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest(`/api/whmcs/support/ticket/${ticketId}/reply`, {
        method: 'POST',
        body: { message, email: userEmail }
      });
    },
    onSuccess: (data) => {
      console.log('Reply success:', data);
      toast({
        title: "Reply Sent",
        description: "Your reply has been added to the ticket.",
      });
      setReplyMessage('');
      // Refresh ticket details
      queryClient.invalidateQueries({ queryKey: ['/api/whmcs/support/ticket', ticketId] });
    },
    onError: (error) => {
      console.error('Reply error:', error);
      toast({
        title: "Error",
        description: `Failed to send reply: ${error.message || 'Please try again.'}`,
        variant: "destructive"
      });
    }
  });

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
      return;
    }
    
    if (!userEmail) {
      toast({
        title: "Authentication Error",
        description: "User email not found. Please log in again.",
        variant: "destructive"
      });
      return;
    }

    console.log('Sending reply with email:', userEmail);
    replyMutation.mutate(replyMessage);
  };

  // Check if user is authenticated by looking for WHMCS client data
  const isAuthenticated = !!clientData && !!userEmail;
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gaming-black text-gaming-white">
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-gaming-dark border-gaming-green/20">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gaming-white mb-4">Authentication Required</h1>
              <p className="text-gaming-gray mb-6">Please log in through the client portal to view ticket details.</p>
              <Button 
                onClick={() => setLocation('/client-portal')}
                className="bg-gaming-green hover:bg-gaming-green/80"
              >
                Go to Client Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gaming-black text-gaming-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-gaming-gray">
            <div className="w-6 h-6 border-2 border-gaming-green/20 border-t-gaming-green rounded-full animate-spin" />
            Loading ticket details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticketDetails) {
    return (
      <div className="min-h-screen bg-gaming-black text-gaming-white">
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-gaming-dark border-red-500/20">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-red-400 mb-4">Ticket Not Found</h1>
              <p className="text-gaming-gray mb-6">The requested ticket could not be found or you don't have permission to view it.</p>
              <Button 
                onClick={() => setLocation('/client-portal')}
                className="bg-gaming-green hover:bg-gaming-green/80"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Client Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const ticket = ticketDetails;
  const replies = ticket.replies?.reply ? (Array.isArray(ticket.replies.reply) ? ticket.replies.reply : [ticket.replies.reply]) : [];

  return (
    <div className="min-h-screen bg-gaming-black text-gaming-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/client-portal')}
            className="border-gaming-green/20 text-gaming-white hover:bg-gaming-green/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portal
          </Button>
          <h1 className="text-3xl font-bold text-gaming-white">Ticket Details</h1>
        </div>

        {/* Ticket Information */}
        <Card className="bg-gaming-dark border-gaming-green/20 mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-gaming-white text-xl">
                #{ticket.tid}: {ticket.subject}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge className={`${
                  ticket.status === 'Open' ? 'bg-gaming-green/20 text-gaming-green' :
                  ticket.status === 'Answered' ? 'bg-blue-500/20 text-blue-400' :
                  ticket.status === 'Customer-Reply' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gaming-gray/20 text-gaming-gray'
                }`}>
                  {ticket.status}
                </Badge>
                <Badge variant="outline" className="border-gaming-green/20 text-gaming-white">
                  {ticket.priority} Priority
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gaming-gray">
                <User className="w-4 h-4" />
                <span>Created by: {ticket.name}</span>
              </div>
              <div className="flex items-center gap-2 text-gaming-gray">
                <Calendar className="w-4 h-4" />
                <span>Created: {new Date(ticket.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gaming-gray">
                <Clock className="w-4 h-4" />
                <span>Last Reply: {new Date(ticket.lastreply).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-4 text-gaming-gray">
              <span className="font-medium">Department:</span> {ticket.deptname}
            </div>
          </CardContent>
        </Card>

        {/* Ticket Replies */}
        <Card className="bg-gaming-dark border-gaming-green/20 mb-6">
          <CardHeader>
            <CardTitle className="text-gaming-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {replies.length > 0 ? replies.map((reply, index) => (
                <div key={reply.id || index} className="relative">
                  <div className={`rounded-lg p-4 ${
                    reply.admin ? 
                    'bg-blue-500/10 border border-blue-500/20' : 
                    'bg-gaming-green/10 border border-gaming-green/20'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${
                          reply.admin ? 'text-blue-400' : 'text-gaming-green'
                        }`}>
                          {reply.name || (reply.admin ? 'Support Staff' : 'Customer')}
                        </span>
                        {reply.admin && (
                          <Badge variant="outline" className="border-blue-500/20 text-blue-400 text-xs">
                            Staff
                          </Badge>
                        )}
                      </div>
                      <span className="text-gaming-gray text-sm">
                        {new Date(reply.date).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-gaming-white whitespace-pre-wrap">
                      {reply.message}
                    </div>
                  </div>
                  {index < replies.length - 1 && (
                    <Separator className="my-4 bg-gaming-green/20" />
                  )}
                </div>
              )) : (
                <div className="text-center text-gaming-gray py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No replies yet. Send a message to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reply Form */}
        {ticket.status !== 'Closed' && (
          <Card className="bg-gaming-dark border-gaming-green/20">
            <CardHeader>
              <CardTitle className="text-gaming-white flex items-center gap-2">
                <Send className="w-5 h-5" />
                Add Reply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your message here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="bg-gaming-black-lighter border-gaming-green/20 text-gaming-white placeholder:text-gaming-gray focus:border-gaming-green/40 min-h-[120px]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSendReply}
                    disabled={replyMutation.isPending || !replyMessage.trim()}
                    className="bg-gaming-green hover:bg-gaming-green/80 disabled:opacity-50"
                  >
                    {replyMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {ticket.status === 'Closed' && (
          <Card className="bg-gaming-dark border-gaming-gray/20">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-gaming-gray mx-auto mb-4" />
              <h3 className="text-gaming-white font-medium mb-2">Ticket Closed</h3>
              <p className="text-gaming-gray">This ticket has been closed and no longer accepts replies.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}