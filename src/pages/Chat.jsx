import { CommunityChat } from '../components/CommunityChat';
import { MessageCircle } from 'lucide-react';

const Chat = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <MessageCircle className="w-7 h-7 text-blue-600" />
          Team Chat
        </h1>
        <p className="text-gray-600 mt-1">
          Collaborate with your team in real-time
        </p>
      </div>

      <CommunityChat />
    </div>
  );
};

export default Chat;
