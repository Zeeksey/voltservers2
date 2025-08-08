# 🚀 Deploy VoltServers to 135.148.137.158

## Ready for Deployment!

Your VoltServers application is configured and ready to deploy to your Ubuntu server.

## One-Command Deployment

**SSH into your server and run this single command:**

```bash
ssh ubuntu@135.148.137.158
curl -sSL https://raw.githubusercontent.com/Zeeksey/voltservers2/main/deploy-to-server.sh | bash
```

## What Happens During Deployment:

1. **System Updates** - Ubuntu packages updated
2. **Security Setup** - Firewall configured (ports 22, 80, 443)
3. **Node.js 20.x** - Latest stable version installed
4. **PostgreSQL** - Database server with secure credentials
5. **Application Deploy** - Your repo cloned and built for production
6. **PM2 Setup** - Process manager for high availability
7. **Nginx Config** - Web server with reverse proxy
8. **Auto-Start** - PM2 configured for server reboots
9. **Complete Testing** - All components verified working

## After Deployment:

✅ **Your site will be live at:** http://135.148.137.158  
✅ **All features working:** Games, admin panel, database, blog  
✅ **Production ready:** Clustering, logging, monitoring  
✅ **Secure:** Firewall, fail2ban, security headers  

## Deployment Time: ~10-15 minutes

The script handles everything automatically. You'll see progress updates and any issues will be clearly reported.

## Management Commands (After Deployment):

```bash
# Check application status
pm2 status

# View application logs  
pm2 logs voltservers

# Restart application
pm2 restart voltservers

# Check web server
sudo systemctl status nginx

# View deployment log
cat /tmp/voltservers-deploy.log
```

## Next Steps After Deployment:

1. **Test your site** at http://135.148.137.158
2. **Configure domain** (point DNS to 135.148.137.158)
3. **Set up SSL** with `sudo certbot --nginx`
4. **Configure integrations** (WHMCS, SendGrid) in `/home/ubuntu/voltservers/.env`

Ready to deploy? Run the command above! 🚀