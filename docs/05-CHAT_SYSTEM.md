# MaloPazarche - Real-time Chat System

## Chat System Architecture

The chat system uses **ASP.NET SignalR** for real-time bidirectional communication between buyers and sellers, with message persistence in PostgreSQL.

---

## Technology Stack

- **Real-time Framework**: ASP.NET SignalR
- **Transport Protocol**: WebSocket (fallback to ServerSentEvents)
- **Persistence**: PostgreSQL
- **Client Library**: @microsoft/signalr (JavaScript/TypeScript)
- **Message Queue** (optional): RabbitMQ or Azure Service Bus for scaling

---

## Architecture Diagram

```
┌──────────────────────┐
│   User A (Buyer)     │
│  WebSocket Client    │
└──────────┬───────────┘
           │ WebSocket
           ↓
┌──────────────────────────────────┐
│    SignalR Chat Hub              │
│  - Message routing               │
│  - Connection management         │
│  - Group management              │
│  - Typing notifications          │
└──────────┬───────────────────────┘
           │
    ┌──────┴──────┐
    ↓             ↓
┌─────────┐  ┌──────────────────┐
│ Memory  │  │  PostgreSQL       │
│ Cache   │  │  Messages Storage │
│         │  │  Conversations    │
└─────────┘  └──────────────────┘
    ↑             ↑
    │             │
    └──────┬──────┘
           ↑
           │
           ↓
   ┌──────────────────┐
   │  User B (Seller) │
   │ WebSocket Client │
   └──────────────────┘
```

---

## SignalR Chat Hub Implementation

### Hub Class

```csharp
[Authorize]
public class ChatHub : Hub
{
    private readonly IMessageService _messageService;
    private readonly INotificationService _notificationService;
    private readonly ICacheService _cacheService;
    private readonly ILogger<ChatHub> _logger;
    
    public ChatHub(
        IMessageService messageService,
        INotificationService notificationService,
        ICacheService cacheService,
        ILogger<ChatHub> logger)
    {
        _messageService = messageService;
        _notificationService = notificationService;
        _cacheService = cacheService;
        _logger = logger;
    }
    
    /// <summary>
    /// Called when user initially connects to the hub
    /// </summary>
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userName = Context.User?.FindFirst("username")?.Value;
        
        _logger.LogInformation(
            $"User {userId} ({userName}) connected. Connection ID: {Context.ConnectionId}");
        
        // Add user to their personal group
        await Groups.AddToGroupAsync(
            Context.ConnectionId, 
            $"user-{userId}");
        
        // Track user as online in cache
        await _cacheService.SetAsync(
            $"user-online-{userId}", 
            Context.ConnectionId, 
            TimeSpan.FromHours(24));
        
        // Notify followers that user is online
        await NotifyUserOnlineStatus(userId, true);
        
        await base.OnConnectedAsync();
    }
    
    /// <summary>
    /// Called when user disconnects
    /// </summary>
    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        _logger.LogInformation($"User {userId} disconnected");
        
        // Remove user from online cache
        await _cacheService.DeleteAsync($"user-online-{userId}");
        
        // Notify followers that user is offline
        await NotifyUserOnlineStatus(userId, false);
        
        await base.OnDisconnectedAsync(exception);
    }
    
    /// <summary>
    /// User joins a specific conversation
    /// Called when opening a chat window
    /// </summary>
    public async Task JoinConversation(Guid conversationId)
    {
        var userId = Guid.Parse(
            Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        
        // Verify user has access to this conversation
        var conversation = await _messageService
            .GetConversationAsync(conversationId);
        
        if (conversation.BuyerId != userId && conversation.SellerId != userId)
        {
            throw new HubException("Unauthorized");
        }
        
        // Add connection to conversation group
        await Groups.AddToGroupAsync(
            Context.ConnectionId, 
            $"conversation-{conversationId}");
        
        // Mark messages as read
        await _messageService.MarkMessagesAsReadAsync(conversationId, userId);
        
        // Notify other party that user is viewing conversation
        await Clients.OtherClientsInGroup($"conversation-{conversationId}")
            .SendAsync("UserViewingConversation", userId);
        
        _logger.LogInformation(
            $"User {userId} joined conversation {conversationId}");
    }
    
    /// <summary>
    /// User leaves a conversation
    /// </summary>
    public async Task LeaveConversation(Guid conversationId)
    {
        var userId = Guid.Parse(
            Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        
        await Groups.RemoveFromGroupAsync(
            Context.ConnectionId, 
            $"conversation-{conversationId}");
        
        // Notify other party that user is no longer viewing
        await Clients.OtherClientsInGroup($"conversation-{conversationId}")
            .SendAsync("UserLeftConversation", userId);
    }
    
    /// <summary>
    /// Send a message in a conversation
    /// </summary>
    public async Task SendMessage(Guid conversationId, string content)
    {
        var userId = Guid.Parse(
            Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var userName = Context.User.FindFirst("username")?.Value;
        
        if (string.IsNullOrWhiteSpace(content))
        {
            throw new HubException("Message cannot be empty");
        }
        
        if (content.Length > 2000)
        {
            throw new HubException("Message is too long");
        }
        
        try
        {
            // Save message to database
            var message = await _messageService.SendMessageAsync(
                userId, conversationId, content);
            
            // Broadcast to all users in conversation
            var messageDto = new MessageDTO
            {
                Id = message.Id,
                ConversationId = conversationId,
                SenderId = userId,
                SenderName = userName,
                Content = content,
                CreatedAt = message.CreatedAt,
                IsRead = false
            };
            
            await Clients.Group($"conversation-{conversationId}")
                .SendAsync("ReceiveMessage", messageDto);
            
            // Send notification to other party (if not currently viewing)
            var conversation = await _messageService
                .GetConversationAsync(conversationId);
            var otherUserId = conversation.BuyerId == userId 
                ? conversation.SellerId 
                : conversation.BuyerId;
            
            await _notificationService.CreateNotificationAsync(
                otherUserId,
                NotificationType.Message,
                userId,
                conversationId);
            
            // Notify the other user of new message
            await Clients.Group($"user-{otherUserId}")
                .SendAsync("NewMessageNotification", new
                {
                    conversationId,
                    senderName = userName,
                    previewText = content.Length > 50 
                        ? content.Substring(0, 50) + "..." 
                        : content
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message");
            throw new HubException("Failed to send message");
        }
    }
    
    /// <summary>
    /// User is typing - show typing indicator to other participants
    /// </summary>
    public async Task NotifyTyping(Guid conversationId)
    {
        var userId = Guid.Parse(
            Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        
        // Broadcast typing indicator to conversation (except sender)
        await Clients.OtherClientsInGroup($"conversation-{conversationId}")
            .SendAsync("UserTyping", userId);
    }
    
    /// <summary>
    /// User stopped typing
    /// </summary>
    public async Task StopTyping(Guid conversationId)
    {
        var userId = Guid.Parse(
            Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        
        await Clients.OtherClientsInGroup($"conversation-{conversationId}")
            .SendAsync("UserStoppedTyping", userId);
    }
    
    /// <summary>
    /// Mark message as read
    /// </summary>
    public async Task MarkMessageAsRead(Guid messageId)
    {
        var userId = Guid.Parse(
            Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        
        await _messageService.MarkMessageAsReadAsync(messageId, userId);
    }
    
    // Helper methods
    
    private async Task NotifyUserOnlineStatus(string userId, bool isOnline)
    {
        // Broadcast to user's followers
        var followers = await _cacheService
            .GetAsync<List<Guid>>($"followers-{userId}");
        
        if (followers != null)
        {
            foreach (var followerId in followers)
            {
                await Clients.Group($"user-{followerId}")
                    .SendAsync("UserOnlineStatusChanged", new
                    {
                        userId,
                        isOnline,
                        timestamp = DateTime.UtcNow
                    });
            }
        }
    }
}
```

---

## Frontend Implementation (React/TypeScript)

### Chat Hook

```typescript
// hooks/useChat.ts
import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export const useChat = (conversationId: string, authToken: string) => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize SignalR connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_WS_URL + '/hubs/chat', {
        accessTokenFactory: () => authToken,
      })
      .withAutomaticReconnect([0, 1000, 5000, 30000])
      .withHubMethodInvocation()
      .build();

    // Define listeners before starting connection
    connection.on('ReceiveMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    connection.on('UserTyping', (userId: string) => {
      setTypingUsers((prev) => new Set([...prev, userId]));
    });

    connection.on('UserStoppedTyping', (userId: string) => {
      setTypingUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    connection.on('MessageRead', (messageId: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    });

    connection.onreconnecting(() => {
      console.log('Reconnecting...');
      setIsConnected(false);
    });

    connection.onreconnected(() => {
      console.log('Reconnected');
      setIsConnected(true);
    });

    // Start connection
    connection
      .start()
      .then(() => {
        setIsConnected(true);
        // Join conversation
        connection.invoke('JoinConversation', conversationId);
        // Load message history
        loadMessages();
      })
      .catch((err) =>
        console.error('Connection failed:', err)
      );

    connectionRef.current = connection;

    return () => {
      if (connection) {
        connection.invoke('LeaveConversation', conversationId);
        connection.stop();
      }
    };
  }, [conversationId, authToken]);

  const sendMessage = async (content: string) => {
    if (!connectionRef.current) return;

    try {
      await connectionRef.current.invoke(
        'SendMessage',
        conversationId,
        content
      );
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const notifyTyping = () => {
    if (!connectionRef.current) return;
    connectionRef.current.invoke('NotifyTyping', conversationId);
  };

  const markMessageAsRead = (messageId: string) => {
    if (!connectionRef.current) return;
    connectionRef.current.invoke('MarkMessageAsRead', messageId);
  };

  const loadMessages = async () => {
    // Fetch message history from REST API
    const response = await fetch(
      `/api/messages/conversations/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const data = await response.json();
    setMessages(data);
  };

  return {
    messages,
    isConnected,
    typingUsers,
    sendMessage,
    notifyTyping,
    markMessageAsRead,
  };
};
```

### Chat Component

```typescript
// components/messaging/ChatWindow.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuthStore } from '@/store/authStore';

interface ChatWindowProps {
  conversationId: string;
  otherUserName: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  otherUserName,
}) => {
  const token = useAuthStore((state) => state.token);
  const { messages, isConnected, typingUsers, sendMessage, notifyTyping } =
    useChat(conversationId, token);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // Debounce typing notification
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    notifyTyping();

    typingTimeoutRef.current = setTimeout(() => {
      // Stop typing notification
    }, 3000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    await sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">{otherUserName}</h2>
          <p className="text-sm text-gray-500">
            {isConnected ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === useAuthStore((state) => state.user?.id)
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.senderId === useAuthStore((state) => state.user?.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-xs opacity-70">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typingUsers.size > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="text-sm text-gray-500">{otherUserName} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={handleInputChange}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!isConnected || !inputValue.trim()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};
```

---

## Message Service (Backend)

```csharp
public interface IMessageService
{
    Task<MessageDTO> SendMessageAsync(Guid senderId, Guid conversationId, string content);
    Task<ConversationDTO> GetConversationAsync(Guid conversationId);
    Task<List<MessageDTO>> GetMessagesAsync(Guid conversationId);
    Task MarkMessagesAsReadAsync(Guid conversationId, Guid userId);
    Task MarkMessageAsReadAsync(Guid messageId, Guid userId);
}

public class MessageService : IMessageService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICacheService _cacheService;
    
    public async Task<MessageDTO> SendMessageAsync(
        Guid senderId, Guid conversationId, string content)
    {
        var conversation = await _unitOfWork.Conversations
            .GetByIdAsync(conversationId);
        
        if (conversation == null)
            throw new NotFoundException("Conversation not found");
        
        if (conversation.BuyerId != senderId && conversation.SellerId != senderId)
            throw new UnauthorizedException("Not part of this conversation");
        
        var message = new Message
        {
            Id = Guid.NewGuid(),
            ConversationId = conversationId,
            SenderId = senderId,
            Content = content,
            CreatedAt = DateTime.UtcNow,
            IsRead = false
        };
        
        await _unitOfWork.Messages.AddAsync(message);
        
        // Update conversation's last message timestamp
        conversation.LastMessageAt = DateTime.UtcNow;
        await _unitOfWork.Conversations.UpdateAsync(conversation);
        
        await _unitOfWork.SaveChangesAsync();
        
        // Invalidate conversation list cache for both users
        await _cacheService.InvalidateAsync($"conversations-{conversation.BuyerId}");
        await _cacheService.InvalidateAsync($"conversations-{conversation.SellerId}");
        
        return _mapper.Map<MessageDTO>(message);
    }
}
```

---

## Scaling Considerations

### For High Message Volume:

1. **Message Queue**
   - Use RabbitMQ or Azure Service Bus
   - Decouple message sending from persistence
   - Handle rate limiting

2. **Distributed SignalR**
   - Scale to multiple servers using Redis backplane
   - Sticky sessions for WebSocket connections

3. **Message Archiving**
   - Move old messages to cold storage
   - Keep only recent messages in hot storage

4. **Sharding**
   - Shard conversations by conversation ID
   - Different database servers for different ranges

---

## Error Handling

SignalR automatically handles reconnection, but ensure proper error handling:

```csharp
// In the Hub
try
{
    // Hub method logic
}
catch (Exception ex)
{
    _logger.LogError(ex, "Hub error");
    throw new HubException("An error occurred");
}
```

---

## Security Considerations

1. **Authentication**
   - All SignalR connections must be authenticated
   - Use JWT tokens passed in connection URL

2. **Authorization**
   - Verify user permission to access conversation
   - Validate in JoinConversation and SendMessage methods

3. **Input Validation**
   - Validate message content length
   - Sanitize content before storing

4. **Rate Limiting**
   - Limit messages per user per minute
   - Prevent spam

---

## Testing Real-time Chat

```csharp
// Integration test
[Fact]
public async Task SendMessage_BroadcastsToConversationGroup()
{
    // Arrange
    var connection = new HubConnectionBuilder()
        .WithUrl(TestClient.GetHttpServer().BaseAddress + "/hubs/chat")
        .Build();

    await connection.StartAsync();
    
    var messageReceived = false;
    connection.On<MessageDTO>("ReceiveMessage", msg =>
    {
        messageReceived = true;
    });

    // Act
    await connection.InvokeAsync("JoinConversation", conversationId);
    await connection.InvokeAsync("SendMessage", conversationId, "Test message");

    // Assert
    await Task.Delay(1000); // Wait for broadcast
    Assert.True(messageReceived);
}
```
