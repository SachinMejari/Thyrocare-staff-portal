using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Models.ServicePayLoad
{
    public class ProductReq
    {
        public string apiKey { get; set; }
        public string productType { get; set; }
        public string Mobile { get; set; }
        public string Coupon { get; set; }
        public bool CDE { get; set; }
    }
}
