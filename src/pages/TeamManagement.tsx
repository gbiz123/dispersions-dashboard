import React, { useState } from 'react';
import { useTeam } from '../context/TeamContext';
import { UserPlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const TeamManagement: React.FC = () => {
  const { currentTeam, teamMembers, inviteMember, removeMember } = useTeam();
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const currentUserId = 'current-user-id'; 
  const isOwner = currentTeam?.owner_id === currentUserId;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      await inviteMember(inviteEmail);
      setInviteEmail('');
      window.alert('Invitation sent successfully!');
    } catch (error) {
      window.alert('Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;

    try {
      await removeMember(memberId);
    } catch (error) {
      window.alert('Failed to remove member');
    }
  };

  if (!currentTeam) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="text-gray-500">No team selected</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6">Team Management</h1>

      <div className="grid gap-6 lg:grid-cols-1">
        {/* Team Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">{currentTeam.name}</h2>
          {currentTeam.description && (
            <p className="text-gray-600 mb-4">{currentTeam.description}</p>
          )}
          <div className="text-sm text-gray-500">
            Created: {new Date(currentTeam.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Invite Member Card - Only show if owner */}
        {isOwner && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Invite Team Member</h3>
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isInviting}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
              >
                <UserPlusIcon className="h-4 w-4" />
                <span>{isInviting ? 'Inviting...' : 'Invite'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Team Members Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Team Members</h3>
          <div className="space-y-3">
            {teamMembers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No team members yet</p>
            ) : (
              teamMembers.map((member) => (
                <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-200 rounded-md gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{member.user_name}</div>
                    <div className="text-sm text-gray-600 truncate">{member.user_email}</div>
                  </div>
                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    {member.role === 'owner' && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Owner</span>
                    )}
                    {isOwner && member.role !== 'owner' && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Remove member"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;