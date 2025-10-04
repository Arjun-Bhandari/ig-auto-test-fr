// ig-auto-test-fr/src/custom-component/automation/automation-list.tsx
'use client';

import { useEffect, useState } from 'react';
import { listAutomations, updateAutomationStatus, deleteAutomation } from '@/lib/instagram/services';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  MoreVertical, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  MessageCircle, 
  MessageSquare,
  Calendar,
  Activity
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import AddautomationButton from './add-automation-button';
import { IgConnectButton } from '../ig-connect';

interface Automation {
  id: string;
  name: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  isActive: boolean;
  campaignType:string;
  mediaId: string;
  createdAt: string;
  updatedAt: string;
  lastExecutedAt?: string;
  executionCount: number;
  errorCount: number;
}

export function AutomationList() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();
const [refreshToken, setRefreshToken] = useState<string | null>(null);
const [accessToken, setAccessToken] = useState<string | null>(null)
useEffect(() => {
  if (typeof window !== 'undefined') {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken  = localStorage.getItem('accessToken')
    setRefreshToken(refreshToken);
    setAccessToken(accessToken)
  }
}, []);

useEffect(() => {
  if (refreshToken && accessToken) {
    loadAutomations();
  } else {
    // If no igUserId, stop loading
    setIsLoading(false);
  }
}, [refreshToken, accessToken]);

  const loadAutomations = async () => {
    try {
      setIsLoading(true);
  
      const response = await listAutomations();
      if (response) {
        setAutomations(response.data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load automations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (automationId: string, currentStatus: string, currentIsActive: boolean) => {
    try {
      setUpdating(automationId);
      
      const newStatus = currentIsActive ? 'PAUSED' : 'ACTIVE';
      const newIsActive = !currentIsActive;
      
      const response = await updateAutomationStatus( {status:newStatus, isActive:newIsActive},automationId,);
      
      if (response) {
        setAutomations(prev => 
          prev.map(automation => 
            automation.id === automationId 
              ? { ...automation, status: newStatus, isActive: newIsActive }
              : automation
          )
        );
      }
    } catch (err) {
      console.error('Error updating automation:', err);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (automationId: string) => {
    if (!confirm('Are you sure you want to delete this automation?')) return;
    
    try {
      setUpdating(automationId);
      const response = await deleteAutomation(automationId);
      
      if (response) {
        setAutomations(prev => prev.filter(automation => automation.id !== automationId));
      }
    } catch (err) {
      console.error('Error deleting automation:', err);
    } finally {
      setUpdating(null);
    }
  };

  const handleEdit = (automationId: string, campaignType: string) => {
    router.push(`/automation/edit/${automationId}?campaign_type=${campaignType}`);
  };

  const getStatusColor = (status: string, isActive: boolean) => {
    if (isActive && status === 'ACTIVE') return 'bg-green-500';
    if (status === 'PAUSED') return 'bg-yellow-500';
    if (status === 'DRAFT') return 'bg-gray-500';
    if (status === 'ARCHIVED') return 'bg-red-500';
    return 'bg-gray-500';
  };

  const getStatusText = (status: string, isActive: boolean) => {
    if (isActive && status === 'ACTIVE') return 'Running';
    if (status === 'PAUSED') return 'Paused';
    if (status === 'DRAFT') return 'Draft';
    if (status === 'ARCHIVED') return 'Archived';
    return 'Inactive';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  // Show connect button if no igUserId
  if (!refreshToken && !accessToken) {
    return (
      <div className="flex h-screen bg-[#12111A] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Connect to Instagram</h2>
          <p className="text-white/60 mb-6">You need to connect your Instagram account to create automations.</p>
          <IgConnectButton />
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-4 animate-pulse">
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-white/20 rounded w-16"></div>
                <div className="h-6 bg-white/20 rounded w-6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-200">
          <p>Error loading automations: {error}</p>
          <Button 
            onClick={loadAutomations} 
            variant="outline" 
            size="sm" 
            className="mt-2 border-red-500/30 text-red-200 hover:bg-red-500/20"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  // if(!igUserId) return(<IgConnectButton/>);
  if (automations.length === 0) {
    return (
      <div className="w-full">
        <div className="bg-white/5 rounded-xl border border-white/10 p-8 text-center">
          <MessageCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-white/70 text-lg font-medium mb-2">No Automations Yet</h3>
          <p className="text-white/50 text-sm mb-4">
            Create your first automation to start engaging with your audience automatically.
          </p>
        <AddautomationButton/>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {automations.map((automation) => (
          <div key={automation.id} className="bg-white/5 rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {/* {automation.templateId.includes('dm') ? (
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                ) : (
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                )} */}
                <h3 className="text-white font-medium text-sm truncate">
                  {automation.name}
                </h3>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/60 hover:text-white">
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#12111A] border-white/10">
                  <DropdownMenuItem 
                    onClick={() => handleEdit(automation.id, automation.campaignType)}
                    className="text-white hover:bg-white/10"
                  >
                    <Edit className="w-3 h-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(automation.id)}
                    className="text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Status</span>
                <Badge 
                  className={`text-xs ${getStatusColor(automation.status, automation.isActive)} text-white`}
                >
                  {getStatusText(automation.status, automation.isActive)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Executions</span>
                <span className="text-xs text-white/80">{automation.executionCount}</span>
              </div>

              {automation.errorCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-red-400">Errors</span>
                  <span className="text-xs text-red-400">{automation.errorCount}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Created</span>
                <span className="text-xs text-white/80">{formatDate(automation.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Switch
                  checked={automation.isActive}
                  onCheckedChange={() => handleToggleActive(automation.id, automation.status, automation.isActive)}
                  disabled={updating === automation.id}
                  className="data-[state=checked]:bg-green-600"
                />
                <span className="text-xs text-white/60">
                  {automation.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {updating === automation.id && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}