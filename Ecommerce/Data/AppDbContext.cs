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

        // ------------------ Configurações de relacionamento ------------------
         protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //base.OnModelCreating(modelBuilder);

            //------------------ Carrinho ------------------
            modelBuilder.Entity<Carrinho>()
                .HasIndex(c => c.ClienteId)
                .IsUnique();

            modelBuilder.Entity<Carrinho>()
                .HasOne(c => c.Cliente)
                .WithOne(c => c.Carrinho)
                .HasForeignKey<Carrinho>(c => c.ClienteId)
                .OnDelete(DeleteBehavior.Cascade);

            //------------------ ItemCarrinho ------------------
            modelBuilder.Entity<ItemCarrinho>()
                .HasOne(ic => ic.Carrinho)
                .WithMany(c => c.Itens)
                .HasForeignKey(ic => ic.CarrinhoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ItemCarrinho>()
                .HasOne(ic => ic.Produto)
                .WithMany()
                .HasForeignKey(ic => ic.ProdutoId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            //------------------ Pedido ------------------
            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Cliente)
                .WithMany(c => c.Pedidos)
                .HasForeignKey(p => p.ClienteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Fatura)
                .WithOne(f => f.Pedido)
                .HasForeignKey<Fatura>(f => f.PedidoId)
                .OnDelete(DeleteBehavior.Cascade);    

            modelBuilder.Entity<ItemPedido>()
                .HasOne(ip => ip.Pedido)
                .WithMany(p => p.Itens)
                .HasForeignKey(ip => ip.PedidoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ItemPedido>()
                .HasOne(ip => ip.Produto)
                .WithMany()
                .HasForeignKey(ip => ip.ProdutoId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            // Precisão de decimais
            modelBuilder.Entity<Produto>().Property(p => p.Preco).HasPrecision(18, 2);
            modelBuilder.Entity<ItemCarrinho>().Property(i => i.PrecoUnitario).HasPrecision(18, 2);
            modelBuilder.Entity<ItemPedido>().Property(ip => ip.PrecoUnitario).HasPrecision(18, 2);
            modelBuilder.Entity<Pedido>().Property(p => p.ValorTotal).HasPrecision(18, 2);
            modelBuilder.Entity<Fatura>().Property(f => f.ValorTotal).HasPrecision(18, 2);
            
       }
    }
}
