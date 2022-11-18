using Staff.Portal.Models;
using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;

namespace Staff.Portal.Interfaces
{
    public interface IOrder
    {
        OrderDataResponse PostOrder(string sDNS, OrderDataPayload OrderData, string accessToken);       
    }
}
