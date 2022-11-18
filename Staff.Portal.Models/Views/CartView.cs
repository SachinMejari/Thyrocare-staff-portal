using Staff.Portal.Models.ServiceResponse;
using System.Collections.Generic;

namespace Staff.Portal.Models.Views
{
    public class CartView
    {
        public BeneficiaryDetails beneficiaryDetails { get; set; }
        public List<Cart> lstCart { get; set; }
        public string Products { get; set; }
        public string GrossAmount { get; set; }
        public int Discount { get; set; }
        public string PayableAmout { get; set; }      
        public int HardCopyRate { get; set; }
        public string Note { get; set; }
        public string isPrepaidAllow { get; set; }
        public string CMLT { get; set; }
        public string Margin { get; set; }
        public string PassOn { get; set; }
        public string RefCode { get; set; }
        public string RespId { get; set; }
        public string Response { get; set; }
        public string Credit { get; set; }
        public string COLLECTCHARGES { get; set; }
        public string chcCharges { get; set; }
        public string chcLabel { get; set; }
        public string allowedBookingsDays { get; set; }
    }
}
