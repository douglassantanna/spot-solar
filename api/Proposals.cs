using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using api.Models;
using System;
using Microsoft.WindowsAzure.Storage;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Azure;
using Azure.Data.Tables;

namespace api
{
    public static class Proposals
    {
        [FunctionName("GetAllProposals")]
        public static async Task<IActionResult> GetAllProposals(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "proposal/get-all")] HttpRequest request,
            [Table("Proposals")] TableClient tableClient,
            ILogger log
        )
        {
            AsyncPageable<ProposalDTO> queryResults = tableClient.QueryAsync<ProposalDTO>();

            return new OkObjectResult(queryResults);
        }
        [FunctionName("GetProposalById")]
        public static IActionResult GetProposalById(
           [HttpTrigger(AuthorizationLevel.Function, "get", Route = "proposal/get-by-id/{id}")] HttpRequest request,
           [Table("Proposals", "proposals", "{id}")] Proposal proposalEntity,
           string id,
           ILogger log)
        {
            if (proposalEntity == null)
            {
                log.LogInformation($"Proposal not found with id '{id}'.");
                return new NotFoundResult();
            }

            log.LogInformation($"Retrieved proposal with id '{id}'.");
            List<ProductDTO> products = new();
            foreach (var product in proposalEntity.Products)
            {
                products.Add(new ProductDTO { Name = product.Name, Quantity = product.Quantity });
            }
            var proposalDTO = new ProposalDTO
            {
                CustomerFullName = proposalEntity.CustomerFullName,
                CustomerEmail = proposalEntity.CustomerEmail,
                CustomerTelephoneNumber = proposalEntity.CustomerTelephoneNumber,
                ServiceType = proposalEntity.ServiceType,
                WarrantyType = proposalEntity.WarrantyType,
                WarrantyQtd = proposalEntity.WarrantyQtd,
                ExcecutionTime = proposalEntity.ExcecutionTime,
                Power = proposalEntity.Power,
                ZipCode = proposalEntity.ZipCode,
                Street = proposalEntity.Street,
                Neighborhood = proposalEntity.Neighborhood,
                City = proposalEntity.City,
                State = proposalEntity.State,
                Products = products,
                CreatedAt = proposalEntity.CreatedAt,
                TotalPriceProducts = proposalEntity.TotalPriceProducts,
                LabourValue = proposalEntity.LabourValue,
                TotalPrice = proposalEntity.TotalPrice,
                Notes = proposalEntity.Notes,
                PartitionKey = proposalEntity.PartitionKey,
                RowKey = proposalEntity.RowKey
            };
            return new OkObjectResult(proposalDTO);
        }

        [FunctionName("CreateProposal")]
        [return: Table("Proposals")]
        public static Proposal Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "proposal/create-proposal")] Proposal proposalEntity,
            ILogger log)
        {
            try
            {
                log.LogInformation("Gravando proposta no banco..");
                List<Product> products = new();
                foreach (var product in proposalEntity.Products)
                {
                    products.Add(product);
                }
                var today = DateTime.Now;
                var proposal = new Proposal
                {
                    CustomerFullName = proposalEntity.CustomerFullName,
                    CustomerEmail = proposalEntity.CustomerEmail,
                    CustomerTelephoneNumber = proposalEntity.CustomerTelephoneNumber,
                    ServiceType = proposalEntity.ServiceType,
                    WarrantyType = proposalEntity.WarrantyType,
                    WarrantyQtd = proposalEntity.WarrantyQtd,
                    ExcecutionTime = proposalEntity.ExcecutionTime,
                    Power = proposalEntity.Power,
                    ZipCode = proposalEntity.ZipCode,
                    Street = proposalEntity.Street,
                    Neighborhood = proposalEntity.Neighborhood,
                    City = proposalEntity.City,
                    State = proposalEntity.State,
                    Products = products,
                    CreatedAt = today,
                    TotalPriceProducts = proposalEntity.TotalPriceProducts,
                    LabourValue = proposalEntity.LabourValue,
                    TotalPrice = proposalEntity.TotalPrice,
                    Notes = proposalEntity.Notes,
                    PartitionKey = "proposals",
                    RowKey = Guid.NewGuid().ToString()
                };
                return proposal;
            }
            catch (StorageException ex)
            {
                log.LogError($"Algo deu errado. Error: {ex.Message}");
                throw;
            }
        }

        // [FunctionName("CreateCustomer")]
        // [return: Table("Customers")]
        // public static Customer CreateCustomer([HttpTrigger(AuthorizationLevel.Function, "post", Route = "create-customer")] Customer customer, ILogger log)
        // {
        //     var id = Guid.NewGuid().ToString();
        //     var newCustomer = new Customer
        //     {
        //         Id = id,
        //         Name = customer.Name,
        //         Email = customer.Email,
        //         PartitionKey = customer.Email,
        //         RowKey = id,
        //         Document = new Document
        //         {
        //             Id = customer.Document.Id,
        //             Name = customer.Document.Name
        //         }
        //     };
        //     return newCustomer;
        // }

        // [FunctionName("GetCustomerById")]
        // public static IActionResult GetCustomerById(
        //     [HttpTrigger(AuthorizationLevel.Function, "get", Route = "get-customer-by-id/{email}/{id}")] HttpRequest request,
        //     [Table("Customers", "{email}", "{id}")] Customer customer,
        //     string email,
        //     string id,
        //     ILogger log)
        // {
        //     if (customer == null)
        //     {
        //         log.LogInformation($"Customer not found with email '{email}' and id '{id}'.");
        //         return new NotFoundResult();
        //     }

        //     log.LogInformation($"Retrieved customer with email '{email}' and id '{id}'.");
        //     var customerDto = new CustomerDto
        //     {
        //         Id = customer.RowKey,
        //         Name = customer.Name,
        //         Email = customer.Email,
        //         PartitionKey = customer.PartitionKey,
        //         RowKey = customer.RowKey,
        //         Document = new Document
        //         {
        //             Id = customer.Document.Id,
        //             Name = customer.Document.Name
        //         }
        //     };
        //     return new OkObjectResult(customerDto);
        // }

        // [FunctionName("GetAllCustomers")]
        // public static async Task<IActionResult> GetAllCustomer(
        //     [HttpTrigger(AuthorizationLevel.Function, "get", Route = "get-all-customers")] HttpRequest request,
        //     [Table("Customers")] TableClient tableClient,
        //     ILogger log
        // )
        // {
        //     var emailFilter = request.Query["email"];
        //     AsyncPageable<CustomerDto> queryResults = tableClient.QueryAsync<CustomerDto>(filter: $"Email eq '{emailFilter}'");
        //     return new OkObjectResult(queryResults);
        // }
    }
}


public class CustomerDto : ITableEntity
{
    public CustomerDto()
    {
    }

    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PartitionKey { get; set; } = string.Empty;
    public string RowKey { get; set; } = string.Empty;
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
    public Document Document { get; set; } = default;

}
public class Customer
{
    public Customer()
    {
    }

    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PartitionKey { get; set; } = string.Empty;
    public string RowKey { get; set; } = string.Empty;
    public Document Document { get; set; } = default;
}
public class Document
{
    public Document()
    {

    }
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

public class MyPoco
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string Text { get; set; }
}
