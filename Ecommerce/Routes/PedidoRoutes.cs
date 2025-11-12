using Ecommerce.Data;
using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Routes
{
    public static class PedidoRoutes
    {
        public static void MapPedidoRoutes(this WebApplication app)
        {
            var group = app.MapGroup("/pedidos");


            group.MapGet("/", async (AppDbContext db) =>
                await db.Pedidos
                    .AsNoTracking()
                    .Select(p => new
                    {
                        p.Id,
                        p.ClienteId,
                        p.DataPedido,
                        p.StatusEntrega,
                        p.ValorTotal,
                        Itens = p.Itens.Select(i => new
                        {
                            i.Id,
                            i.ProdutoId,
                            i.Quantidade,
                            i.PrecoUnitario
                        })
                    })
                    .ToListAsync()
            );

            group.MapGet("/{idPedido:int}", async (int idPedido, AppDbContext db) =>
            {
                var pedido = await db.Pedidos
                    .AsNoTracking()
                    .Where(p => p.Id == idPedido)
                    .Select(p => new
                    {
                        p.Id,
                        p.DataPedido,
                        p.StatusEntrega,
                        p.ValorTotal,
                        Itens = p.Itens.Select(i => new
                        {
                            i.Id,
                            i.ProdutoId,
                            i.Produto!.Nome,
                            i.Produto.Descricao,
                            i.Quantidade,
                            i.PrecoUnitario
                        }),
                        Cliente = p.Cliente == null ? null : new
                        {
                            p.ClienteId,
                            p.Cliente.Nome,
                            p.Cliente.Email,
                            p.Cliente.Telefone,
                            p.Cliente.Endereco
                        }
                    })
                    .FirstOrDefaultAsync();

                return pedido is null ? Results.NotFound("Pedido não encontrado") : Results.Ok(pedido);
            });

            // POST /pedidos  (aceita o model para simplificar)
            group.MapPost("/", async (Pedido pedidoCreate, AppDbContext db) =>
            {
                var clienteExiste = await db.Clientes.AnyAsync(c => c.Id == pedidoCreate.ClienteId);
                if (!clienteExiste) return Results.BadRequest("Cliente não encontrado");

                var carrinho = await db.Carrinhos
                    .Include(c => c.Itens)
                    .ThenInclude(i => i.Produto)
                    .FirstOrDefaultAsync(c => c.ClienteId == pedidoCreate.ClienteId);

                if (carrinho is null || carrinho.Itens.Count == 0)
                    throw new InvalidOperationException("Carrinho vazio.");

                var pedido = new Pedido
                {
                    ClienteId = pedidoCreate.ClienteId,
                    Itens = carrinho.Itens.Select(i => new ItemPedido
                    {
                        ProdutoId = i.ProdutoId,
                        Quantidade = i.Quantidade,
                        PrecoUnitario = i.PrecoUnitario
                    }).ToList()
                };

                pedido.ValorTotal = pedido.Itens.Sum(x => x.Quantidade * x.PrecoUnitario);

                foreach (var i in carrinho.Itens)
                {
                    if (i.Produto != null)
                    {
                        if (i.Produto.Estoque < i.Quantidade)
                        {
                            throw new InvalidOperationException($"Sem estoque para {i.Produto.Nome}.");
                        }
                        i.Produto.Estoque -= i.Quantidade;
                    }
                }

                carrinho.Itens.Clear();
                db.Pedidos.Add(pedido);
                await db.SaveChangesAsync();

                var pedidoRead = await db.Pedidos
                    .AsNoTracking()
                    .Where(p => p.Id == pedido.Id)
                    .Select(p => new
                    {
                        p.Id,
                        p.DataPedido,
                        p.StatusEntrega,
                        p.ValorTotal,
                        Itens = p.Itens.Select(i => new
                        {
                            i.Id,
                            i.ProdutoId,
                            i.Produto!.Nome,
                            i.Produto.Descricao,
                            i.Quantidade,
                            i.PrecoUnitario
                        }),
                        Cliente = p.Cliente == null ? null : new
                        {
                            p.ClienteId,
                            p.Cliente.Nome,
                            p.Cliente.Email,
                            p.Cliente.Telefone,
                            p.Cliente.Endereco
                        }
                    })
                    .FirstAsync();

                return Results.Created($"/pedidos/{pedido.Id}", pedidoRead);
            });

            // DELETE /pedidos/{id}
            group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
            {
                var pedido = await db.Pedidos.FindAsync(id);
                if (pedido is null) return Results.NotFound();

                db.Pedidos.Remove(pedido);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }
}