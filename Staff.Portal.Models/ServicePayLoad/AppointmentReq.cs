using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Models.ServicePayLoad
{
    public class AppointmentReq
    {
        public string apiKey { get; set; }
        public string pincode { get; set; }
        public string date { get; set; }
        public string product { get; set; }
        public string projectId { get; set; }

    }
}
