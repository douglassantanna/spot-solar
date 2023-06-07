using System;
using System.Collections.Generic;

namespace api.Models;

public class Proposal
{
    public Proposal()
    {
    }
    public string CustomerFullName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerTelephoneNumber { get; set; } = string.Empty;
    public int ServiceType { get; set; }
    public int WarrantyType { get; set; }
    public int WarrantyQtd { get; set; }
    public int ExcecutionTime { get; set; }
    public string Power { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string Neighborhood { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public List<Product> Products { get; set; } = new List<Product>();
    public DateTime CreatedAt { get; set; }
    public int TotalPriceProducts { get; set; }
    public int LabourValue { get; set; }
    public int TotalPrice { get; set; }
    public string Notes { get; set; } = string.Empty;
    public string PartitionKey { get; set; } = string.Empty;
    public string RowKey { get; set; } = string.Empty;
    public string[] PaymentMethods { get; set; } = new string[] { };

}
public class Product
{
    public Product()
    {

    }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
}