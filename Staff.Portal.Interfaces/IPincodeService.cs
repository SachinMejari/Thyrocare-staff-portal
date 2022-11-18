using Staff.Portal.Models.ServicePayLoad;

namespace Staff.Portal.Interfaces
{
    public interface IPincodeService
    {
        Models.ServiceResponse.PinCodeService CheckPinServiceable(string SrvDNS, PincodeReq input, string accessToken);

        Models.ServicePayLoad.RefDoctorListsRes GetDoctorLists( PincodeReq input);
    }
}
