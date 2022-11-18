using Staff.Portal.Models.Views;
using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Models.ServiceResponse
{
    public class TXDoctorsRes
    {
        public List<DoctorList> Doctors { get; set; }
        public string Response { get; set; }
        public string RespId { get; set; }
    }
}
