using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Models.ServiceResponse
{
    public class SlotRes
    {
        public string ResponseString { get; set; }
        public List<TimeSlot> lSlotDataRes { get; set; }
        public string response { get; set; }
        public string respId { get; set; }
    }

    
}
