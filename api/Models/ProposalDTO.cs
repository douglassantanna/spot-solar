using System;
using System.Collections.Generic;
using Azure;
using Azure.Data.Tables;

namespace api.Models;

public class ProposalDTO : ITableEntity
{
    public ProposalDTO()
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
    public List<ProductDTO> Products { get; set; } = new List<ProductDTO>();
    public DateTime CreatedAt { get; set; }
    public int TotalPriceProducts { get; set; }
    public int LabourValue { get; set; }
    public int TotalPrice { get; set; }
    public string Notes { get; set; } = string.Empty;
    public string PartitionKey { get; set; } = string.Empty;
    public string RowKey { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}
public class ProductDTO
{
    public ProductDTO()
    {

    }
    public string Name { get; set; }
    public int Quantity { get; set; }
}
