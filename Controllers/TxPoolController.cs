using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebWallet.Helpers;
using WebWallet.Models;

namespace WebWallet.Controllers
{
    [Route("api/[controller]")]
    public class TxPoolController : Controller
    {
        [HttpGet]
        public JsonResult Index()
        {
            try
            {
                var rawTxs = RpcHelper.RequestJson<TxPoolResp>("f_on_transactions_pool_json", new Dictionary<string, object>()).result.transactions;
                var txHashes = new List<string>();
                foreach (var rawTx in rawTxs)
                {
                    txHashes.Add(rawTx.hash);
                }
                var tx_args = new Dictionary<string, object>();
                tx_args.Add("transactionHashes", txHashes.ToArray());
                var txs = RpcHelper.Request<TxDetailResp>("get_transaction_details_by_hashes", tx_args);

                List<CachedTx> transactions = new List<CachedTx>();
                if (txs != null)
                {
                    foreach (var rawTx in txs.transactions)
                    {
                        var memPoolTx = TransactionHelpers.MapTx(rawTx);
                        memPoolTx.height = 0;
                        transactions.Add(memPoolTx);
                    }
                }
                return new JsonResult(JsonConvert.SerializeObject(transactions));
            }
            catch {
                return new JsonResult(new List<TxPoolResp>());//send back empty tx list on error
            }
        }
    }
}