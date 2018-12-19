using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LiteDB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using WebWallet.Helpers;
using WebWallet.Models;

namespace WebWallet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetHeightController : ControllerBase
    {
        [HttpGet]
        public ContentResult Get()
        {
            try
            {
                return Content((RpcHelper.Request<GetHeightResp>("getheight").Height -1).ToString());
            }
            catch (Exception ex)
            {
                //if the daemon is down, getheight will return an error and get stuck, so we return the latest cache height that we have available in this instance... 
                return Content(getHeightFromCache().ToString());
            }
        }

        private int getHeightFromCache()
        {
            //used to pick the correct file
            var start = 1;
            var end = start + 10000 - 1;

            var hasNext = false;

            for (int i = start; i <= end; i += 10000)
            {
                hasNext = System.IO.File.Exists(string.Concat(AppContext.BaseDirectory, @"App_Data/", "transactions_", (start + 10000), "-", (end + 10000), ".db"));
                if (!hasNext)
                {
                    //this is the heighest available cache file... 
                    try
                    {
                        using (var db = new LiteDatabase(string.Concat(AppContext.BaseDirectory, @"App_Data/", "transactions_", start, "-", end, ".db")))
                        {
                            var transactions = db.GetCollection<CachedTx>("cached_txs");
                            var lastTxId = transactions.Max(x => x.Id).AsInt32;
                            //get the last Tx we cached
                            var lastTx = transactions.FindOne(x => x.Id == lastTxId);
                            if (lastTx != null)
                            {
                                return lastTx.height;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        //todo: log and return client handlable exception
                        return 0;
                    }
                }
            }
            return 0;
        }
    }
}