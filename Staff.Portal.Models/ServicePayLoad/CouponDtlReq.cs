using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Models.ServicePayLoad
{
    public class CouponDtlReq
    {
        public string ApiKey { get; set; }
        public string CouponCode { get; set; }
    }
}
