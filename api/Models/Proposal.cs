using System;
using System.Collections.Generic;
using Microsoft.WindowsAzure.Storage.Table;

namespace api.Models;

public class ProposalEntity : TableEntity
{
    public ProposalEntity(Guid proposalId,
                          CustomerEntity customer,
                          ServiceEntity service,
                          AddressEntity address,
                          List<ProductEntity> products,
                          DateTime createdAt,
                          int totalPriceProducts,
                          int labourValue,
                          int totalPrice,
                          string notes) : base(partitionKey: customer.Email, rowKey: proposalId.ToString())
    {

        ProposalId = proposalId;
        Customer = customer;
        Service = service;
        Address = address;
        Products = products;
        CreatedAt = createdAt;
        TotalPriceProducts = totalPriceProducts;
        LabourValue = labourValue;
        TotalPrice = totalPrice;
        Notes = notes;
    }

    public ProposalEntity()
    {
    }
    public Guid ProposalId { get; set; }
    public CustomerEntity Customer { get; set; }
    public ServiceEntity Service { get; set; }
    public AddressEntity Address { get; set; }
    public List<ProductEntity> Products { get; set; }
    public DateTime CreatedAt { get; set; }
    public int TotalPriceProducts { get; set; }
    public int LabourValue { get; set; }
    public int TotalPrice { get; set; }
    public string Notes { get; set; }
}
public class CustomerEntity : TableEntity
{
    public CustomerEntity()
    {
    }

    public CustomerEntity(Guid customerId,
                          string customerFullName,
                          string email,
                          string telephoneNumber) : base(partitionKey: email, rowKey: customerId.ToString())
    {
        CustomerId = customerId;
        CustomerFullName = customerFullName;
        Email = email;
        TelephoneNumber = telephoneNumber;
    }
    public Guid CustomerId { get; set; }
    public string CustomerFullName { get; set; }
    public string Email { get; set; }
    public string TelephoneNumber { get; set; }
}
public class ServiceEntity : TableEntity
{
    public ServiceEntity()
    {
    }

    public ServiceEntity(Guid serviceId,
                         int serviceType,
                         int warrantyType,
                         int warrantyQtd,
                         int excecutionTime,
                         string power) : base(partitionKey: serviceType.ToString(), rowKey: serviceId.ToString())
    {
        ServiceId = serviceId;
        ServiceType = serviceType;
        WarrantyType = warrantyType;
        WarrantyQtd = warrantyQtd;
        ExcecutionTime = excecutionTime;
        Power = power;
    }
    public Guid ServiceId { get; set; }
    public int ServiceType { get; set; }
    public int WarrantyType { get; set; }
    public int WarrantyQtd { get; set; }
    public int ExcecutionTime { get; set; }
    public string Power { get; set; }
}
public class AddressEntity : TableEntity
{
    public AddressEntity()
    {
    }

    public AddressEntity(Guid addressId,
                         string zipCode,
                         string street,
                         string neighborhood,
                         string city,
                         string state,
                         string notes) : base(partitionKey: zipCode, rowKey: addressId.ToString())
    {
        AddressId = addressId;
        ZipCode = zipCode;
        Street = street;
        Neighborhood = neighborhood;
        City = city;
        State = state;
        Notes = notes;
    }
    public Guid AddressId { get; set; }
    public string ZipCode { get; set; }
    public string Street { get; set; }
    public string Neighborhood { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string Notes { get; set; }
}
public class ProductEntity : TableEntity
{
    public ProductEntity()
    {

    }

    public ProductEntity(Guid productId,
                         string name,
                         int quantity) : base(partitionKey: name, rowKey: productId.ToString())
    {
        ProductId = productId;
        Name = name;
        Quantity = quantity;
    }
    public void SetPartitionAndRowKeys()
    {
        PartitionKey = Name;
        RowKey = "";
    }
    public Guid ProductId { get; set; }
    public string Name { get; set; }
    public int Quantity { get; set; }
}