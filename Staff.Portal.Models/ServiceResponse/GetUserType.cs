using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Models.ServiceResponse
{
    public class GetUserType
    {
        public string RespId { get; set; }
        public string Response { get; set; }
        public List<Source> Users { get; set; }
    }
    public class Source
    {
        public string type { get; set; }
    }
}
