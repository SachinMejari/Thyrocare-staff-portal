using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;
using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Interfaces
{
    public interface ILogin
    {
        Login GetValidateSignIn(string SrvDNS, UserLogin objUser);
    }
}
