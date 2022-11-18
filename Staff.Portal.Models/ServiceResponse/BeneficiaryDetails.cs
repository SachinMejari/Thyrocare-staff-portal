using System.Collections.Generic;

namespace Staff.Portal.Models.ServiceResponse
{
    public class BeneficiaryDetails
    {
        public List<Beneficiary> BENDETAILS { get; set; }
        public string RESPONSE { get; set; }
        public string RESPID { get; set; }
        public string USERTYPE { get; set; }
    }
}
