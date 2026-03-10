namespace Ecommerce.Models
{
    public class Carrinho
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }
        public List<ItemCarrinho> Itens { get; set; } = new();
        public decimal Total => Itens.Sum(i => i.Quantidade * i.PrecoUnitario);
        public int TotalItens => Itens.Sum(i => (int?)i.Quantidade) ?? 0;
    }
}
