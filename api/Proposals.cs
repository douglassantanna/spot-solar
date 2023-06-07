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
using System.Linq;

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

            string[] paymentMethods = { };
            foreach (var paymentMethod in proposalEntity.PaymentMethods)
            {
                paymentMethods.Append(paymentMethod);
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
                RowKey = proposalEntity.RowKey,
                PaymentMethods = paymentMethods
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

                string[] paymentMethods = { };
                foreach (var paymentMethod in proposalEntity.PaymentMethods)
                {
                    paymentMethods.Append(paymentMethod);
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
                    RowKey = Guid.NewGuid().ToString(),
                    PaymentMethods = paymentMethods
                };
                return proposal;
            }
            catch (StorageException ex)
            {
                log.LogError($"Algo deu errado. Error: {ex.Message}");
                throw;
            }
        }
    }
}