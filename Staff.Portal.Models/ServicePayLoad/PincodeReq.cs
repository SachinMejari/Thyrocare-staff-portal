using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Models.ServicePayLoad
{
    public class PincodeReq
    {
        public string apiKey { get; set; }
        public string pincode { get; set; }
        public string accessToken { get; set; }
    }
}
