# How to compile & Deploy
The project is using Typescript as main language and not other dependencies on external libraries (everything is already included).

# Compilation
The first step will be to compile the typescript code into javascript code so browsers will be able to understand it. 
You also need to build some files that are dynamically generated like the manifest ...
This task is doable with :
```
npm install
node ./node_modules/typescript/bin/tsc --project tsconfig.prod.json
node build.js
```
The first task install dependencies (typescript) and the text one compile the typescript code.
We are using a custom tsconfig file which is optimized for production.

# Change configuration
You will have to edit the file wwwroot/config.js in order to change the API endpoint. 
The default value use the same domain appended by /api/

That's all

# Deploy
The Core application includes Kestrel Web Server for Self-Hosting. However, in a production environment we would recommend a more robust hosting solution such as IIS or Nginx for Linux:
Linux hosting with Nginx: https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx?view=aspnetcore-2.1&tabs=aspnetcore2x
Windows Hosting with IIS: https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/iis/?view=aspnetcore-2.1&tabs=aspnetcore2x
All the content of the wwwroot directory needs to be exposed with a web-server.
By default the configuration looks at domainname.com/api/


# Permissions
The API stores precomputed data for performances in a LiteDB file within App_Data/transactions.db in the runtime folder for the compiled application.
You will need to create this directory with the write permissions. The app will attempt to create it for you, but Write Permissions will be required to do so. 

# Caching Process
Precomputed data stored in the cache is built by background process using HangFire that executes every 30 seconds. 
This process is initialized on app startup and will run in the background.
If you compile the app in Debug, you can access the Hangfire Dashboard on [your url]/hangfire - do not publish a production release with a debug build, as this is not a secure route and could allow for the background process to be disabled / stopped.
This process will call the TurtleCoin daemon and compute blocks into chunks of blocks to reduce network latency.
See "BlockchainCache.cs" in the Helpers Folder.

