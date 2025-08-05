import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

interface WHMCSConfig {
  identifier: string;
  secret: string;
  url: string;
  accesskey?: string;
}

interface WHMCSUser {
  userid: string;
  firstname: string;
  lastname: string;
  email: string;
  status: string;
  groupid: string;
}

export class WHMCSIntegration {
  private config: WHMCSConfig;

  constructor(config?: WHMCSConfig) {
    this.config = config || {
      identifier: process.env.WHMCS_API_IDENTIFIER!,
      secret: process.env.WHMCS_API_SECRET!,
      url: process.env.WHMCS_API_URL!
    };
  }

  // Test WHMCS connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing WHMCS connection with URL:', this.config.url);
      console.log('Using identifier:', this.config.identifier?.substring(0, 8) + '...');
      // Use a simpler API call that requires fewer permissions
      const response = await this.makeAPICall('GetProducts', { type: 'hostingaccount' });
      console.log('WHMCS test response:', response);
      return response.result === 'success';
    } catch (error) {
      console.error('WHMCS connection test failed:', error);
      return false;
    }
  }

  // Verify WHMCS SSO token
  verifyToken(token: string, timestamp: string, hash: string): boolean {
    const expectedHash = crypto
      .createHash('sha1')
      .update(token + timestamp + this.config.secret)
      .digest('hex');
    
    return hash === expectedHash;
  }

  // Make API call to WHMCS
  async makeAPICall(action: string, params: Record<string, any> = {}): Promise<any> {
    const postData = {
      identifier: this.config.identifier,
      secret: this.config.secret,
      action,
      responsetype: 'json',
      ...params
    };

    try {
      // Ensure URL has proper protocol
      const apiUrl = this.config.url.startsWith('http') 
        ? `${this.config.url}/includes/api.php`
        : `https://${this.config.url}/includes/api.php`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(postData).toString()
      });

      const data = await response.json();
      
      if (data.result !== 'success') {
        throw new Error(`WHMCS API Error: ${data.message || 'Unknown error'}`);
      }

      return data;
    } catch (error) {
      console.error('WHMCS API Error:', error);
      throw error;
    }
  }

  // Get client details from WHMCS
  async getClientDetails(clientId: string): Promise<WHMCSUser | null> {
    try {
      const response = await this.makeAPICall('GetClientsDetails', {
        clientid: clientId
      });

      return {
        userid: response.userid,
        firstname: response.firstname,
        lastname: response.lastname,
        email: response.email,
        status: response.status,
        groupid: response.groupid
      };
    } catch (error) {
      console.error('Error fetching client details:', error);
      return null;
    }
  }

  // Validate client login
  async validateLogin(email: string, password: string): Promise<WHMCSUser | null> {
    try {
      const response = await this.makeAPICall('ValidateLogin', {
        email,
        password2: password
      });

      if (response.userid) {
        return await this.getClientDetails(response.userid);
      }

      return null;
    } catch (error) {
      console.error('Error validating login:', error);
      return null;
    }
  }

  // Get all clients
  async getClients(limitstart?: number, limitnum?: number): Promise<any> {
    try {
      return await this.makeAPICall('GetClients', {
        limitstart: limitstart || 0,
        limitnum: limitnum || 25
      });
    } catch (error) {
      console.error('Error fetching clients:', error);
      return null;
    }
  }

  // Get client invoices
  async getClientInvoices(clientId: string): Promise<any> {
    try {
      return await this.makeAPICall('GetInvoices', {
        userid: clientId
      });
    } catch (error) {
      console.error('Error fetching client invoices:', error);
      return null;
    }
  }

  // Get client services
  async getClientServices(clientId: string): Promise<any> {
    try {
      console.log(`[WHMCS] Fetching services for client ID: ${clientId}`);
      const result = await this.makeAPICall('GetClientsProducts', {
        clientid: clientId
      });
      console.log(`[WHMCS] Services API response:`, JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('Error fetching client services:', error);
      return null;
    }
  }

  // Get support tickets
  async getSupportTickets(clientId?: string): Promise<any> {
    try {
      const params = clientId ? { clientid: clientId } : {};
      return await this.makeAPICall('GetTickets', params);
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      return null;
    }
  }

  // Create support ticket
  async createSupportTicket(params: {
    clientid: string;
    name?: string;
    email?: string;
    subject: string;
    message: string;
    priority?: 'Low' | 'Medium' | 'High';
    deptid?: string;
  }): Promise<any> {
    try {
      const ticketParams = {
        clientid: params.clientid,
        subject: params.subject,
        message: params.message,
        priority: params.priority || 'Medium',
        ...params.name && { name: params.name },
        ...params.email && { email: params.email },
        ...params.deptid && { deptid: params.deptid }
      };
      
      return await this.makeAPICall('OpenTicket', ticketParams);
    } catch (error) {
      console.error('Error creating support ticket:', error);
      throw error;
    }
  }

  // Get ticket details
  async getTicketDetails(ticketId: string): Promise<any> {
    try {
      return await this.makeAPICall('GetTicket', { ticketid: ticketId });
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      return null;
    }
  }

  // Reply to ticket
  async replyToTicket(ticketId: string, message: string, clientId?: string): Promise<any> {
    try {
      const params: any = {
        ticketid: ticketId,
        message: message
      };
      
      if (clientId) {
        params.clientid = clientId;
      }
      
      return await this.makeAPICall('AddTicketReply', params);
    } catch (error) {
      console.error('Error replying to ticket:', error);
      throw error;
    }
  }

  // Get support departments
  async getSupportDepartments(): Promise<any> {
    try {
      return await this.makeAPICall('GetSupportDepartments');
    } catch (error) {
      console.error('Error fetching support departments:', error);
      return null;
    }
  }

  // Get products/services catalog
  async getProducts(): Promise<any> {
    try {
      return await this.makeAPICall('GetProducts');
    } catch (error) {
      console.error('Error fetching products:', error);
      return null;
    }
  }
}

// Middleware for WHMCS authentication
export function createWHMCSAuthMiddleware(whmcs: WHMCSIntegration) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.query.token as string;
    const timestamp = req.query.timestamp as string;
    const hash = req.query.hash as string;
    const userid = req.query.userid as string;

    if (!token || !timestamp || !hash || !userid) {
      return res.status(401).json({ message: 'Missing WHMCS authentication parameters' });
    }

    // Verify token hasn't expired (5 minute window)
    const now = Math.floor(Date.now() / 1000);
    const tokenTime = parseInt(timestamp);
    if (now - tokenTime > 300) {
      return res.status(401).json({ message: 'Authentication token expired' });
    }

    // Verify token hash
    if (!whmcs.verifyToken(token, timestamp, hash)) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    // Get user details from WHMCS
    const user = await whmcs.getClientDetails(userid);
    if (!user) {
      return res.status(401).json({ message: 'User not found in WHMCS' });
    }

    // Check if user is active
    if (user.status !== 'Active') {
      return res.status(401).json({ message: 'User account is not active' });
    }

    // Attach user to request
    (req as any).whmcsUser = user;
    next();
  };
}

// Generate WHMCS SSO URL
export function generateWHMCSLoginURL(
  whmcsUrl: string,
  secret: string,
  goto: string = '/'
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const token = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .createHash('sha1')
    .update(token + timestamp + secret)
    .digest('hex');

  const params = new URLSearchParams({
    token,
    timestamp,
    hash,
    goto: encodeURIComponent(goto)
  });

  return `${whmcsUrl}/clientarea.php?sso=1&${params.toString()}`;
}