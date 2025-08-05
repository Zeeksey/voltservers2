import fetch from 'node-fetch';

export interface WispServer {
  id: string;
  name: string;
  game: string;
  status: 'online' | 'offline' | 'starting' | 'stopping';
  ip: string;
  port: number;
  maxPlayers: number;
  currentPlayers: number;
  cpu: number;
  memory: {
    used: number;
    total: number;
  };
  disk: {
    used: number;
    total: number;
  };
  node: string;
  location: string;
  uptime: number;
}

export interface WispClient {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  servers: WispServer[];
}

export class WispIntegration {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.WISP_API_URL || 'https://panel.wisp.gg/api';
    this.apiKey = process.env.WISP_API_KEY || '';
  }

  // Test Wisp connection
  async testConnection(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.log('No Wisp API key configured');
        return false;
      }

      const response = await fetch(`${this.apiUrl}/user`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Wisp connection test response:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Wisp connection test failed:', error);
      return false;
    }
  }

  // Get client servers from Wisp
  async getClientServers(clientEmail: string): Promise<WispServer[]> {
    try {
      if (!this.apiKey) {
        console.log('No Wisp API key - returning mock data for demo');
        return this.getMockServers();
      }

      const response = await fetch(`${this.apiUrl}/servers`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Wisp API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformWispServers(data.servers || []);
    } catch (error) {
      console.error('Error fetching Wisp servers:', error);
      return this.getMockServers();
    }
  }

  // Get specific server details
  async getServerDetails(serverId: string): Promise<WispServer | null> {
    try {
      if (!this.apiKey) {
        const mockServers = this.getMockServers();
        return mockServers.find(s => s.id === serverId) || null;
      }

      const response = await fetch(`${this.apiUrl}/servers/${serverId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Wisp API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformWispServer(data.server);
    } catch (error) {
      console.error('Error fetching Wisp server details:', error);
      return null;
    }
  }

  // Server actions (start, stop, restart)
  async serverAction(serverId: string, action: 'start' | 'stop' | 'restart'): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.log(`Mock ${action} action for server ${serverId}`);
        return true;
      }

      const response = await fetch(`${this.apiUrl}/servers/${serverId}/power`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ signal: action })
      });

      return response.ok;
    } catch (error) {
      console.error(`Error performing ${action} on server ${serverId}:`, error);
      return false;
    }
  }

  // Get server console logs
  async getServerLogs(serverId: string, lines: number = 50): Promise<string[]> {
    try {
      if (!this.apiKey) {
        return [
          '[INFO] Server starting...',
          '[INFO] Loading world data...',
          '[INFO] Server ready! Players can now connect.',
          '[CONSOLE] This is demo console output - configure Wisp API for real data'
        ];
      }

      const response = await fetch(`${this.apiUrl}/servers/${serverId}/logs?lines=${lines}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Wisp API error: ${response.status}`);
      }

      const data = await response.json();
      return data.logs || [];
    } catch (error) {
      console.error('Error fetching server logs:', error);
      return ['Error fetching console logs'];
    }
  }

  // Transform Wisp API response to our format
  private transformWispServers(wispServers: any[]): WispServer[] {
    return wispServers.map(server => this.transformWispServer(server));
  }

  private transformWispServer(server: any): WispServer {
    return {
      id: server.id || server.uuid,
      name: server.name,
      game: server.game || server.egg?.name || 'Game Server',
      status: this.mapWispStatus(server.status),
      ip: server.allocation?.ip || 'Unknown',
      port: server.allocation?.port || 25565,
      maxPlayers: server.limits?.players || 20,
      currentPlayers: server.players?.current || 0,
      cpu: server.resources?.cpu_absolute || 0,
      memory: {
        used: server.resources?.memory_bytes || 0,
        total: server.limits?.memory || 1024
      },
      disk: {
        used: server.resources?.disk_bytes || 0,
        total: server.limits?.disk || 10240
      },
      node: server.node?.name || 'Unknown Node',
      location: server.node?.location || 'Global',
      uptime: server.uptime || 0
    };
  }

  private mapWispStatus(status: string): 'online' | 'offline' | 'starting' | 'stopping' {
    switch (status?.toLowerCase()) {
      case 'running':
      case 'online':
        return 'online';
      case 'starting':
        return 'starting';
      case 'stopping':
        return 'stopping';
      default:
        return 'offline';
    }
  }

  // Mock data for demo when no API key is configured
  private getMockServers(): WispServer[] {
    return [
      {
        id: 'srv-minecraft-001',
        name: 'SkyBlock Paradise',
        game: 'Minecraft Java Edition',
        status: 'online',
        ip: '192.168.1.100',
        port: 25565,
        maxPlayers: 50,
        currentPlayers: 23,
        cpu: 45.2,
        memory: { used: 3072, total: 4096 },
        disk: { used: 5120, total: 10240 },
        node: 'Node-US-East-1',
        location: 'Virginia, USA',
        uptime: 172800
      },
      {
        id: 'srv-minecraft-002',
        name: 'Creative Build Server',
        game: 'Minecraft Java Edition',
        status: 'online',
        ip: '192.168.1.101',
        port: 25566,
        maxPlayers: 30,
        currentPlayers: 8,
        cpu: 22.8,
        memory: { used: 2048, total: 4096 },
        disk: { used: 3584, total: 10240 },
        node: 'Node-US-West-1',
        location: 'California, USA',
        uptime: 86400
      },
      {
        id: 'srv-rust-001',
        name: 'Rust PvP Arena',
        game: 'Rust',
        status: 'offline',
        ip: '192.168.1.102',
        port: 28015,
        maxPlayers: 100,
        currentPlayers: 0,
        cpu: 0,
        memory: { used: 0, total: 8192 },
        disk: { used: 7680, total: 20480 },
        node: 'Node-EU-1',
        location: 'Frankfurt, Germany',
        uptime: 0
      }
    ];
  }
}

export const wispIntegration = new WispIntegration();