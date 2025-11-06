namespace Ecommerce.Models
{
    public class Cliente
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public List<Pedido> Pedidos { get; set; } = new();
        public Carrinho? Carrinho { get; set; }
        public int IdCarrinho { get; set; }
    }
}
