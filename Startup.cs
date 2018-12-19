/*
 * Copyright (c) 2018, The Plenteum Project
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

using System;
using Hangfire;
using Hangfire.Console;
using Hangfire.MemoryStorage;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WebWallet.Helpers;
using Microsoft.AspNetCore.ResponseCompression;
using Serilog;
using Microsoft.Extensions.Logging;

namespace WebWallet
{
    public class Startup
    {
        public Startup(ILogger<Startup> _logger, ILoggerFactory _logFactory, IConfiguration configuration)
        {
            Configuration = configuration;
            StaticLogger.LoggerFactory = _logFactory;
            StaticLogger.LoggerFactory.AddSerilog();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add logging
            services.AddSingleton(new LoggerFactory().AddSerilog());
            services.AddLogging();

            //Configure the Serilog Logger
            Log.Logger = new LoggerConfiguration()
               .MinimumLevel.Debug()
               .WriteTo.File(string.Concat(AppContext.BaseDirectory, "webwallet.log"), rollingInterval: RollingInterval.Day)
               .Enrich.FromLogContext()
               .CreateLogger();

            //add Hangfire
            services.AddHangfire(config => {

                config.UseMemoryStorage();
                config.UseConsole();
            });

            //add MVC
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.Configure<GzipCompressionProviderOptions>(options =>
                options.Level = System.IO.Compression.CompressionLevel.Optimal
            );
            services.AddResponseCompression(options =>
                options.EnableForHttps = true
            );
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider serviceProvider)
        {
            //create the data storage directory if it dowsn't exist
            if (!System.IO.Directory.Exists(string.Concat(AppContext.BaseDirectory, "App_Data")))
            {
                System.IO.Directory.CreateDirectory(string.Concat(AppContext.BaseDirectory, "App_Data"));
            }

            //add settings provider
            serviceProvider.ConfigureSettings(Configuration);


            app.UseHangfireServer(new BackgroundJobServerOptions() { ServerName = "web-wallet-api", WorkerCount = 1 });

#if DEBUG
            app.UseHangfireDashboard();
#endif
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }
            app.UseResponseCompression();
            //app.UseHttpsRedirection();
            app.UseFileServer();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            //Queue up the caching job
            using (var jobServer = new BackgroundJobServer(new BackgroundJobServerOptions { ServerName = "BackgroundJobServer", WorkerCount = 1 }))
            {
                BackgroundJob.Enqueue(() => BlockchainCache.BuildCache(null));
            }

        }
    }
}
