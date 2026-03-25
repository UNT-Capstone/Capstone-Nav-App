'use client';

import { useState } from 'react';
import { useTRPC } from '@/src/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

  const trpc = useTRPC();

  const { data: searchResults = [], isLoading: isSearching, error } = useQuery(
    trpc.searchUsers.queryOptions(searchQuery, {
      enabled: triggerSearch && searchQuery.trim() !== '',
    })
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

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-32">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Friends</h1>

        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search for users by name..."
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
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Error searching users: {error.message}
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
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
                  <Button variant="outline" size="sm">
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
      </div>
    </div>
  );
}