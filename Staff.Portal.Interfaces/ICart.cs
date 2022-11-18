using Staff.Portal.Models.ServiceResponse;

namespace Staff.Portal.Interfaces
{
    public interface ICart
    {
        ViewCart GetViewCart(Models.ServicePayLoad.ViewCart InViewCart, string accessToken);
        ViewCart GetViewCartCoupon(Models.ServicePayLoad.ViewCart InViewCart, string accessToken);
        CovidRateRes CovidCart(Models.ServicePayLoad.CovidRateReq rateReq, string accessToken);
        CollectionpinRes CollectionPincode(Models.ServicePayLoad.CollectionReq collectionpinRes, string accessToken);
        TXDoctorsRes TXDoctors(string Coupon);
        GetUserType GetUserType(string Mobile);
    }
}
