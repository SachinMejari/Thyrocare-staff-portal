using System.Collections.Generic;

namespace Staff.Portal.Models.ServiceResponse
{
    public class TestDetails
    {
        public string additionalTests { get; set; }
        public string hcrInclude { get; set; }
        public string bookedCount { get; set; }
        public string New { get; set; }
        public string aliasName { get; set; }
        public string benMax { get; set; }
        public string benMin { get; set; }
        public string benMultiple { get; set; }
        public List<Tests> childs { get; set; }
        public string code { get; set; }
        public string diseaseGroup { get; set; }
        public string edta { get; set; }
        public string fasting { get; set; }
        public string fluoride { get; set; }
        public string groupName { get; set; }
        public string hc { get; set; }
        public string imageLocation { get; set; }
        public string category { get; set; }        
        public List<imageLocation> imageMaster { get; set; }
        public string margin { get; set; }
        public string name { get; set; }
        public string normalVal { get; set; }
        public string payType { get; set; }
        public Rate rate { get; set; }
        public string serum { get; set; }
        public string specimenType { get; set; }
        public string testCount { get; set; }
        public string testNames { get; set; }
        public string type { get; set; }
        public string units { get; set; }
        public string urine { get; set; }
        public string validTo { get; set; }
        public string volume { get; set; }
        public int rank { get; set; }
    }
}
