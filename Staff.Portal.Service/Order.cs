using Newtonsoft.Json;
using System;
using Staff.Portal.Interfaces;
using Staff.Portal.Models;
using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;
using Staff.Portal.Utilities.Constants;

namespace Staff.Portal.Service
{
    public class Order : IOrder
    {
        public OrderDataResponse PostOrder(string sDNS, OrderDataPayload InOrderData, string accessToken)
        {
            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.PostOrderData, sDNS);
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Header = new System.Collections.Generic.Dictionary<string, string>();
            SrvData.Header.Add("Authorization", "Bearer " + accessToken);
            SrvData.Payload = JsonConvert.SerializeObject(InOrderData);
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);

            OrderDataResponse Response;
            if (string.IsNullOrEmpty(SrvData.Response))
            {
                Response = new OrderDataResponse();
                Response.Response = TextConstants.GenericErrorMsg;
            }
            else
            {
                try
                {
                    Response = JsonConvert.DeserializeObject<OrderDataResponse>(SrvData.Response);

                    if (object.Equals(Response.RespId, StatusConstants.RES02012) && !string.IsNullOrEmpty(Response.OrderNo) && !string.IsNullOrEmpty(InOrderData.apptDate.Trim()))
                    {
                        FixAppointment ObjFixAppt = new FixAppointment()
                        {
                            VisitId = Response.OrderNo,
                            Pincode = InOrderData.pincode,
                            AppointmentDate = InOrderData.apptDate
                        };

                        var Output_Fix = FixAppointment(ObjFixAppt);
                    }
                }
                catch (Exception ex)
                {
                    Response = new OrderDataResponse();
                    Response.Response = TextConstants.GenericErrorMsg;
                }
            }
            return Response;
        }

        private bool FixAppointment(FixAppointment INFixAppt)
        {
            var SrvData = new ServiceData();
            SrvData.Url = APIUrls.FixAppointment;
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Payload = JsonConvert.SerializeObject(INFixAppt);
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);
            return object.Equals(SrvData.Response, StatusConstants.SUCCESS);
        }



    }
}
