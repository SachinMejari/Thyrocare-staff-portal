using Staff.Portal.Models.ServiceResponse;
using System.Collections.Generic;

namespace Staff.Portal.Models.Views
{
    public class OrdersView
    {
        public List<BookingMaster> UpComing { get; set; }
        public List<BookingMaster> Completed { get; set; }
        public List<BookingMaster> Cancelled { get; set; }
    }
}
