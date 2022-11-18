using System.Collections.Generic;

namespace Staff.Portal.Models.ServiceResponse
{
    public class OrderDataResponse
    {
        public string Address { get; set; }
        public string BookedBy { get; set; }
        public string CustomerRate { get; set; }
        public string Email { get; set; }
        public string Fasting { get; set; }
        public string Mobile { get; set; }
        public string Mode { get; set; }
        public PostOrderDataResponseLst orderResponseDetails { get; set; }
        public string OrderNo { get; set; }
        public string PayType { get; set; }
        public string Product { get; set; }
        public string RefOrderId { get; set; }
        public string ReportHardCopy { get; set; }
        public string Response { get; set; }
        public string RespId { get; set; }
        public string ServiceType { get; set; }
        public string Status { get; set; }
        public string Appointment { get; set; }
        public string PaymentStatus { get; set; }
        public string CollectionType { get; set; }
        public string QR { get; set; }
        public List<CollectionCenter> CollectionCenters { get; set; }
    }
    public class CollectionCenter
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string Location { get; set; }
        public string City { get; set; }
        public string Mobile { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string Available { get; set; }
        public string WhatsNo { get; set; }
    }

    public class PostOrderDataResponseLst
    {
        public List<PostOrderData> postOrderDataResponse { get; set; }
    }
}
