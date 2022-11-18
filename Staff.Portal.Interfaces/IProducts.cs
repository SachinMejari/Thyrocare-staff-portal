using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;

namespace Staff.Portal.Interfaces
{
    public interface IProducts
    {
        Products GetProductsInfo(string SrvDNS, ProductReq input, string accessToken);
    }
}
