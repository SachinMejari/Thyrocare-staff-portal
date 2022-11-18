using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;
using System.Collections.Generic;

namespace Staff.Portal.Interfaces
{
    public interface ICustomer
    {
        lastAvailedRes lastAvailedDtl(string SrvDNS, lastAvailedReq input, string accessToken);
        EmailRes ValidateEmail(string SrvDns, EmailReq EmailReq, Dictionary<string, string> Header);
    }
}
