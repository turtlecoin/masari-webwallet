using LiteDB;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebWallet.Helpers;
using WebWallet.Models;

namespace WebWallet.Controllers
{
    [Route("api/[controller]")]
    public class BlockchainController : ControllerBase
    {

        [HttpGet]
        public JsonResult Get(int height = 0)
        {

            //TODO: Update this to split get Tx's from Split BC cache
            var startHeight = height;
            var endHeight = startHeight + 100;
            if (startHeight < 1) startHeight = 1;
            var chainHeight = RpcHelper.Request<GetHeightResp>("getheight").Height;
            if (chainHeight == 0) chainHeight = endHeight + 100;
            if (endHeight > chainHeight)
                endHeight = chainHeight;
            //used to pick the correct file
            var start = Convert.ToInt32(Math.Floor((double)(height / 10000) * 10000)) + 1;
            var end = start + 10000 - 1;

            try
            {
                using (var db = new LiteDatabase(string.Concat(AppContext.BaseDirectory, @"App_Data/", "transactions_", start, "-", end, ".db")))
                {
                    var transactions = db.GetCollection<CachedTx>("cached_txs");
                    var txs = transactions.Find(x => x.height >= startHeight && x.height <= endHeight);
                    return new JsonResult(JsonConvert.SerializeObject(txs));
                }
            }
            catch (Exception ex)
            {
                //todo: log and return client handlable exception
            }

            return new JsonResult("");
        }
    }
}
