using Newtonsoft.Json;
using Staff.Portal.Interfaces;
using Staff.Portal.Models;
using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;
using Staff.Portal.Utilities.Constants;

namespace Staff.Portal.Service
{
    public class PincodeService: IPincodeService
    {
        public PinCodeService CheckPinServiceable(string SrvDNS, PincodeReq input, string accessToken)
        {
            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.CheckPincodeService, SrvDNS);
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Header = new System.Collections.Generic.Dictionary<string, string>();
            SrvData.Header.Add("Authorization", "Bearer " + accessToken);
            SrvData.Payload = JsonConvert.SerializeObject(input);
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);

            PinCodeService PincodeServiceRes;
            if (string.IsNullOrEmpty(SrvData.Response))
            {
                PincodeServiceRes = new PinCodeService();
            }
            else
            {
                PincodeServiceRes = JsonConvert.DeserializeObject<PinCodeService>(SrvData.Response);
            }
            return PincodeServiceRes;
        }
        public RefDoctorListsRes GetDoctorLists(PincodeReq input)
        {
            RefDoctorListsRes refDoctorListsRes = new RefDoctorListsRes();
            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.GetDoctorLists, input.pincode);
            SrvData.Method = APIConstants.APIMethodGET;
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);
            if (string.IsNullOrEmpty(SrvData.Response))
            {
                refDoctorListsRes = new RefDoctorListsRes();
            }
            else
            {
                refDoctorListsRes = JsonConvert.DeserializeObject<RefDoctorListsRes>(SrvData.Response);
            }

            return refDoctorListsRes;
        }
    }
}
