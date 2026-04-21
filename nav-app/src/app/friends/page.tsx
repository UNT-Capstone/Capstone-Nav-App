'use client';

import { useState } from 'react';
import { useTRPC } from '@/src/trpc/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

type TabType = 'find' | 'friends' | 'requests';

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('find');

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const sendFriendRequestMutation = useMutation(
    trpc.sendFriendRequest.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.searchUsers.queryKey(searchQuery) });
        queryClient.invalidateQueries({ queryKey: trpc.getFriendIds.queryKey() });
        queryClient.invalidateQueries({ queryKey: trpc.getFriendRequests.queryKey() });
        queryClient.invalidateQueries({ queryKey: trpc.getSentFriendRequestIds.queryKey() });
      },
    })
  );

  const acceptFriendRequestMutation = useMutation(
    trpc.acceptFriendRequest.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.getFriends.queryKey() });
        queryClient.invalidateQueries({ queryKey: trpc.getFriendRequests.queryKey() });
        queryClient.invalidateQueries({ queryKey: trpc.getFriendIds.queryKey() });
      },
    })
  );

  const rejectFriendRequestMutation = useMutation(
    trpc.rejectFriendRequest.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.getFriendRequests.queryKey() });
      },
    })
  );

  // Search users query
  const { data: searchResults = [], isLoading: isSearching, error: searchError } = useQuery(
    trpc.searchUsers.queryOptions(searchQuery, {
      enabled: activeTab === 'find' && triggerSearch && searchQuery.trim() !== '',
    })
  );

  // Get friends query
  const { data: friends = [], isLoading: isLoadingFriends, error: friendsError } = useQuery(
    trpc.getFriends.queryOptions(undefined, {
      enabled: activeTab === 'friends',
    })
  );

  // Get current user query (for client-side self exclusion as fallback)
  const { data: currentUserData = [] } = useQuery(
    trpc.getUsers.queryOptions(undefined)
  );
  const currentUserId = currentUserData[0]?.id;

  // Get sent friend request IDs to avoid duplicate pending requests
  const { data: sentRequestIds = [] } = useQuery(
    trpc.getSentFriendRequestIds.queryOptions(undefined)
  );

  // Get friend requests query
  const { data: friendRequests = [], isLoading: isLoadingRequests, error: requestsError } = useQuery(
    trpc.getFriendRequests.queryOptions(undefined, {
      enabled: activeTab === 'requests',
    })
  );

  // Get friend IDs to check existing friendships
  const { data: friendIds = [] } = useQuery(
    trpc.getFriendIds.queryOptions(undefined)
  );

  const filteredSearchResults = searchResults.filter(user =>
    user.id !== currentUserId &&
    !friendIds.includes(user.id) &&
    !sentRequestIds.includes(user.id)
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setTriggerSearch(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setTriggerSearch(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchQuery('');
    setTriggerSearch(false);
  };

  const handleSendFriendRequest = async (userId: string) => {
    try {
      await sendFriendRequestMutation.mutateAsync(userId);
      alert('Friend request sent successfully!');
      setSearchQuery('');
      setTriggerSearch(false);
    } catch (error: any) {
      alert(`Failed to send friend request: ${error?.message ?? String(error)}`);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequestMutation.mutateAsync(requestId);
      alert('Friend request accepted!');
    } catch (error: any) {
      alert(`Failed to accept friend request: ${error?.message ?? String(error)}`);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectFriendRequestMutation.mutateAsync(requestId);
      alert('Friend request rejected!');
    } catch (error: any) {
      alert(`Failed to reject friend request: ${error?.message ?? String(error)}`);
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'find':
        return 'Search for users by name...';
      case 'friends':
        return 'Search your friends...';
      case 'requests':
        return 'Search friend requests...';
      default:
        return 'Search...';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'find':
        return (
          <div className="space-y-4">
            {filteredSearchResults.length > 0 ? (
              filteredSearchResults.map((user) => (
                <Card key={user.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user.image || ''} alt={user.name} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendFriendRequest(user.id)}
                    >
                      Add Friend
                    </Button>
                  </div>
                </Card>
              ))
            ) : triggerSearch && !isSearching && searchQuery.trim() ? (
              <div className="text-center text-gray-500 py-8">
                No users found matching "{searchQuery}"
              </div>
            ) : null}
          </div>
        );

      case 'friends':
        return (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {isLoadingFriends ? (
              <div className="text-center text-gray-500 py-8">Loading friends...</div>
            ) : friends.length > 0 ? (
              friends
                .filter(friend =>
                  !searchQuery.trim() ||
                  friend.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((friend) => (
                  <Card key={friend.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={friend.image || ''} alt={friend.name} />
                        <AvatarFallback>
                          {friend.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                        <p className="text-gray-600">{friend.email}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Message
                      </Button>
                    </div>
                  </Card>
                ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No friends yet. Start by finding some friends!
              </div>
            )}
          </div>
        );

      case 'requests':
        return (
          <div className="space-y-4">
            {isLoadingRequests ? (
              <div className="text-center text-gray-500 py-8">Loading friend requests...</div>
            ) : friendRequests.length > 0 ? (
              friendRequests
                .filter(request =>
                  !searchQuery.trim() ||
                  request.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((request) => (
                  <Card key={request.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={request.sender.image || ''} alt={request.sender.name} />
                        <AvatarFallback>
                          {request.sender.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{request.sender.name}</h3>
                        <p className="text-gray-600">{request.sender.email}</p>
                        <p className="text-sm text-gray-500">Sent you a friend request</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No pending friend requests.
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Friends</h1>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'find' ? 'default' : 'outline'}
            onClick={() => handleTabChange('find')}
            className="flex-1"
          >
            Find Friends
          </Button>
          <Button
            variant={activeTab === 'friends' ? 'default' : 'outline'}
            onClick={() => handleTabChange('friends')}
            className="flex-1"
          >
            My Friends
          </Button>
          <Button
            variant={activeTab === 'requests' ? 'default' : 'outline'}
            onClick={() => handleTabChange('requests')}
            className="flex-1"
          >
            Requests
          </Button>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-6"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {(searchError || friendsError || requestsError) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Error: {searchError?.message || friendsError?.message || requestsError?.message}
          </div>
        )}

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
