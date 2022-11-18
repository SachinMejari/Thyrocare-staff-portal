using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Models.ServiceResponse
{
    public class SpecialServiceTypeRes
    {
        public List<TechniciansSafety> techniciansSafety { get; set; }
        public List<ServiceType> serviceType { get; set; }
        public List<ServiceType> reportServices { get; set; }
        public string respId { get; set; }
        public string response { get; set; }
    }
    public class TechniciansSafety
    {
        public string id { get; set; }
        public string rate { get; set; }
        public string serviceName { get; set; }
    }

    public class ServiceType
    {
        public string id { get; set; }
        public string rate { get; set; }
        public string serviceName { get; set; }
    }
}
