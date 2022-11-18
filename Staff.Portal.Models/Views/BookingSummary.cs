using System.Collections.Generic;
using Staff.Portal.Models.ServiceResponse;

namespace Staff.Portal.Models.Views
{
    public class BookingSummary
    {
        public string OrderDate { get; set; }
        public string OrderNo { get; set; }
        public string PaymentMode { get; set; }
        public string ReportHardcopy { get; set; }
        public string Fasting { get; set; }
        public string Appointment { get; set; }
        public string ModeOfCommunication { get; set; }
        public List<PostOrderData> Beneficiaries { get; set; }
        public string Tests { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string PaymentStatus { get; set; }
        public string CustomerRate { get; set; }
        public string BookedBy { get; set; }
        public string QR { get; set; }
        public List<CollectionCenter> CollectionCenters { get; set; }
    }
}
