import React, { useState } from 'react';
import { useTeam } from '../context/TeamContext';
import { ChevronDownIcon, PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const TeamSelector: React.FC = () => {
  const { teams, currentTeam, switchTeam, isLoadingTeams } = useTeam();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (isLoadingTeams) {
    return (
      <div className="animate-pulse bg-gray-200 h-10 w-48 rounded-md"></div>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <UserGroupIcon className="h-5 w-5 text-gray-500" />
          <span className="font-medium">{currentTeam?.name || 'Select Team'}</span>
          <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="py-2">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => {
                    switchTeam(team.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${
                    currentTeam?.id === team.id ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <span>{team.name}</span>
                  {currentTeam?.id === team.id && (
                    <span className="text-xs bg-blue-100 px-2 py-1 rounded">Current</span>
                  )}
                </button>
              ))}
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={() => {
                    setShowCreateModal(true);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-blue-600"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Create New Team</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTeamModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
};

interface CreateTeamModalProps {
  onClose: () => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ onClose }) => {
  const { createTeam } = useTeam();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await createTeam(name, description);
      onClose();
    } catch (error) {
      alert('Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Team</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Team Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Engineering Team"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Optional team description..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamSelector;