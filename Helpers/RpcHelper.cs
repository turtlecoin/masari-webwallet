using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace WebWallet.Helpers
{
    public static class RpcHelper
    {
        public static T Request<T>(string method)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    var response = client.GetStringAsync(string.Concat("http://", SettingsProvider.RpcUrl, ":", SettingsProvider.RpcPort.ToString(), "/", method));
                    return JsonConvert.DeserializeObject<T>(response.Result);
                }
            }
            catch (Exception ex)
            {
                return default(T);
            }
        }

        public static T Request<T>(string method, Dictionary<string, object> args)
        {
            try
            {
                using (WalletClient client = new WalletClient())
                {
                    string payload = JsonConvert.SerializeObject(args, Formatting.Indented);
                    var response = client.UploadString(string.Concat("http://", SettingsProvider.RpcUrl, ":", SettingsProvider.RpcPort.ToString(), "/", method), payload);
                    return JsonConvert.DeserializeObject<T>(response);
                }
            }
            catch (Exception ex)
            {
                return default(T);
            }
        }

        public static T Request<T>(string method, string payload)
        {
            try
            {
                using (WalletClient client = new WalletClient())
                {
                    var response = client.UploadString(string.Concat("http://", SettingsProvider.RpcUrl, ":", SettingsProvider.RpcPort.ToString(), "/", method), payload);
                    return JsonConvert.DeserializeObject<T>(response);
                }
            }
            catch (Exception ex)
            {
                return default(T);
            }
        }

        public static T RequestJson<T>(string method, Dictionary<string, object> args)
        {
            try
            {
                using (WalletClient client = new WalletClient())
                {
                    var payload = new Dictionary<string, object>()
                    {
                        { "jsonrpc", "2.0" },
                        { "method", method },
                        { "params", args },
                        { "id", "0" }
                    };
                    string payloadJSON = JsonConvert.SerializeObject(payload, Formatting.Indented);

                    System.Net.ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

                    client.Headers[HttpRequestHeader.ContentType] = "application/json";

                    string response = client.UploadString(string.Concat("http://", SettingsProvider.RpcUrl, ":", SettingsProvider.RpcPort.ToString(), "/json_rpc"), payloadJSON);

                    return JsonConvert.DeserializeObject<T>(response);
                }
            }
            catch (Exception ex)
            {
                return default(T);
            }

        }

        public static T RequestJson<T>(string method)
        {
            try
            {
                using (WalletClient client = new WalletClient())
                {
                    var payload = new Dictionary<string, object>()
                    {
                        { "jsonrpc", "2.0" },
                        { "method", method },
                        { "id", "0" }
                    };
                    string payloadJSON = JsonConvert.SerializeObject(payload, Formatting.Indented);

                    System.Net.ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

                    client.Headers[HttpRequestHeader.ContentType] = "application/json";

                    string response = client.UploadString(string.Concat("http://", SettingsProvider.RpcUrl, ":", SettingsProvider.RpcPort.ToString(), "/json_rpc"), payloadJSON);

                    return JsonConvert.DeserializeObject<T>(response);
                }
            }
            catch (Exception ex)
            {
                return default(T);
            }

        }

        public static T RequestJson<T>(string method, string[] args)
        {
            try
            {
                using (WalletClient client = new WalletClient())
                {
                    var payload = new Dictionary<string, object>()
                    {
                        { "jsonrpc", "2.0" },
                        { "method", method },
                        { "params", args },
                        { "id", "0" }
                    };
                    string payloadJSON = JsonConvert.SerializeObject(payload, Formatting.Indented);

                    System.Net.ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

                    client.Headers[HttpRequestHeader.ContentType] = "application/json";

                    string response = client.UploadString(string.Concat("http://", SettingsProvider.RpcUrl, ":", SettingsProvider.RpcPort.ToString(), "/json_rpc"), payloadJSON);

                    return JsonConvert.DeserializeObject<T>(response);
                }
            }
            catch (Exception ex)
            {
                return default(T);
            }

        }

        public static T RequestJson<T>(string method, int[] args)
        {
            try
            {
                using (WalletClient client = new WalletClient())
                {
                    var payload = new Dictionary<string, object>()
                    {
                        { "jsonrpc", "2.0" },
                        { "method", method },
                        { "params", args },
                        { "id", "0" }
                    };
                    string payloadJSON = JsonConvert.SerializeObject(payload, Formatting.Indented);

                    System.Net.ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

                    client.Headers[HttpRequestHeader.ContentType] = "application/json";

                    string response = client.UploadString(string.Concat("http://", SettingsProvider.RpcUrl, ":", SettingsProvider.RpcPort.ToString(), "/json_rpc"), payloadJSON);

                    return JsonConvert.DeserializeObject<T>(response);
                }
            }
            catch (Exception ex)
            {
                return default(T);
            }

        }


    }

    class WalletClient : WebClient
    {
        protected override WebRequest GetWebRequest(Uri address)
        {
            HttpWebRequest request = base.GetWebRequest(address) as HttpWebRequest;
            request.Timeout = 60000;
            return request;
        }
    }
}
