using Staff.Portal.Models;

namespace Staff.Portal.Utilities
{
    public class FormatterUtilitie
    {
        public static GenericModel GetGenericModel(string key, string value)
        {
            return new GenericModel { key = key, value = value };
        }
    }
}
