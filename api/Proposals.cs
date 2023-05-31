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
        [FunctionName("Proposals")]
        [return: Table("Proposals")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "create-proposal")] ProposalEntity proposalEntity,
            ILogger log)
        {
            try
            {
                log.LogInformation("Gravando proposta no banco..");

                CustomerEntity customerEntity = new(Guid.NewGuid(),
                                                    proposalEntity.Customer.CustomerFullName,
                                                    proposalEntity.Customer.Email,
                                                    proposalEntity.Customer.TelephoneNumber);
                AddressEntity addressEntity = new(Guid.NewGuid(),
                                                  proposalEntity.Address.ZipCode,
                                                  proposalEntity.Address.Street,
                                                  proposalEntity.Address.Neighborhood,
                                                  proposalEntity.Address.City,
                                                  proposalEntity.Address.State,
                                                  proposalEntity.Address.Notes);
                ServiceEntity serviceEntity = new(Guid.NewGuid(),
                                                  proposalEntity.Service.ServiceType,
                                                  proposalEntity.Service.WarrantyType,
                                                  proposalEntity.Service.WarrantyQtd,
                                                  proposalEntity.Service.ExcecutionTime,
                                                  proposalEntity.Service.Power);
                List<ProductEntity> products = new();
                foreach (var product in proposalEntity.Products)
                {
                    products.Add(product);
                }
                ProposalEntity proposal = new(Guid.NewGuid(),
                                              customerEntity,
                                              serviceEntity,
                                              addressEntity,
                                              products,
                                              proposalEntity.CreatedAt,
                                              proposalEntity.TotalPriceProducts,
                                              proposalEntity.LabourValue,
                                              proposalEntity.TotalPrice,
                                              proposalEntity.Notes);


                return new OkObjectResult("deu certo");
            }
            catch (StorageException ex)
            {
                log.LogError($"Algo deu errado. Error: {ex.Message}");
                throw;
            }
        }

        [FunctionName("CreateCustomer")]
        [return: Table("Customers")]
        public static Customer CreateCustomer([HttpTrigger(AuthorizationLevel.Function, "post", Route = "create-customer")] Customer customer, ILogger log)
        {
            var id = Guid.NewGuid().ToString();
            var newCustomer = new Customer
            {
                Id = id,
                Name = customer.Name,
                Email = customer.Email,
                PartitionKey = customer.Email,
                RowKey = id
            };
            return newCustomer;
        }

        [FunctionName("GetCustomerById")]
        public static IActionResult GetCustomerById(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "get-customer-by-id/{email}/{id}")] HttpRequest request,
            [Table("Customers", "{email}", "{id}")] Customer customer,
            string email,
            string id,
            ILogger log)
        {
            if (customer == null)
            {
                log.LogInformation($"Customer not found with email '{email}' and id '{id}'.");
                return new NotFoundResult();
            }

            log.LogInformation($"Retrieved customer with email '{email}' and id '{id}'.");
            var customerDto = new CustomerDto
            {
                Id = customer.RowKey,
                Name = customer.Name,
                Email = customer.Email,
                PartitionKey = customer.PartitionKey,
                RowKey = customer.RowKey
            };
            return new OkObjectResult(customerDto);
        }

        [FunctionName("GetAllCustomers")]
        public static async Task<IActionResult> GetAllCustomer(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "get-all-customers")] HttpRequest request,
            [Table("Customers")] TableClient tableClient,
            ILogger log
        )
        {
            var emailFilter = request.Query["email"];
            AsyncPageable<CustomerDto> queryResults = tableClient.QueryAsync<CustomerDto>(filter:$"Email eq '{emailFilter}'");
            return new OkObjectResult(queryResults);
        }
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
}

public class MyPoco
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string Text { get; set; }
}
