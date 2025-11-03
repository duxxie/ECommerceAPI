namespace Ecommerce.DTOs
{
    public class CarrinhoCreateDTO
    {
        public int ClienteId { get; set; }
        public List<ItemCarrinhoCreateDTO> Itens { get; set; } = new();
    }

    public class ItemCarrinhoCreateDTO
    {
        public int ProdutoId { get; set; }
        public int Quantidade { get; set; }
    }
}
