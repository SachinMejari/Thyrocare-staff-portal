using System.Collections.Generic;

namespace Staff.Portal.Models.Views
{
    public class Checkout
    {
        public int PayableAmount { get; set; }
        public string Prodcuts { get; set; }
        public string Hardcopy { get; set; }
        public string IsFastingRequired { get; set; }
        public string Beneficiaries { get; set; }
        public string Address { get; set; }
        public int NoOfBeneficiary { get; set; }
    }
    public class DoctorList
    {
        public string Name { get; set; }
        public string Code { get; set; }
    }
    public class CheckoutData
    {
        public CartView Cart { get; set; }
        public Checkout Checkout { get; set; }

        public List<DoctorList> Doctors { get; set; }
    }
}
