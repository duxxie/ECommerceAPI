using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // ------------------ DbSets ------------------
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Carrinho> Carrinhos { get; set; }
        public DbSet<ItemCarrinho> ItensCarrinho { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<ItemPedido> ItensPedido { get; set; }
        public DbSet<Fatura> Faturas { get; set; }
        // public DbSet<MeioPagamento> MeiosPagamento { get; set; }

        // ------------------ Configurações de relacionamento ------------------
        // protected override void OnModelCreating(ModelBuilder modelBuilder)
        // {
        //     base.OnModelCreating(modelBuilder);

            // ------------------ Carrinho ------------------
            // modelBuilder.Entity<Carrinho>()
            //     .HasOne(c => c.Cliente)
            //     .WithOne(cl => cl.Carrinhos)
            //     .HasForeignKey<Carrinho>(c => c.ClienteId)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<ItemCarrinho>()
            //     .HasOne(ic => ic.Carrinho)
            //     .WithMany(c => c.Itens)
            //     .HasForeignKey(ic => ic.CarrinhoId);

            // modelBuilder.Entity<ItemCarrinho>()
            //     .HasOne(ic => ic.Produto)
            //     .WithMany(p => p.ItensCarrinho)
            //     .HasForeignKey(ic => ic.ProdutoId);

            // ------------------ Pedido ------------------
            // modelBuilder.Entity<Pedido>()
            //     .HasOne(p => p.Cliente)
            //     .WithMany(c => c.Pedidos)
            //     .HasForeignKey(p => p.ClienteId)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<ItemPedido>()
            //     .HasOne(ip => ip.Pedido)
            //     .WithMany(p => p.Itens)
            //     .HasForeignKey(ip => ip.PedidoId);

            // modelBuilder.Entity<ItemPedido>()
            //     .HasOne(ip => ip.Produto)
            //     .WithMany(p => p.ItensPedido)
            //     .HasForeignKey(ip => ip.ProdutoId);

            // ------------------ Fatura ------------------
            // modelBuilder.Entity<Fatura>()
            //     .HasOne(f => f.Pedido)
            //     .WithOne(p => p.Fatura)
            //     .HasForeignKey<Fatura>(f => f.PedidoId)
            //     .OnDelete(DeleteBehavior.Cascade);

            // modelBuilder.Entity<Fatura>()
            //     .HasOne(f => f.MeioPagamento)
            //     .WithMany(mp => mp.Faturas)
            //     .HasForeignKey(f => f.MeioPagamentoId)
            //     .OnDelete(DeleteBehavior.Restrict);

            // ------------------ StatusEntrega ------------------
            // modelBuilder.Entity<StatusEntrega>()
            //     .HasOne(se => se.Pedido)
            //     .WithOne(p => p.StatusEntrega)
            //     .HasForeignKey<StatusEntrega>(se => se.PedidoId)
            //     .OnDelete(DeleteBehavior.Cascade);

            // ------------------ MeioPagamento ------------------
            // modelBuilder.Entity<MeioPagamento>()
            //     .HasMany(mp => mp.Faturas)
            //     .WithOne(f => f.MeioPagamento)
            //     .HasForeignKey(f => f.MeioPagamentoId)
            //     .OnDelete(DeleteBehavior.Restrict);
       // }
    }
}
