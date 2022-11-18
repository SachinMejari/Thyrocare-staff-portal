using Newtonsoft.Json;
using Staff.Portal.Interfaces;
using Staff.Portal.Models;
using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;
using Staff.Portal.Utilities.Constants;
using System.Collections.Generic;

namespace Staff.Portal.Service
{
    public class Appointment : IAppointment
    {
        public SlotRes GetAppointmentSlots(AppointmentReq input,string SrvDNS)
        {
            var SrvData = new ServiceData();
            if(input.product== "COVID-19")
            {
                SrvData.Url = string.Format(APIUrls.CovidSlot, SrvDNS);
            }
            else
            {
                SrvData.Url = string.Format(APIUrls.GetSlot, SrvDNS);
            }
            
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Payload = JsonConvert.SerializeObject(input);
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);

            SlotRes Response;
            if (string.IsNullOrEmpty(SrvData.Response))
            {
                Response = new SlotRes();
            }
            else
            {
                Response = JsonConvert.DeserializeObject<SlotRes>(SrvData.Response);
            }
            return Response;
        }

        public int FisAppointmentSlot(FixAppointment INAppointment)
        {
            var SrvData = new ServiceData();
            SrvData.Url = APIUrls.FixAppointment;
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Payload = JsonConvert.SerializeObject(INAppointment);
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);

            var Response = 0;
            if (string.IsNullOrEmpty(SrvData.Response))
            {
                Response = 0;
            }
            else
            {
                Response = 1;
            }
            return Response;
        }
    }
}
