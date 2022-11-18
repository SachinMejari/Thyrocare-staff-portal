using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;

namespace Staff.Portal.Interfaces
{
    public interface ISpecialServiceType
    {
        SpecialServiceTypeRes GetSpecialServiceType(string SrvDNS, PincodeReq input);
    }
}
