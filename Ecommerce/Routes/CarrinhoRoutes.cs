using Ecommerce.Data;
using Ecommerce.Models;
using Ecommerce.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Routes
{
    public static class CarrinhoRoutes
    {
        public static void MapCarrinhoRoutes(this WebApplication app)
        {
            var group = app.MapGroup("/carrinhos");

            // 🔹 GET: /carrinhos
            group.MapGet("/", async (AppDbContext db) =>
            {
                var carrinhos = await db.Carrinhos
                    .Include(c => c.Itens)
                    .ThenInclude(i => i.Produto)
                    .Include(c => c.Cliente)
                    .ToListAsync();

                var carrinhoDtos = carrinhos.Select(c => new CarrinhoDTO
                {
                    Id = c.Id,
                    ClienteId = c.ClienteId,
                    NomeCliente = c.Cliente?.Nome ?? "Cliente não identificado",
                    Itens = c.Itens.Select(i => new ItemCarrinhoDTO
                    {
                        Id = i.Id,
                        ProdutoId = i.ProdutoId,
                        NomeProduto = i.Produto.Nome,
                        Quantidade = i.Quantidade,
                        Preco = i.Produto.Preco
                    }).ToList()
                });

                return Results.Ok(carrinhoDtos);
            });

            // 🔹 GET: /carrinhos/{clienteId}
            group.MapGet("/cliente/{clienteId:int}", async (int clienteId, AppDbContext db) =>
            {
                var carrinho = await db.Carrinhos
                    .Include(c => c.Itens)
                    .ThenInclude(i => i.Produto)
                    .Include(c => c.Cliente)
                    .FirstOrDefaultAsync(c => c.ClienteId == clienteId);

                if (carrinho is null)
                    return Results.NotFound();

                var carrinhoDto = new CarrinhoDTO
                {
                    Id = carrinho.Id,
                    ClienteId = carrinho.ClienteId,
                    NomeCliente = carrinho.Cliente?.Nome ?? "Cliente não identificado",
                    Itens = carrinho.Itens.Select(i => new ItemCarrinhoDTO
                    {
                        Id = i.Id,
                        ProdutoId = i.ProdutoId,
                        NomeProduto = i.Produto.Nome,
                        Quantidade = i.Quantidade,
                        Preco = i.Produto.Preco
                    }).ToList()
                };

                return Results.Ok(carrinhoDto);
            });

            // 🔹 POST: /carrinhos
            group.MapPost("/", async (AppDbContext db, CarrinhoCreateDTO carrinhoDto) =>
            {
                var clienteExiste = await db.Clientes.AnyAsync(c => c.Id == carrinhoDto.ClienteId);
                if (!clienteExiste)
                    return Results.BadRequest("Cliente não encontrado.");

                var carrinho = new Carrinho
                {
                    ClienteId = carrinhoDto.ClienteId,
                    Itens = carrinhoDto.Itens.Select(i => new ItemCarrinho
                    {
                        ProdutoId = i.ProdutoId,
                        Quantidade = i.Quantidade
                    }).ToList()
                };

                db.Carrinhos.Add(carrinho);
                await db.SaveChangesAsync();

                return Results.Created($"/carrinhos/{carrinho.Id}", new { carrinho.Id });
            });

            // 🔹 DELETE: /carrinhos/{id}
            group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
            {
                var carrinho = await db.Carrinhos.FindAsync(id);
                if (carrinho is null)
                    return Results.NotFound();

                db.Carrinhos.Remove(carrinho);
                await db.SaveChangesAsync();

                return Results.NoContent();
            });
        }
    }
}
