using Hangfire;
using Hangfire.Console;
using Hangfire.Server;
using LiteDB;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebWallet.Models;

namespace WebWallet.Helpers
{
    public static class BlockchainCache
    {

        private static ILogger logger = StaticLogger.CreateLogger("BlockchainChache");

        private static void LogException(Exception ex)
        {
            logger.Log(LogLevel.Error, ex.Message);
            logger.Log(LogLevel.Error, ex.StackTrace);
            if (ex.InnerException != null)
            {
                logger.Log(LogLevel.Error, string.Concat("Inner: ", ex.InnerException.Message));
                logger.Log(LogLevel.Error, ex.InnerException.StackTrace);
            }
        }

        [AutomaticRetry(Attempts = 0, OnAttemptsExceeded = AttemptsExceededAction.Delete)]
        [DisableConcurrentExecution(30)]
        public static void BuildCache(PerformContext context)
        {
            var hashTracker = "";
            try
            {
                //first, we need to know the current BC Height
                //get bc height from RPC
                var currentHeight = 0;
                try
                {
                    currentHeight = RpcHelper.Request<GetHeightResp>("getheight").Height - 1;
                }
                catch
                {
                    currentHeight = 0;
                }
                var startHeight = 1;
                var endHeight = Convert.ToInt32(Math.Ceiling((double)(currentHeight / 10000) * 10000)) + 10000;
                logger.Log(LogLevel.Information, $"Processing transactions from blocks {startHeight} to {endHeight}");
                //now, splt the current height into blocks of 10000
                for (int i = startHeight; i <= endHeight; i += 10000)
                {
                    var start = i;
                    var end = i + 10000 - 1;
                    //retreive, transform and cache the blockchain and store in LiteDB
                    using (var db = new LiteDatabase(string.Concat(AppContext.BaseDirectory, @"App_Data/", "transactions_", start, "-", end, ".db")))
                    {
                        var transactions = db.GetCollection<CachedTx>("cached_txs");
                        var date = DateTime.Now;
                        // Index document using height's, hash and Id
                        transactions.EnsureIndex(x => x.height);
                        transactions.EnsureIndex(x => x.Id);
                        transactions.EnsureIndex(x => x.hash);

                        try
                        {
                            //get the maxTxId
                            var lastTxId = transactions.Max(x => x.Id).AsInt32;
                            //get the last Tx we cached
                            var lastTx = transactions.FindOne(x => x.Id == lastTxId);
                            if (lastTx != null)
                            {
                                start = lastTx.height;
                                if (start == end)
                                {
                                    logger.Log(LogLevel.Information, $"Already cached transactions from blocks {startHeight} to {endHeight}");
                                    continue; //move to the next file... 
                                }
                            }
                            else
                            {
                                start = i;
                            }
                        }
                        catch (Exception ex)
                        {
                            LogException(ex);
                        }
                        var counter = 1;
                        var gCounter = start;

                        var txHashes = new List<string>();

                        if (currentHeight > start)
                        {
                            if (end > currentHeight) end = currentHeight;
                            for (var j = start; j <= end; j++)
                            {
                                var height_args = new int[] { j };
                                var blockHash = "";
                                try
                                {
                                    blockHash = RpcHelper.RequestJson<HashResp>("on_getblockhash", height_args).result;
                                }
                                catch { }
                                if (!string.IsNullOrEmpty(blockHash))
                                {
                                    //then, get the blockHash for the height we're currently processing...
                                    var hash_args = new Dictionary<string, object>();
                                    hash_args.Add("hash", blockHash);
                                    //if this fails we want it to exit, wait 30 seconds and startup again
                                    txHashes.AddRange(RpcHelper.RequestJson<BlockJsonResp>("f_block_json", hash_args).result.block.transactions.Select(x => x.hash).ToList<string>());
                                    //next, get the block itself and extract all the tx hashes....
                                    //TEMP: change back to 50
                                    if (counter == 10 || gCounter == currentHeight)
                                    {
                                        logger.Log(LogLevel.Information, $"Caching transactions at height {gCounter}");
                                        var tx_args = new Dictionary<string, object>();
                                        tx_args.Add("transactionHashes", txHashes.ToArray());
                                        hashTracker = JsonConvert.SerializeObject(tx_args);
                                        var txs = RpcHelper.Request<TxDetailResp>("get_transaction_details_by_hashes", tx_args);
                                        var transactionsToInsert = new List<CachedTx>();
                                        foreach (var tx in txs.transactions)
                                        {
                                            var cachedTx = TransactionHelpers.MapTx(tx);
                                            //persist tx's to cache
                                            if (cachedTx != null && !transactions.Find(x => x.hash == cachedTx.hash).Any())
                                            {
                                                transactionsToInsert.Add(cachedTx);
                                            }
                                        }
                                        if (transactionsToInsert.Any())
                                        {
                                            transactions.InsertBulk(transactionsToInsert);
                                            logger.Log(LogLevel.Information, $"Added {transactionsToInsert.Count} transactions to cache.");
                                            var distinctTxCount = transactionsToInsert.Select(x => x.height).Distinct().Count();
                                            //TEMP: change back to 50
                                            if (distinctTxCount != 10)
                                            {
                                                logger.Log(LogLevel.Warning, $"Potentially missing transactions at height {gCounter}, expected min 50, found {distinctTxCount}");
                                            }

                                        }
                                        counter = 0;
                                        txHashes.Clear();
                                    }
                                    gCounter++;
                                    counter++;
                                }

                            }

                        }
                        //else there's nothing to do
                    }
                }
            }
            catch (Exception ex)
            {
                LogException(ex);
                logger.LogError("Hashes on fail: \n" + hashTracker);
            }
            finally
            {
                //finally, schedule the next check in 30 seconds time
                BackgroundJob.Schedule(() => BlockchainCache.BuildCache(null), TimeSpan.FromSeconds(30));
            }
        }
    }
}
