using Ecommerce.Data;
using Ecommerce.DTOs;
using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Routes
{
    public static class PedidoRoutes
    {
        public static void MapPedidoRoutes(this WebApplication app)
        {
            var group = app.MapGroup("/pedidos");

            // GET /pedidos
            group.MapGet("/", async (AppDbContext db) =>
            {
                var lista = await db.Pedidos
                    .Select(p => new PedidoDTO
                    {
                        Id = p.Id,
                        DataPedido = p.DataPedido,
                        ValorTotal = p.ValorTotal,

                        Cliente = p.Cliente == null ? null : new ClienteDTO
                        {
                            Id = p.Cliente.Id,
                            Nome = p.Cliente.Nome
                        },

                        Itens = p.Itens.Select(i => new ProdutoDTO
                        {
                            Id = i.Produto!.Id,
                            Nome = i.Produto.Nome,
                            Preco = i.Produto.Preco,
                            Quantidade = i.Quantidade
                        }).ToList(),

                        Fatura = p.Fatura == null ? null : new FaturaDTO
                        {
                            Id = p.Fatura.Id,
                            ValorTotal = p.Fatura.ValorTotal,
                            MeioPagamento = p.Fatura.MeioPagamento == null ? null : new MeioPagamentoDTO
                            {
                                Id = p.Fatura.MeioPagamento.Id,
                                Tipo = p.Fatura.MeioPagamento.Tipo,
                                Descricao = p.Fatura.MeioPagamento.Descricao
                            }
                        },

                        StatusEntrega = p.StatusEntrega == null ? null : new StatusEntregaDTO
                        {
                            Id = p.StatusEntrega.Id,
                            Status = p.StatusEntrega.Status,
                            DataEnvio = p.StatusEntrega.DataEnvio,
                            DataEntrega = p.StatusEntrega.DataEntrega
                        }
                    })
                    .ToListAsync();

                return Results.Ok(lista);
            });

            // GET /pedidos/{id}
            group.MapGet("/{id:int}", async (int id, AppDbContext db) =>
            {
                var pedido = await db.Pedidos
                    .Where(p => p.Id == id)
                    .Select(p => new PedidoDTO
                    {
                        Id = p.Id,
                        DataPedido = p.DataPedido,
                        ValorTotal = p.ValorTotal,

                        Cliente = p.Cliente == null ? null : new ClienteDTO
                        {
                            Id = p.Cliente.Id,
                            Nome = p.Cliente.Nome
                        },

                        Itens = p.Itens.Select(i => new ProdutoDTO
                        {
                            Id = i.Produto!.Id,
                            Nome = i.Produto.Nome,
                            Preco = i.Produto.Preco,
                            Quantidade = i.Quantidade
                        }).ToList(),

                        Fatura = p.Fatura == null ? null : new FaturaDTO
                        {
                            Id = p.Fatura.Id,
                            ValorTotal = p.Fatura.ValorTotal,
                            MeioPagamento = p.Fatura.MeioPagamento == null ? null : new MeioPagamentoDTO
                            {
                                Id = p.Fatura.MeioPagamento.Id,
                                Tipo = p.Fatura.MeioPagamento.Tipo,
                                Descricao = p.Fatura.MeioPagamento.Descricao
                            }
                        },

                        StatusEntrega = p.StatusEntrega == null ? null : new StatusEntregaDTO
                        {
                            Id = p.StatusEntrega.Id,
                            Status = p.StatusEntrega.Status,
                            DataEnvio = p.StatusEntrega.DataEnvio,
                            DataEntrega = p.StatusEntrega.DataEntrega
                        }
                    })
                    .FirstOrDefaultAsync();

                return pedido is not null ? Results.Ok(pedido) : Results.NotFound();
            });

            // POST /pedidos  (aceita o model para simplificar)
            group.MapPost("/", async (Pedido pedido, AppDbContext db) =>
            {
                // Opcional: recalcular ValorTotal com base nos itens
                if (pedido.Itens?.Count > 0)
                {
                    decimal total = 0m;

                    foreach (var item in pedido.Itens)
                    {
                        var prod = await db.Produtos.FirstOrDefaultAsync(x => x.Id == item.ProdutoId);
                        if (prod == null)
                            return Results.BadRequest($"Produto {item.ProdutoId} não encontrado.");

                        // se seu ItemPedido tem PrecoUnitario, garanta persistência do preço praticado
                        item.PrecoUnitario = prod.Preco;
                        total += prod.Preco * item.Quantidade;
                    }

                    pedido.ValorTotal = total;
                }

                db.Pedidos.Add(pedido);
                await db.SaveChangesAsync();

                return Results.Created($"/pedidos/{pedido.Id}", new { pedido.Id });
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