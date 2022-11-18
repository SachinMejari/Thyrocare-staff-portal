using Staff.Portal.Interfaces;
using Staff.Portal.Models;
using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;
using Staff.Portal.Models.Views;
using Staff.Portal.Service;
using Staff.Portal.Utilities.Constants;
using System;
using System.Text;
using System.Text.RegularExpressions;

namespace Staff.Portal.BizLayer
{
    public class CheckOut
    {
        public SlotRes GetAppointmentSlots(string SrvDNS, AppointmentReq input)
        {
            SlotRes res = new SlotRes();

            IAppointment iIAppointment = new Appointment();

            res = iIAppointment.GetAppointmentSlots(input, SrvDNS);
            var lstTimeSlots= res.lSlotDataRes;
            StringBuilder StrData = new StringBuilder("<option value=''>Select the Slot</option>");

            var TimeType = string.Empty;
            var TimeStr = string.Empty;
            var StartTime = string.Empty;
            if (lstTimeSlots != null)
            {
                foreach (var item in lstTimeSlots)
                {
                    string[] StrSlots = item.Slot.Split(" - ");
                    string[] StrTimes = StrSlots[0].Split(":");

                    if (Convert.ToInt16(StrTimes[0]) >= 12)
                    {
                        TimeType = "PM";
                        if (Convert.ToInt16(StrTimes[0]) > 21)
                        {
                            TimeStr = Convert.ToString(Convert.ToInt16(StrTimes[0]) - 12);
                        }
                        else if (Convert.ToInt16(StrTimes[0]) == 12)
                        {

                            TimeStr = Convert.ToString(Convert.ToInt16(StrTimes[0]));
                        }
                        else
                        {
                            TimeStr = "0" + Convert.ToString(Convert.ToInt16(StrTimes[0]) - 12);
                        }
                    }                  
                    else
                    {
                        TimeType = "AM";
                        TimeStr = StrTimes[0];
                    }
                    StartTime = TimeStr + ":" + StrTimes[1].Substring(0, 2) + ":00" + Symbols.WhiteSpeace + TimeType;
                    StrData.Append("<option value='" + StartTime + "'>" + item.Slot + "</option>");
                }
            }
            StrData.Append("");
            res.ResponseString = Convert.ToString(StrData);
            return res;
        }
    }
}
