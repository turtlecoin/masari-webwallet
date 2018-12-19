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
            lightTx.height = tx.blockIndex;
            if (tx.extra != null)
                lightTx.publicKey = tx.extra.publicKey;
            lightTx.hash = tx.hash;
            lightTx.timestamp = tx.timestamp;
            lightTx.paymentId = tx.paymentId == "0000000000000000000000000000000000000000000000000000000000000000" ? "" : tx.paymentId;
            lightTx.fee = tx.fee;
            lightTx.unlock_time = tx.unlockTime;
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
                        if (inp.data.input != null)
                        {
                            cachedInput.k_image = inp.data.input.k_image;
                            if (inp.data.input.amount > 0 && cachedInput.amount == 0)
                                cachedInput.amount = inp.data.input.amount;
                        }
                    }
                    lightTx.vin.Add(cachedInput);
                }

            }
            //map outputs
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

        public static List<LightTx> MapTxs(List<CachedTx> txs) {
            List<LightTx> outs = new List<LightTx>();
            foreach (var tx in txs) {
                outs.Add(MapTx(tx));
            }
            return outs;
        }

        public static LightTx MapTx(CachedTx tx)
        {
            LightTx lightTx = new LightTx();
            lightTx.publicKey = tx.publicKey;
            lightTx.hash = tx.hash;
            lightTx.height = tx.height;
            //map outputs
            lightTx.vout = new List<LightOutput>();
            if (tx.vout != null)
            {
                foreach (var outp in tx.vout)
                {
                    var lightOutput = new LightOutput();
                    lightOutput.key = outp.key;
                    lightTx.vout.Add(lightOutput);
                }
            }
            return lightTx;
        }

    }
}
