namespace Ecommerce.DTOs
{
    public class ItemPedidoDTO
    {
        public int Quantidade { get; set; }
        public ProdutoDTO Produto { get; set; } = null!;
    }
}