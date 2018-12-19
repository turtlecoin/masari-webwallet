using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LiteDB;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebWallet.Helpers;
using WebWallet.Models;

namespace WebWallet.Controllers
{
    [Route("api/[controller]")]
    public class SyncController : ControllerBase
    {

        [HttpGet]
        public JsonResult Get(int height = 0)
        {
            //TODO: Update this to split get Tx's from Split BC cache
            
            var startHeight = height;
            var endHeight = startHeight + 100;
            if (startHeight < 1) startHeight = 1;
            //todo, we don't have to query the chain height every time this is requested
            var chainHeight = RpcHelper.Request<GetHeightResp>("getheight").Height;
            if (chainHeight == 0) chainHeight = endHeight + 100;
            if (endHeight > chainHeight)
                endHeight = chainHeight;

            List<int> dbSegments = new List<int>();
            var segmentStart = Convert.ToInt32(Math.Floor((double)(startHeight / 10000) * 10000)) + 1;
            dbSegments.Add(segmentStart);
            if (startHeight + 100 > segmentStart + 10000 - 1)
            {
                dbSegments.Add(segmentStart + 10000);
            }
            try
            {

                //TODO:... if we find a problem - ie: there are ANY tx's that don't return at least one Tx poer height, then we need to re-cache the DB file we're working with for this height... 
                //we need to ensure that there is at least one Tx per block
                //should this be in a seperate "validation background job that's checking completed files - maybe to run once per day?
                List<LightTx> transactions = new List<LightTx>();
                foreach (var start in dbSegments)
                {
                    var end = start + 10000 - 1;
                    
                    using (var db = new LiteDatabase(string.Concat(AppContext.BaseDirectory, @"App_Data\", "transactions_", start, "-", end, ".db")))
                    {
                        var cachedtxs = db.GetCollection<CachedTx>("cached_txs");
                        var txs = cachedtxs.Find(x => x.height >= startHeight && x.height <= endHeight).Distinct().ToList();
                        transactions.AddRange(TransactionHelpers.MapTxs(txs));
                    }
                }
                return new JsonResult(JsonConvert.SerializeObject(transactions));
            }
            catch (Exception ex)
            {
                //todo: log and return client handlable exception
            }

            return new JsonResult("");
        }
    }
}