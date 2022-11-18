using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Models.ServicePayLoad
{
   public class RefDoctorListsRes
    {
        public string Response { get; set; }
        public string ResId { get; set; }
        public List<DoctorsList> DoctorsList { get; set; }
    }
    public class DoctorsList
    {
        public string Id { get; set; }
        public string NAME { get; set; }
    }
}
