# Build Notes for FastComet Deployment

## Memory Error Solution

If you encounter error code -6 when building through FastComet's Node.js panel, this is likely due to memory limits. 

### Option 1: Use the low-memory build script
In FastComet's "Run JS Script" panel, select `build:low-memory` instead of `build`.

### Option 2: Build via terminal
SSH into your server and run:
```bash
cd /home/letgravi/public_html/koreanbabymeals.com
git pull origin main
NODE_OPTIONS='--max_old_space_size=512' npm run build
```

### Option 3: If memory issues persist
Build locally and upload the .next folder (not recommended for production):
```bash
# On your local machine
npm run build
# Then upload the .next folder via FTP/cPanel File Manager
```

After any successful build, remember to restart Node.js through FastComet's panel.