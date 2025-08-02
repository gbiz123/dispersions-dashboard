export interface Team {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  role: 'owner' | 'member';
  user_name: string;
  user_email: string;
  joined_at: string;
}

export interface TeamInvite {
  id: string;
  team_id: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  invited_by: string;
  created_at: string;
}