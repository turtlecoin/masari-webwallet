using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebWallet.Models;

namespace WebWallet.Helpers
{
    public static class TransactionHelpers
    {

        public static CachedTx MapTx(TxResp tx)
        {
            CachedTx lightTx = new CachedTx();
            lightTx.height = tx.blockIndex + 1;
            if (tx.extra != null)
                lightTx.publicKey = tx.extra.publicKey;
            lightTx.hash = tx.hash;
            lightTx.timestamp = tx.timestamp;
            lightTx.paymentId = tx.paymentId == "0000000000000000000000000000000000000000000000000000000000000000" ? "" : tx.paymentId;
            lightTx.fee = tx.fee;
            lightTx.unlock_time = tx.unlockTime;
            //lightTx.global_index_start = tx.blockIndex; - handled in the cache calling process
            //map signatures
            //lightTx.signatures = new List<CachedSignature>();
            //if (tx.signatures != null)
            //{
            //    foreach (var sig in tx.signatures)
            //    {
            //        lightTx.signatures.Add(new CachedSignature() { first = sig.first, second = sig.second });
            //    }
            //}
            //map inputs
            lightTx.vin = new List<CachedInput>();
            if (tx.inputs != null)
            {

                foreach (var inp in tx.inputs)
                {
                    var cachedInput = new CachedInput();
                    cachedInput.amount = inp.data.amount;
                    if (inp.data != null)
                    {
                        cachedInput.mixin = inp.data.mixin;
                        if (inp.data.input != null)
                        {
                            cachedInput.k_image = inp.data.input.k_image;
                            cachedInput.key_offsets = inp.data.input.key_offsets;
                        }
                        if (inp.data.output != null)
                        {
                            cachedInput.outhash = inp.data.output.transactionHash;
                            cachedInput.outnumber = inp.data.output.number;        
                        }
                    }
                    cachedInput.type = inp.type;
                    lightTx.vin.Add(cachedInput);
                }
                
            }
            //map outputs
            //TODO: remove fusion Tx's from this cache & result
            lightTx.vout = new List<CachedOutput>();
            if (tx.outputs != null)
            {
                foreach (var outp in tx.outputs)
                {
                    var cachedOutput = new CachedOutput();
                    cachedOutput.amount = outp.output.amount;
                    cachedOutput.globalIndex = outp.globalIndex;
                    if (outp.output != null)
                    {
                        if (outp.output.target != null)
                        {
                            cachedOutput.type = outp.output.target.type;
                            if (outp.output.target.data != null)
                            {
                                cachedOutput.key = outp.output.target.data.key;
                            }
                        }
                    }
                    lightTx.vout.Add(cachedOutput);
                }
            }
            return lightTx;
        }

    }
}
