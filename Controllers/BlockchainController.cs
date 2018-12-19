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
            var startHeight = Convert.ToInt32(Math.Floor((double)(height / 100) * 100));
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
                //if we are close to the top of the chain (within 100 blocks) get the data directly from the node and return it.. 
                //this is a bit slower than a cache hit, but ensures we keep the wallet sync'd up to it's current actual height, rather than working a block or two behind.
                var lastSegment = Convert.ToInt32(Math.Floor((double)(chainHeight / 100) * 100));
                if (lastSegment < height)
                {
                    return GetDirect(height, startHeight, chainHeight);
                }
                else
                {
                    //get from cache
                    //TODO: If there's an error, (wallet cache get's stuck), we need to re-create that segment of the chain somehow
                    //drop the cache file, and let it rebuild, and return the queries from the chain directly... 
                    //need some for of checking mechanism to ensure that each block in the segment wh're querying has at least one transaction
                    using (var db = new LiteDatabase(string.Concat(AppContext.BaseDirectory, @"App_Data\", "transactions_", start, "-", end, ".db")))
                    {
                        var transactions = db.GetCollection<CachedTx>("cached_txs");
                        var txs = transactions.Find(x => x.height >= startHeight && x.height <= endHeight).Distinct().ToList();

                        return new JsonResult(JsonConvert.SerializeObject(txs));
                    }
                }
            }
            catch (Exception ex)
            {
                //todo: log and return client handlable exception
            }

            return new JsonResult("");
        }

        private JsonResult GetDirect(int Height, int startHeight, int chainHeight)
        {
            List<int> blockHeights = new List<int>();
            for (var x = startHeight; x < chainHeight; x++)
            {
                blockHeights.Add(x);
            }
            //fetch the transactions directly from the Blockchain
            var args = new Dictionary<string, object>();
            args.Add("blockHeights", blockHeights);
            var blocks = RpcHelper.Request<BlockResp>("get_blocks_details_by_heights", args).blocks;
            List<CachedTx> transactions = new List<CachedTx>();
            foreach (var block in blocks)
            {
                foreach (var transaction in block.transactions)
                {
                    var cachedTx = TransactionHelpers.MapTx(transaction);
                    //persist tx's to cache
                    if (cachedTx != null)
                    {
                        transactions.Add(cachedTx);
                    }
                }

            }
            return new JsonResult(JsonConvert.SerializeObject(transactions));
        }
    }
}
