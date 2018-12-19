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
    public class TransactionsController : ControllerBase
    {

        [HttpPost]
        public JsonResult Get([FromForm] string headers)
        {

            if (!string.IsNullOrEmpty(headers))
            {
                List<TransactionHeader> txHeaders = JsonConvert.DeserializeObject<List<TransactionHeader>>(headers);

                List<int> startHeights = txHeaders.Select(x => Convert.ToInt32(Math.Floor((double)(x.height / 100) * 100))).Distinct().ToList();
                List<string> hashes = txHeaders.Select(x => x.hash).Distinct().ToList();
                List<CachedTx> transactions = new List<CachedTx>();

                foreach (var height in startHeights)
                {
                    //used to pick the correct file
                    var start = Convert.ToInt32(Math.Floor((double)(height / 10000) * 10000)) + 1;
                    var end = start + 10000 - 1;

                    try
                    {
                        using (var db = new LiteDatabase(string.Concat(AppContext.BaseDirectory, @"App_Data\", "transactions_", start, "-", end, ".db")))
                        {
                            var txDb = db.GetCollection<CachedTx>("cached_txs");
                            var txs = txDb.Find(x => hashes.Contains(x.hash)).Distinct().ToList();
                            foreach (var tx in txs)
                            {
                                if (!transactions.Any(x => x.hash == tx.hash))
                                    transactions.Add(tx);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        //todo: log and return client handlable exception
                    }
                }
                return new JsonResult(JsonConvert.SerializeObject(transactions.OrderBy(x=>x.height)));
            }

            return new JsonResult("[]");
        }
    }
}
