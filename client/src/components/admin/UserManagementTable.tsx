import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import UserModal, { CreateUserModal } from './UserModal';
import { useAuth } from '@/hooks/useAuth';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';

interface IUser {
  _id?: string;
  name: string;
  email: string;
  role:
    | 'ADMIN'
    | 'MANAGER'
    | 'MEMBER'
    | 'TRAINER'
    | 'Developer'
    | 'Teaching Assistant';
  phone?: string;
  facebookUrl?: string;
  profileImage?: string;
  createdAt?: string;
}

export function UserManagementTable() {
  const { user } = useAuth();
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalOpen = (u: IUser) => {
    setSelectedUser(u);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (updatedUser: Omit<IUser, '_id'>) => {
    if (!selectedUser?._id) return;
    try {
      await api.put(`/users/${selectedUser._id}`, updatedUser);
      toast.success('User updated successfully!');
      setIsEditModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getBadgeVariant = (role: IUser['role']) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'MANAGER':
        return 'default';
      case 'TRAINER':
        return 'success';
      case 'Developer':
        return 'info';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading user directory...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Users Management</h2>
          <p className="text-sm text-muted-foreground">Manage user profiles, credentials, and access roles.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add User
          </Button>
        )}
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Facebook</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={u.profileImage} alt={u.name} />
                    <AvatarFallback className="text-xs font-semibold bg-primary/10">
                      {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(u.role)} className="capitalize">
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell className="text-muted-foreground">{u.phone || '-'}</TableCell>
                <TableCell>
                  {u.facebookUrl ? (
                    <a
                      href={u.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs"
                    >
                      Profile Link
                    </a>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {u.createdAt ? format(new Date(u.createdAt), 'PP') : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleModalOpen(u)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleEditSave}
        user={selectedUser}
      />

      {user?.role === 'ADMIN' && (
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUserCreated={fetchUsers}
        />
      )}
    </div>
  );
}
