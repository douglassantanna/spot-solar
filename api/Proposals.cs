using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using api.Models;
using System;
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.WindowsAzure.Storage;
using System.Collections.Generic;

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

        [FunctionName("TableOutput")]
        [return: Table("MyTable")]
        public static Customer TableOutput([HttpTrigger(AuthorizationLevel.Function, "post", Route = "table-output")] Customer customer, ILogger log)
        {
            Customer newCustomer = new(customer.Name, customer.Email, Guid.NewGuid());
            return newCustomer;
        }
    }
}
public class Customer : TableEntity
{
    public Customer(string name,
                    string email,
                    Guid partitionKey) : base(partitionKey.ToString(), email)
    {
        Id = partitionKey;
        Name = name;
        Email = email;
    }

    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; private set; }
}
public class MyPoco
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; }
    public string Text { get; set; }
}
