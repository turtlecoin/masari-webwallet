using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebWallet.Models
{
    public class LightTx
    {
        public string hash { get; set; } //hash
        public int height { get; set; } //hash
        public string publicKey { get; set; }
        public List<LightOutput> vout { get; set; } //outputs
        //public List<CachedSignature> signatures { get; set; }
    }
    public class LightOutput
    {
        public string key { get; set; } //key
    }

}
