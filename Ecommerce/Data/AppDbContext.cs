using Microsoft.EntityFrameworkCore;
using Ecommerce.Models;

namespace Ecommerce.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Produto> Produtos => Set<Produto>();
    public DbSet<Carrinho> Carrinhos => Set<Carrinho>();
    public DbSet<ItemCarrinho> ItensCarrinho => Set<ItemCarrinho>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();
    public DbSet<ItemPedido> ItensPedido => Set<ItemPedido>();
    public DbSet<Fatura> Faturas => Set<Fatura>();
    public DbSet<StatusEntrega> StatusEntregas => Set<StatusEntrega>();
    public DbSet<MeioPagamento> MeiosPagamento => Set<MeioPagamento>();
}
