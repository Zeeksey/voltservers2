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
    this.apiUrl = process.env.WISP_API_URL || 'https://game.voltservers.com';
    this.apiKey = process.env.WISP_API_KEY || '';
    
    console.log('Wisp integration initialized:');
    console.log('API URL:', this.apiUrl);
    console.log('API Key configured:', !!this.apiKey);
  }

  // Test Wisp connection
  async testConnection(): Promise<boolean> {
    try {
      if (!this.apiKey || !this.apiUrl) {
        console.log('Missing Wisp credentials - API Key:', !!this.apiKey, 'API URL:', !!this.apiUrl);
        return false;
      }

      // Clean URL and test basic connection
      const cleanUrl = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
      const testUrl = `${cleanUrl}/api/application/servers`;

      console.log('Testing Wisp connection to:', testUrl);
      console.log('Using API Key:', this.apiKey.substring(0, 8) + '...');

      const response = await fetch(testUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Wisp connection test response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Wisp test successful, response type:', typeof data);
        return true;
      } else {
        const errorText = await response.text();
        console.log('Wisp test failed:', errorText);
        return false;
      }
    } catch (error) {
      console.error('Wisp connection test failed:', error);
      return false;
    }
  }

  // Get client servers from Wisp based on user account
  async getClientServers(clientEmail: string): Promise<WispServer[]> {
    try {
      if (!this.apiKey || !this.apiUrl) {
        console.log('No Wisp credentials - returning mock data for demo');
        return this.getMockServers();
      }

      // First, get the user ID from email
      const userId = await this.getUserIdFromEmail(clientEmail);
      if (!userId) {
        console.log(`No Wisp user found for email: ${clientEmail}`);
        return [];
      }

      const cleanUrl = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
      const apiUrl = `${cleanUrl}/api/application/servers`;

      console.log(`Fetching servers for user ${userId} (${clientEmail}):`, apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`Wisp API error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        return [];
      }

      const data = await response.json();
      console.log('Wisp API response received:', typeof data, 'total servers found:', data.data?.length || 0);
      
      // Handle different response formats from Wisp API
      let allServers = [];
      if (data.data && Array.isArray(data.data)) {
        allServers = data.data;
      } else if (Array.isArray(data)) {
        allServers = data;
      }

      // Filter servers by user ID
      const userServers = allServers.filter(server => {
        const attrs = server.attributes || server;
        return attrs.user === userId;
      });

      console.log(`Filtered to ${userServers.length} servers for user ${userId}`);

      if (userServers.length === 0) {
        console.log(`No servers found for user ${userId} (${clientEmail})`);
        return [];
      }

      return this.transformWispServers(userServers);
    } catch (error) {
      console.error('Error fetching Wisp servers:', error);
      return [];
    }
  }

  // Get all servers (admin function)
  async getAllServers(): Promise<WispServer[]> {
    try {
      if (!this.apiKey || !this.apiUrl) {
        console.log('No Wisp credentials - returning mock data for demo');
        return this.getMockServers();
      }

      const cleanUrl = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
      const apiUrl = `${cleanUrl}/api/application/servers`;

      console.log('Fetching all servers from:', apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`Wisp API error: ${response.status} ${response.statusText}`);
        return this.getMockServers();
      }

      const data = await response.json();
      console.log('All servers response:', typeof data, 'total servers found:', data.data?.length || 0);
      
      let allServers = [];
      if (data.data && Array.isArray(data.data)) {
        allServers = data.data;
      } else if (Array.isArray(data)) {
        allServers = data;
      }

      return this.transformWispServers(allServers);
    } catch (error) {
      console.error('Error fetching all Wisp servers:', error);
      return this.getMockServers();
    }
  }

  // Get user ID from email address
  private async getUserIdFromEmail(email: string): Promise<number | null> {
    try {
      const cleanUrl = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
      const apiUrl = `${cleanUrl}/api/application/users`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`Failed to fetch users: ${response.status}`);
        return null;
      }

      const data = await response.json();
      const users = data.data || [];
      
      const user = users.find((u: any) => {
        const attrs = u.attributes || u;
        return attrs.email === email;
      });

      if (user) {
        const userId = user.attributes?.id || user.id;
        console.log(`Found user ID ${userId} for email ${email}`);
        return userId;
      }

      console.log(`No user found with email: ${email}`);
      return null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
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
    const attrs = server.attributes || server;
    const environment = attrs.container?.environment || {};
    const limits = attrs.limits || {};
    
    console.log('Transforming server:', attrs.name, 'egg:', attrs.egg, 'nest:', attrs.nest);
    
    return {
      id: attrs.uuid || attrs.id?.toString() || 'unknown',
      name: attrs.name || 'Unknown Server',
      game: this.getGameFromEgg(attrs.egg, attrs.nest, environment),
      status: attrs.suspended ? 'offline' : 'online',
      ip: this.getServerIP(attrs.allocation, environment),
      port: this.getServerPort(attrs.allocation, environment),
      maxPlayers: this.getMaxPlayers(environment),
      currentPlayers: Math.floor(Math.random() * 15), // Simulated for demo
      cpu: Math.floor(Math.random() * 60), // Simulated for demo
      memory: {
        used: Math.floor((limits.memory || 1024) * 0.4), // Simulated usage
        total: limits.memory || 1024
      },
      disk: {
        used: Math.floor((limits.disk || 10240) * 0.3), // Simulated usage
        total: limits.disk || 10240
      },
      node: `Node-${attrs.node || 1}`,
      location: environment.P_SERVER_LOCATION || 'Vinthill',
      uptime: Math.floor(Math.random() * 86400) // Simulated uptime
    };
  }

  private getGameFromEgg(egg: number, nest: number, environment: any): string {
    // ARK servers
    if (egg === 41 && nest === 17) return 'ARK: Survival Ascended';
    // Minecraft servers
    if (egg === 1 && nest === 1) return 'Minecraft Java Edition';
    // Fallback based on environment
    if (environment.SRCDS_APPID === '2430930') return 'ARK: Survival Ascended';
    if (environment.SERVER_JARFILE) return 'Minecraft Java Edition';
    return 'Game Server';
  }

  private getServerIP(allocation: any, environment: any): string {
    // For demo purposes, return a generic IP
    // In real implementation, you'd fetch allocation details
    return '192.168.1.100';
  }

  private getServerPort(allocation: any, environment: any): number {
    if (environment.SERVER_PORT) return parseInt(environment.SERVER_PORT) || 25565;
    if (allocation?.port) return allocation.port;
    return 25565;
  }

  private getMaxPlayers(environment: any): number {
    if (environment.MAX_PLAYERS) return parseInt(environment.MAX_PLAYERS) || 20;
    return 20;
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