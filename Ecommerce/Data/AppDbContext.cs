using Microsoft.EntityFrameworkCore;
using Ecommerce.Models;

namespace ECOMMERCE.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Produto> Produtos { get; set; }
    public DbSet<Pedido> Pedidos { get; set; }
    public DbSet<ItemPedido> ItensPedido { get; set; }
    public DbSet<Fatura> Faturas { get; set; }
    public DbSet<MeioPagamento> MeiosPagamento { get; set; }
}
