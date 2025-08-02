import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Team, TeamMember } from '../types/team';
import { API_CONFIG } from '../config';

interface TeamContextType {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  isLoadingTeams: boolean;
  switchTeam: (teamId: string) => void;
  createTeam: (name: string, description?: string) => Promise<void>;
  inviteMember: (email: string) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  refreshTeams: () => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};

interface TeamProviderProps {
  children: ReactNode;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (currentTeam) {
      fetchTeamMembers(currentTeam.id);
    }
  }, [currentTeam]);

  // For testing, you can replace the fetch calls with mock data:

  const fetchTeams = async () => {
    setIsLoadingTeams(true);
    try {
      // Mock data for testing
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'Engineering Team',
          description: 'Main engineering team',
          owner_id: 'current-user-id',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Research Team',
          description: 'Environmental research',
          owner_id: 'other-user-id',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      
      setTeams(mockTeams);
      setCurrentTeam(mockTeams[0]);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    // Mock data for testing
    const mockMembers: TeamMember[] = [
      {
        id: '1',
        user_id: 'current-user-id',
        team_id: teamId,
        role: 'owner',
        user_name: 'John Doe',
        user_email: 'john@example.com',
        joined_at: new Date().toISOString(),
      },
      {
        id: '2',
        user_id: '2',
        team_id: teamId,
        role: 'member',
        user_name: 'Jane Smith',
        user_email: 'jane@example.com',
        joined_at: new Date().toISOString(),
      },
    ];
    
    setTeamMembers(mockMembers);
  };

  const switchTeam = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setCurrentTeam(team);
      localStorage.setItem('currentTeamId', teamId);
    }
  };

  const createTeam = async (name: string, description?: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/teams/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        await fetchTeams();
      } else {
        throw new Error('Failed to create team');
      }
    } catch (error) {
      console.error('Failed to create team:', error);
      throw error;
    }
  };

  const inviteMember = async (email: string) => {
    if (!currentTeam) return;

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/teams/${currentTeam.id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        await fetchTeamMembers(currentTeam.id);
      } else {
        throw new Error('Failed to invite member');
      }
    } catch (error) {
      console.error('Failed to invite member:', error);
      throw error;
    }
  };

  const removeMember = async (memberId: string) => {
    if (!currentTeam) return;

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/teams/${currentTeam.id}/members/${memberId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        await fetchTeamMembers(currentTeam.id);
      } else {
        throw new Error('Failed to remove member');
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
      throw error;
    }
  };

  const refreshTeams = async () => {
    await fetchTeams();
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        currentTeam,
        teamMembers,
        isLoadingTeams,
        switchTeam,
        createTeam,
        inviteMember,
        removeMember,
        refreshTeams,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};