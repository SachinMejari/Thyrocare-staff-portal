using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Models.ServicePayLoad
{
    public class CovidRateReq
    {
        public string ApiKey { get; set; }
        public string pincode { get; set; }
        public string ServiceDNS { get; set; }
    }

    public class CollectionReq
    {
        public string ApiKey { get; set; }
        public string pincode { get; set; }
        public string ServiceDNS { get; set; }
    }
}
