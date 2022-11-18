using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;
using System.Collections.Generic;

namespace Staff.Portal.Interfaces
{
    public interface IAppointment
    {
        SlotRes GetAppointmentSlots(AppointmentReq input, string SrvDNS);
        int FisAppointmentSlot(FixAppointment INAppointment);
    }
}
