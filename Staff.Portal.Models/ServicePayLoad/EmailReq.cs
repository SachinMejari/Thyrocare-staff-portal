using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Models.ServicePayLoad
{
    public class EmailReq
    {
        public string emailId { get; set; }
        public string appId { get; set; }
        public string apiKey { get; set; }
    }
}
