using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Models.ServiceResponse
{
    public class CovidRateRes
    {
        public string Test { get; set; }
        public string Rate { get; set; }
        public string Response { get; set; }
        public string RespId { get; set; }
    }
    public class CollectionpinRes
    {
        public List<Center> CenterList { get; set; }
        public string RespId { get; set; }
        public string Response { get; set; }
        public bool Flag { get; set; }
    }
    public class Center
    {
        public string CenterName { get; set; }
        public string City { get; set; }
        public string Location { get; set; }
        public string Address { get; set; }
        public string MissNo { get; set; }
        public string WhatsNo { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string Time { get; set; }

    }
}
