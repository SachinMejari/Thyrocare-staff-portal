using System.Net;
using System.Collections.Generic;

namespace Staff.Portal.Models
{
    public class ServiceData
    {
        public string Url { get; set; }
        public string Method { get; set; }
        public string Payload { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public string Response { get; set; }
        public Dictionary<string, string> Header { get; set; }
    }
}
